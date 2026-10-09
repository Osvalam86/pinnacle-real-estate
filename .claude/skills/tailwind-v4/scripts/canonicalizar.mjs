#!/usr/bin/env node
/**
 * canonicalizar.mjs — verificación mecánica de clases de Tailwind CSS v4.
 *
 * Usa el Tailwind instalado en el proyecto y su theme real para reportar:
 *   1. Clases con forma canónica más corta   (mt-[68px] → mt-17, !flex → flex!)
 *   2. Sintaxis riesgosa o fuera de las reglas (bg-[--x], outline-none, space-x-*)
 *   3. Corchetes que quedan                   (con tokens o pasos de escala del mismo valor)
 *   4. Clases que no generan CSS              (typo, token inexistente o clase ajena)
 *
 * Uso (desde la raíz del proyecto):
 *   node canonicalizar.mjs [--css <entrada.css>] [rutas...]
 *   node canonicalizar.mjs --clases "mt-[68px] !flex bg-[var(--brand)]"
 *
 * Opciones:
 *   --css <archivo>     CSS de entrada (el que contiene @import "tailwindcss").
 *                       Si se omite, se busca en el proyecto.
 *   --clases "<lista>"  Revisa una lista de clases en lugar de archivos.
 *   --rem <px>          Tamaño de la fuente raíz para convertir px ↔ rem (16).
 *   --ignorar <regex>   Clases que no deben reportarse como "sin CSS" (ej. "^js-").
 *   --cwd <carpeta>     Raíz del proyecto (por defecto, la carpeta actual).
 *   --json              Salida en JSON.
 *
 * Códigos de salida:
 *   0  sin hallazgos corregibles (secciones 1 y 2 vacías)
 *   1  hay hallazgos corregibles
 *   2  no se pudo cargar Tailwind, compilar el CSS o usar su API interna
 *   3  error de uso: falta --css, no hay archivos o una ruta no existe
 *
 * Nota: se apoya en `__unstable__loadDesignSystem`, una API interna de Tailwind.
 * Si una versión futura la cambia, el script sale con código 2 y un mensaje
 * claro; en ese caso la verificación se hace a mano con las tablas de
 * references/valores-y-corchetes.md y references/v3-a-v4.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// ───────────────────────────── argumentos ─────────────────────────────

const args = process.argv.slice(2);
const opt = { css: null, clases: null, rem: 16, ignorar: null, cwd: process.cwd(), json: false, rutas: [] };

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--css') opt.css = args[++i];
  else if (a === '--clases' || a === '--classes') opt.clases = args[++i];
  else if (a === '--rem') opt.rem = Number(args[++i]) || 16;
  else if (a === '--ignorar') opt.ignorar = new RegExp(args[++i]);
  else if (a === '--cwd') opt.cwd = path.resolve(args[++i]);
  else if (a === '--json') opt.json = true;
  else if (a === '-h' || a === '--help') { imprimirAyuda(); process.exit(0); }
  else opt.rutas.push(a);
}

function imprimirAyuda() {
  const fuente = fs.readFileSync(new URL(import.meta.url), 'utf8');
  const cabecera = fuente.slice(fuente.indexOf('/**'), fuente.indexOf('*/') + 2);
  console.log(cabecera.replace(/^\/\*\*|\*\/$/g, '').replace(/^ \* ?/gm, '').trim());
}

function salirConError(mensaje, codigo = 2) {
  if (opt.json) console.log(JSON.stringify({ error: mensaje, codigo }, null, 2));
  else console.error(`\n✖ ${mensaje}\n`);
  process.exit(codigo);
}
const ERROR_DE_USO = 3;

// ───────────────────── carga de Tailwind del proyecto ─────────────────────

const DIRECTORIOS_IGNORADOS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.angular', '.astro',
  '.svelte-kit', '.output', '.cache', '.turbo', 'coverage', 'vendor', '_site', 'public',
]);

async function cargarApiDeTailwind() {
  const requireProyecto = createRequire(path.join(opt.cwd, 'package.json'));
  const anfitriones = ['@tailwindcss/vite', '@tailwindcss/postcss', '@tailwindcss/cli', '@tailwindcss/webpack'];
  const intentos = [() => requireProyecto.resolve('@tailwindcss/node')];
  for (const anfitrion of anfitriones) {
    intentos.push(() => createRequire(requireProyecto.resolve(anfitrion)).resolve('@tailwindcss/node'));
  }

  let ruta = null;
  for (const intento of intentos) {
    try { ruta = intento(); break; } catch { /* siguiente */ }
  }
  if (!ruta) {
    salirConError(
      'No se encontró Tailwind CSS v4 en este proyecto (@tailwindcss/vite, @tailwindcss/postcss o @tailwindcss/cli).\n' +
      '  Ejecuta el script desde la raíz del proyecto o indica --cwd <carpeta>.'
    );
  }

  const modulo = await import(pathToFileURL(ruta).href);
  const cargar = modulo.__unstable__loadDesignSystem ?? modulo.default?.__unstable__loadDesignSystem;
  if (typeof cargar !== 'function') {
    salirConError(
      'La versión instalada de Tailwind no expone la API de design system que usa este script.\n' +
      '  Verifica a mano con references/valores-y-corchetes.md y references/v3-a-v4.md.'
    );
  }
  return cargar;
}

// El CSS de entrada suele estar a 1–3 niveles de la raíz (src/styles/app.css, app/globals.css).
// Cinco niveles cubren monorepos sin recorrer árboles enteros.
const PROFUNDIDAD_MAXIMA_CSS = 5;

function buscarCssDeEntrada() {
  const candidatos = [];
  const visitar = (dir, nivel) => {
    if (nivel > PROFUNDIDAD_MAXIMA_CSS) return;
    let entradas;
    try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entradas) {
      if (e.name.startsWith('.') && e.name !== '.') continue;
      const ruta = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!DIRECTORIOS_IGNORADOS.has(e.name)) visitar(ruta, nivel + 1);
      } else if (e.name.endsWith('.css')) {
        let texto = '';
        try { texto = fs.readFileSync(ruta, 'utf8'); } catch { continue; }
        if (/@import\s+(?:url\()?["']tailwindcss["']/.test(texto)) candidatos.push(ruta);
      }
    }
  };
  visitar(opt.cwd, 0);
  return candidatos;
}

// ───────────────────────────── extracción ─────────────────────────────

const EXTENSIONES = new Set([
  '.html', '.htm', '.njk', '.nunjucks', '.hbs', '.handlebars', '.twig', '.liquid', '.ejs',
  '.pug', '.astro', '.vue', '.svelte', '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mdx',
  '.php', '.erb', '.cshtml', '.razor',
]);

function listarArchivos(rutas) {
  const archivos = [];
  // Las rutas indicadas explícitamente se recorren aunque se llamen dist, public o _site;
  // la lista de ignorados solo aplica a las subcarpetas que se encuentran al recorrer.
  const visitar = (ruta, explicita = false) => {
    let info;
    try { info = fs.statSync(ruta); } catch {
      if (explicita) salirConError(`No existe la ruta ${path.relative(opt.cwd, ruta) || ruta}`, ERROR_DE_USO);
      return;
    }
    if (info.isDirectory()) {
      if (!explicita && DIRECTORIOS_IGNORADOS.has(path.basename(ruta))) return;
      for (const nombre of fs.readdirSync(ruta)) {
        if (nombre.startsWith('.')) continue;
        visitar(path.join(ruta, nombre));
      }
    } else if (EXTENSIONES.has(path.extname(ruta)) || ruta.endsWith('.blade.php')) {
      archivos.push(ruta);
    }
  };
  for (const r of rutas) visitar(path.resolve(opt.cwd, r), true);
  return archivos;
}

// Una clase real rara vez pasa de 120 caracteres (las más largas son plantillas de grid o calc()).
// El límite descarta cadenas largas de código o texto que no pueden ser clases.
const LONGITUD_MAXIMA_DE_CLASE = 200;

const CARACTERES_DE_CLASE = /^[!@*\-\[A-Za-z][A-Za-z0-9_\-:.\/\[\]()!@#%&>~+*=,'"^$|?<]*$/;

/** Tokens de una línea que podrían ser clases: se parte por espacios y comillas. */
function tokensDeLinea(linea) {
  const tokens = new Set();
  for (const separador of [/[\s"`]+/, /[\s"'`]+/]) {
    for (let pieza of linea.split(separador)) {
      pieza = pieza.replace(/^(?:class(?:Name)?|:class|\[class\]|\[ngClass\]|ngClass)=[{"'`]*/, '');
      for (const variante of [pieza, pieza.replace(/^[{(,;]+|[},;]+$/g, '')]) {
        if (variante.length > 1 && variante.length <= LONGITUD_MAXIMA_DE_CLASE && CARACTERES_DE_CLASE.test(variante)) tokens.add(variante);
      }
    }
  }
  return tokens;
}

// Líneas que son solo comentario: su texto no se analiza (evita falsos positivos en ejemplos comentados).
const ES_COMENTARIO = /^\s*(?:\/\/|\/\*|\*|\{\s*\/\*|<!--|\{#)/;

const ATRIBUTO_CLASS = /(?:^|[\s<])(?:class|className)\s*=\s*(?:\{\s*)?(["'`])([\s\S]*?)\1/g;
const BLOQUES_DE_PLANTILLA = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\$\{[\s\S]*?\}|<%[\s\S]*?%>|\{#[\s\S]*?#\}/g;

/** Listas de clases escritas como texto fijo en atributos class / className. */
function atributosDeClase(texto) {
  const listas = [];
  for (const m of texto.matchAll(ATRIBUTO_CLASS)) {
    const valor = m[2].replace(BLOQUES_DE_PLANTILLA, ' ');
    const clases = valor.split(/\s+/).filter((c) => c && CARACTERES_DE_CLASE.test(c) && !/[{}$]/.test(c));
    if (clases.length) listas.push({ clases, linea: texto.slice(0, m.index).split('\n').length });
  }
  return listas;
}

// ───────────────────────────── análisis ─────────────────────────────

const REGLAS = [
  {
    prueba: (c) => /\[--[\w-]+\]/.test(c),
    mensaje: (c) => `variable sin var(): genera CSS inválido → usa ${c.replace(/\[(--[\w-]+)\]/g, '($1)')}`,
  },
  {
    prueba: (c) => /(^|:)outline-none!?$/.test(c),
    mensaje: () => 'quita el outline también en modo de alto contraste → usa outline-hidden (o un focus-visible: con outline propio)',
  },
  {
    prueba: (c) => /(^|:)-?space-[xy]-/.test(c),
    mensaje: () => 'separación por margin entre hijos → usa flex o grid con gap-*',
  },
];

const ES_AUXILIAR = /^(group|peer)(\/[\w-]+)?$/;

function analizar(ds, entradas) {
  // entradas: [{ archivo, linea, tokens:Set<string>, listas:[{clases, linea}] }]
  const cache = new Map(); // clase → { css:boolean, canonica:string }

  const resolver = (clases) => {
    const nuevas = [...new Set(clases)].filter((c) => !cache.has(c));
    if (!nuevas.length) return;
    const css = ds.candidatesToCss(nuevas);
    nuevas.forEach((c, i) => {
      let canonica = c;
      if (css[i]) {
        try { canonica = ds.canonicalizeCandidates([c], { rem: opt.rem })[0] ?? c; } catch { canonica = c; }
      }
      cache.set(c, { css: Boolean(css[i]), canonica });
    });
  };

  const canonicas = [];
  const riesgos = [];
  const corchetes = new Map(); // clase → [ubicaciones]
  const sinCss = new Map();    // clase → [ubicaciones]
  const colapsos = [];

  for (const e of entradas) {
    resolver([...e.tokens]);
    for (const clase of e.tokens) {
      const r = cache.get(clase);
      if (!r.css) continue;
      const donde = e.archivo ? `${e.archivo}:${e.linea}` : '';
      if (r.canonica !== clase) canonicas.push({ donde, clase, canonica: r.canonica });
      for (const regla of REGLAS) {
        if (regla.prueba(clase)) riesgos.push({ donde, clase, motivo: regla.mensaje(clase) });
      }
      const final = r.canonica;
      if (/\[/.test(final) && !/\[--[\w-]+\]/.test(final)) {
        if (!corchetes.has(final)) corchetes.set(final, []);
        corchetes.get(final).push(donde);
      }
    }

    for (const lista of e.listas ?? []) {
      resolver(lista.clases);
      const donde = e.archivo ? `${e.archivo}:${lista.linea}` : '';
      for (const clase of lista.clases) {
        if (cache.get(clase).css || ES_AUXILIAR.test(clase)) continue;
        if (opt.ignorar?.test(clase)) continue;
        if (!sinCss.has(clase)) sinCss.set(clase, []);
        sinCss.get(clase).push(donde);
      }
      // Colapso de utilidades (w-4 h-4 → size-4)
      // El colapso solo se calcula sobre clases sin corchetes: con valores arbitrarios,
      // Tailwind elige tokens por coincidencia de valor y puede proponer uno de otro rol.
      const validas = lista.clases.filter((c) => cache.get(c).css && !cache.get(c).canonica.includes('['));
      if (validas.length > 1) {
        try {
          const base = validas.map((c) => cache.get(c).canonica);
          const colapsadas = ds.canonicalizeCandidates(validas, { rem: opt.rem, collapse: true });
          const quitadas = base.filter((c) => !colapsadas.includes(c));
          const agregadas = colapsadas.filter((c) => !base.includes(c));
          if (quitadas.length && agregadas.length && colapsadas.length < base.length) {
            colapsos.push({ donde, clase: quitadas.join(' '), canonica: agregadas.join(' ') });
          }
        } catch { /* la opción collapse puede no existir en versiones anteriores */ }
      }
    }
  }

  return { canonicas: [...canonicas, ...colapsos], riesgos, corchetes, sinCss };
}

// ───────────────── sugerencias para corchetes que quedan ─────────────────
//
// El canonicalizador de Tailwind no propone nada cuando dos opciones tienen el mismo valor
// (un primitivo y el semántico que lo referencia, o un paso de la escala y un --spacing-*).
// Aquí se listan esas opciones para que se elija la que corresponde al rol del diseño.

// Namespaces cuyos tokens pueden reemplazar un valor en corchetes.
const NAMESPACES_SUGERIBLES = [
  '--color-', '--background-color-', '--text-color-', '--border-color-', '--spacing-', '--radius-',
  '--text-', '--leading-', '--tracking-', '--font-weight-', '--container-', '--blur-',
];

function normalizarValor(valor, rem) {
  let v = String(valor).trim().toLowerCase().replace(/\s+/g, ' ');
  const hexCorto = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (hexCorto) v = `#${hexCorto[1]}${hexCorto[1]}${hexCorto[2]}${hexCorto[2]}${hexCorto[3]}${hexCorto[3]}`;
  const px = v.match(/^(-?\d*\.?\d+)px$/);
  if (px) return `${Number(px[1]) / rem}rem`;
  const r = v.match(/^(-?\d*\.?\d+)rem$/);
  if (r) return `${Number(r[1])}rem`;
  return v;
}

function indiceDelTheme(ds, rem) {
  const entradas = new Map();
  try { for (const [nombre, { value }] of ds.theme.entries()) entradas.set(nombre, value); } catch { return null; }
  const resolver = (valor, profundidad = 0) => {
    const ref = String(valor).match(/^var\((--[\w-]+)\)$/);
    if (ref && entradas.has(ref[1]) && profundidad < 5) return resolver(entradas.get(ref[1]), profundidad + 1);
    return valor;
  };
  const indice = new Map(); // valor normalizado → [{ namespace, nombre }]
  for (const [variable, valor] of entradas) {
    if (/--[\w-]+--/.test(variable.slice(2))) continue; // subpropiedades como --text-x--line-height
    const namespace = NAMESPACES_SUGERIBLES.filter((n) => variable.startsWith(n)).sort((a, b) => b.length - a.length)[0];
    if (!namespace) continue;
    const clave = normalizarValor(resolver(valor), rem);
    if (!indice.has(clave)) indice.set(clave, []);
    indice.get(clave).push({ variable, nombre: variable.slice(namespace.length) });
  }
  const escala = entradas.get('--spacing');
  return { indice, escalaRem: escala ? Number(normalizarValor(escala, rem).replace('rem', '')) : null };
}

function sugerenciasParaCorchete(ds, clase, theme, rem) {
  const m = clase.match(/^((?:[^\[\]]*?:)?)(-?)([a-z][a-z0-9-]*?)-\[([^\]]+)\](!?)$/);
  if (!m || !theme) return [];
  const [, variantes, negativo, prefijo, valorCrudo, importante] = m;
  const valor = valorCrudo.replace(/^(?:color|length):/, '');
  const clave = normalizarValor(valor, rem);
  // Cada candidata guarda la variable que debe aparecer en su CSS: así `rounded-xs` no se
  // propone para 0.75rem solo porque `--text-xs` también vale 0.75rem.
  const candidatas = new Map(); // clase → variable esperada en el CSS generado
  const enRem = clave.match(/^(-?)(\d*\.?\d+)rem$/);
  const signo = negativo || (enRem && enRem[1]) ? '-' : '';
  const armar = (sufijo) => `${variantes}${signo}${prefijo}-${sufijo}${importante}`;
  for (const { variable, nombre } of theme.indice.get(enRem ? `${enRem[2]}rem` : clave) ?? []) {
    candidatas.set(armar(nombre), variable);
  }
  if (enRem && theme.escalaRem) {
    const n = Number(enRem[2]) / theme.escalaRem;
    if (Number.isFinite(n) && Math.abs(n * 4 - Math.round(n * 4)) < 1e-9) {
      candidatas.set(armar(String(Math.round(n * 4) / 4)), '--spacing');
    }
  }
  if (!candidatas.size) return [];
  const clases = [...candidatas.keys()];
  const css = ds.candidatesToCss(clases);
  return clases.filter((c, i) => css[i] && css[i].includes(`var(${candidatas.get(c)})`));
}

// ───────────────────────────── ejecución ─────────────────────────────

const cargar = await cargarApiDeTailwind();

let cssDeEntrada = opt.css ? path.resolve(opt.cwd, opt.css) : null;
if (!cssDeEntrada) {
  const encontrados = buscarCssDeEntrada();
  if (encontrados.length === 0) salirConError('No se encontró un CSS con @import "tailwindcss". Indícalo con --css <archivo>.', ERROR_DE_USO);
  if (encontrados.length > 1) {
    salirConError(
      'Hay más de un CSS con @import "tailwindcss". Indica cuál usar con --css <archivo>:\n' +
      encontrados.map((r) => `  - ${path.relative(opt.cwd, r)}`).join('\n'),
      ERROR_DE_USO
    );
  }
  cssDeEntrada = encontrados[0];
}
if (!fs.existsSync(cssDeEntrada)) salirConError(`No existe el archivo ${cssDeEntrada}`, ERROR_DE_USO);

let ds;
try {
  ds = await cargar(fs.readFileSync(cssDeEntrada, 'utf8'), { base: path.dirname(cssDeEntrada) });
} catch (error) {
  salirConError(`Tailwind no pudo compilar ${path.relative(opt.cwd, cssDeEntrada)}:\n  ${error.message}`);
}
if (typeof ds.canonicalizeCandidates !== 'function' || typeof ds.candidatesToCss !== 'function') {
  salirConError(
    'La versión instalada de Tailwind no incluye el canonicalizador (requiere una 4.x reciente).\n' +
    '  Verifica a mano con references/valores-y-corchetes.md y references/v3-a-v4.md.'
  );
}

const entradas = [];
if (opt.clases !== null) {
  const clases = opt.clases.split(/\s+/).filter(Boolean);
  entradas.push({ archivo: '', linea: 0, tokens: new Set(clases), listas: [{ clases, linea: 0 }] });
} else {
  const archivos = listarArchivos(opt.rutas.length ? opt.rutas : ['.']);
  if (!archivos.length) salirConError('No se encontraron archivos de plantilla o componentes en las rutas indicadas.', ERROR_DE_USO);
  for (const ruta of archivos) {
    const texto = fs.readFileSync(ruta, 'utf8');
    const archivo = path.relative(opt.cwd, ruta);
    texto.split('\n').forEach((linea, i) => {
      if (ES_COMENTARIO.test(linea)) return;
      const tokens = tokensDeLinea(linea);
      if (tokens.size) entradas.push({ archivo, linea: i + 1, tokens });
    });
    const listas = atributosDeClase(texto);
    if (listas.length) entradas.push({ archivo, linea: 0, tokens: new Set(), listas });
  }
}

const resultado = analizar(ds, entradas);
const theme = indiceDelTheme(ds, opt.rem);

// ───────────────────────────── salida ─────────────────────────────

const agrupar = (mapa) => [...mapa.entries()]
  .map(([clase, ubicaciones]) => ({ clase, veces: ubicaciones.length, ubicaciones: [...new Set(ubicaciones.filter(Boolean))] }))
  .sort((a, b) => b.veces - a.veces || a.clase.localeCompare(b.clase));

const corchetes = agrupar(resultado.corchetes);
const sinCss = agrupar(resultado.sinCss);
const corregibles = resultado.canonicas.length + resultado.riesgos.length;

if (opt.json) {
  console.log(JSON.stringify({
    css: path.relative(opt.cwd, cssDeEntrada),
    canonicas: resultado.canonicas,
    riesgos: resultado.riesgos,
    corchetes: corchetes.map((c) => ({ ...c, sugerencias: sugerenciasParaCorchete(ds, c.clase, theme, opt.rem) })),
    sinCss,
  }, null, 2));
  process.exit(corregibles ? 1 : 0);
}

const titulo = (t) => console.log(`\n${t}\n${'─'.repeat(t.length)}`);
const prefijo = (donde) => (donde ? `${donde}  ` : '');
const resumenUbicaciones = (u) => (u.length ? `  (${u.slice(0, 3).join(', ')}${u.length > 3 ? `, +${u.length - 3}` : ''})` : '');

console.log(`Tailwind: theme leído de ${path.relative(opt.cwd, cssDeEntrada) || cssDeEntrada}`);

titulo(`1. Forma canónica (${resultado.canonicas.length})`);
if (!resultado.canonicas.length) console.log('Sin hallazgos.');
for (const h of resultado.canonicas) console.log(`${prefijo(h.donde)}${h.clase}  →  ${h.canonica}`);

titulo(`2. Sintaxis riesgosa o fuera de regla (${resultado.riesgos.length})`);
if (!resultado.riesgos.length) console.log('Sin hallazgos.');
for (const h of resultado.riesgos) console.log(`${prefijo(h.donde)}${h.clase}  —  ${h.motivo}`);

titulo(`3. Corchetes que quedan (${corchetes.length})`);
if (!corchetes.length) console.log('Ninguno.');
else console.log('Cada uno necesita un motivo. Si aparece "mismo valor", hay un token o un paso de la escala equivalente.');
for (const c of corchetes) {
  const nota = c.veces > 1 ? `  ×${c.veces} → se repite: súbelo a @theme o a @utility` : '';
  console.log(`${c.clase}${nota}${resumenUbicaciones(c.ubicaciones)}`);
  const opciones = sugerenciasParaCorchete(ds, c.clase, theme, opt.rem);
  if (opciones.length) console.log(`    mismo valor: ${opciones.join(' · ')}  (elige según el rol en el diseño)`);
}

titulo(`4. Clases que no generan CSS (${sinCss.length})`);
if (!sinCss.length) console.log('Ninguna.');
else console.log('Puede ser un typo, un token que no existe en el theme o una clase ajena a Tailwind.');
for (const c of sinCss) console.log(`${c.clase}${c.veces > 1 ? `  ×${c.veces}` : ''}${resumenUbicaciones(c.ubicaciones)}`);

console.log(corregibles
  ? `\n✖ ${corregibles} hallazgo(s) por corregir en las secciones 1 y 2.`
  : '\n✔ Sin hallazgos corregibles.');
process.exit(corregibles ? 1 : 0);
