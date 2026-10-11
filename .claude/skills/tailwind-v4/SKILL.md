---
name: tailwind-v4
description: Aplica estilos con Tailwind CSS v4 (4.x, configuración en CSS) sobre un marcado ya resuelto y configura el theme del proyecto con @theme — clases canónicas de la versión, valores directos en lugar de corchetes por inercia, tokens del diseño convertidos en utilidades y sin sintaxis heredada de v3. Usar cuando el proyecto usa Tailwind y se pide estilar o maquetar con clases un componente, vista, sección o layout; configurar o ampliar el theme, los colores, la tipografía, los breakpoints o los modos; instalar Tailwind (Vite, Next, Angular, Nunjucks o HTML); o revisar y limpiar clases (corchetes innecesarios, clases de v3, @apply). También cuando el usuario comparte código con clases de utilidad o menciona @theme, tailwind.config o "clases de Tailwind", aunque no nombre la versión. No define la estructura ni la semántica del marcado, no extrae tokens de Figma y no migra proyectos de v3.
---

# Tailwind CSS v4

Eres el responsable de estilos de un proyecto con Tailwind CSS v4. Recibes un marcado ya resuelto y un diseño, y entregas las clases y el theme que lo reproducen con fidelidad.

**Objetivo**: que cada valor del diseño llegue al código por el camino más corto que Tailwind ofrece. Un token del theme antes que un valor suelto, un valor directo antes que un corchete, y un corchete solo cuando nada más lo expresa.

Tailwind v4 no funciona como SCSS ni como Tailwind v3. La configuración vive en CSS, los tokens son variables CSS que generan utilidades, y la mayoría de las utilidades aceptan valores sin configurarlos. Con hábitos de v3 el código compila, pero queda lleno de corchetes y de sintaxis obsoleta.

## Alcance

**Incluye:**
- Clases de utilidad sobre un marcado existente, en cualquier tecnología (HTML, JSX, Angular, Vue, Nunjucks).
- Configuración del theme con `@theme`: tokens, reset por categoría, modos.
- CSS propio cuando corresponde: `@utility`, `@custom-variant`, `@layer base` y `@layer components`.
- Instalación de Tailwind y CSS de entrada cuando el proyecto no los tiene.
- Limpieza de clases existentes: corchetes innecesarios, sintaxis de v3, `@apply` mal usado.

**Queda fuera:**
- Estructura, semántica y atributos ARIA del marcado. Si faltan o están mal, se señala en una línea y se deja como está.
- Extracción y normalización de tokens desde Figma. Esta skill recibe los valores; no los deduce de un archivo de diseño.
- Animaciones más allá de transiciones de estado.
- Migración de proyectos v3, que tiene su propia herramienta: `npx @tailwindcss/upgrade`.
- Lógica, estado o comportamiento.

**Precedencia**: el encargo manda sobre las convenciones del proyecto (`CLAUDE.md`, theme existente), y estas mandan sobre los valores por defecto de esta skill. Un proyecto que ya tomó una decisión distinta se respeta.

## Flujo de trabajo

Copia esta lista y márcala mientras avanzas:

```
- [ ] Paso 0: contexto (tecnología, versión, CSS de entrada, inventario del theme)
- [ ] Paso 1: theme (tokens que faltan, reset por categoría)
- [ ] Paso 2: cada valor del diseño pasado por la escalera
- [ ] Paso 3: clases escritas con las reglas de v4
- [ ] Paso 4: CSS propio, solo si hace falta
- [ ] Paso 5: script de verificación sin hallazgos en las secciones 1 y 2
- [ ] Paso 6: entrega con reporte
```

### Paso 0 — Contexto del proyecto

1. **Tecnología.** Lee `CLAUDE.md`, `AGENTS.md` o `README.md` y `package.json`. De ahí sale si las clases van en `class` o `className`, y cómo se instala Tailwind.
2. **Versión.** Confirma `tailwindcss` 4.x en `package.json`. `tailwindcss` 3.x, o `@tailwind base;` en el CSS, indica un proyecto v3: detente y avisa, porque estas reglas no aplican.
3. **CSS de entrada.** Localiza el archivo con `@import "tailwindcss"`. Si no existe, Tailwind no está instalado: sigue `references/setup.md`.
4. **Inventario del theme.** Lee todos los bloques `@theme` y lista los tokens disponibles. Ese inventario es la fuente de verdad del Paso 2. Escribir `bg-[#2455d4]` cuando ya existe `--color-blue-600` es el error más frecuente y el más fácil de evitar.
5. **Herramientas de clases.** Si el proyecto usa `clsx`, `cn`, `cva` o `tailwind-merge`, úsalas igual que el resto del código.
6. **Marcado.** Si el elemento todavía no tiene marcado, primero se construye la estructura (con la skill `semantic-markup` si está disponible) y después se aplican las clases. Esta skill no decide elementos ni atributos.

Si la tecnología o el origen de los valores del diseño no quedan claros, pregunta antes de escribir.

### Paso 1 — Theme

Lee `references/theme.md` cada vez que crees o modifiques un `@theme`.

- **Un token del diseño es una variable en `@theme`**, dentro del namespace que genera la utilidad correcta (`--color-*`, `--text-*`, `--radius-*`, etc.).
- **Tokens desde Figma.** Si los valores vienen de un archivo de Figma, se extraen y normalizan con la skill `theme-tokens` si está disponible; genera el `@theme` con esta misma forma. Sin ella, se trabaja con los valores que entregue el usuario.
- **Reset por categoría**: el valor de fábrica de una categoría se vacía (`--color-*: initial`) solo cuando el diseño define esa categoría. Así una clase fuera del diseño no genera CSS y el error se ve de inmediato.

  | Categoría | Acción |
  |---|---|
  | Colores | Reset y paleta del proyecto. Redeclara `--color-white` y `--color-black` si se usan. |
  | Tipografía, radios, sombras, breakpoints | Reset solo si el diseño trae su propia escala. |
  | Spacing (`--spacing`) | Se conserva siempre: de esa escala dependen los valores directos. |

  Se extiende sin resetear en un proyecto sin diseño ni tokens, o cuando una librería depende de la paleta de fábrica. En un proyecto existente, la política de reset se cambia solo si el usuario lo pide.
- **Un estilo de texto de Figma es un solo token** `--text-*` con su interlineado, tracking y peso. Una clase aplica el estilo completo.
- **Normalizar nombres no autoriza inventar valores.** Si el diseño no define un color, un estado o un breakpoint, se reporta como hueco.

### Paso 2 — Escalera de valores

Para cada valor del diseño, baja la escalera y quédate en el primer peldaño que aplique.

| # | Peldaño | Ejemplo | Cuándo |
|---|---|---|---|
| 1 | Token del theme | `bg-surface` `text-heading-lg` `rounded-card` `gap-gutter` | El valor existe en `@theme`. |
| 2 | Valor directo | `mt-17` `w-4.5` `grid-cols-15` `z-45` `aspect-4/3` `opacity-35` | La utilidad acepta el número sin configuración. |
| 3 | Variable CSS | `bg-(--brand)` `w-(--progress)` | El valor cambia en ejecución o viene de una variable ajena al theme. |
| 4 | Subir al theme | nuevo `--radius-card` o `@utility` | El diseño nombra el valor (variable o estilo) y aún no está en `@theme`. Si el diseño no lo nombra, va al peldaño 5 y se reporta como divergencia, aunque se repita. |
| 5 | Corchetes | `grid-cols-[1fr_auto_2fr]` `border-[1.5px]` | Nada de lo anterior lo expresa. |

**Conversión del peldaño 2.** Con la escala de fábrica (`--spacing: 0.25rem`), el número de la clase es `px ÷ 4` y acepta múltiplos de 0.25. Cualquier píxel entero tiene forma directa: 68px es `17`, 18px es `4.5`, 13px es `3.25`, 117px es `29.25`. Un valor fuera de la escala del diseño se escribe así y se reporta como divergencia, sin redondearlo.

**Corchetes legítimos** (resumen; la lista cerrada completa está en `references/valores-y-corchetes.md`, sección 4):

- Plantillas de grid y valores con varias partes: `grid-cols-[1fr_auto_2fr]`.
- Cálculos y funciones CSS: `w-[calc(100%-(--spacing(8)))]`, `text-[clamp(1rem,2vw,1.5rem)]`.
- Decimales o unidades que la familia no admite: `border-[1.5px]`, `leading-[1.35]`, `tracking-[0.02em]`, `w-[37%]`.
- Atributos con valor y selectores sin variante propia: `aria-[current=page]:`, `data-[state=open]:`, `[&>svg]:size-4`.
- Propiedades sin utilidad: `[view-transition-name:card]`.
- Contenido y recursos: `content-['']`, `bg-[url('/img/hero.png')]`.

Antes de escribir un corchete que no reconozcas en esta lista, consulta `references/valores-y-corchetes.md`: casi siempre existe una forma directa.

**Ejemplo.** Diseño de una tarjeta: padding 24px, separación 18px, radio "Card", fondo "Surface", borde de 1.5px "Border/Subtle", ancho máximo 340px y título con el estilo "Heading/LG".

```html
<article class="flex flex-col gap-4.5 max-w-85 p-6 rounded-card border-[1.5px] border-subtle bg-surface">
  <h3 class="text-heading-lg">…</h3>
</article>
```

`p-6` y `gap-4.5` salen de la escala, `max-w-85` es 340 ÷ 4, los tokens cubren radio, fondo, color de borde y estilo de texto, y el único corchete es el grosor de borde, porque `border-*` solo acepta píxeles enteros.

### Paso 3 — Reglas de escritura

**Sintaxis de v4.** La tabla completa está en `references/v3-a-v4.md`. Lo que más se escapa:

| Escribe | En lugar de | Motivo |
|---|---|---|
| `flex!` | `!flex` | El modificador important va al final. |
| `bg-(--brand)` | `bg-[--brand]` | Con corchetes genera CSS inválido sin avisar. |
| `outline-hidden` | `outline-none` | En v4 `outline-none` quita el outline también en alto contraste. |
| `bg-linear-to-r` | `bg-gradient-to-r` | Renombrada. |
| `shrink-0` `grow` | `flex-shrink-0` `flex-grow` | Forma canónica. |
| `shadow-sm` `rounded-sm` `ring-1` | `shadow` `rounded` `ring` | La forma sin valor es un alias heredado; el nombre explícito fija el paso de la escala. `ring` además pasó de 3px a 1px. |
| `bg-black/50` | `bg-opacity-50` | La opacidad es un modificador. |

**Layout.** Lee `references/patrones.md` al maquetar una vista o un layout.

- La separación entre elementos es `gap` en un contenedor flex o grid, para que un hijo pueda moverse u ocultarse sin dejar márgenes sueltos. Donde el diseño usa auto layout, o la separación cabe en un `gap`, no se usa margin (`m-` `mt-` `mb-` `ms-` `me-` `mx-` `my-`) ni `space-x-*` / `space-y-*`. Si el padre no es flex ni grid, se convierte.
- El margin queda para lo que `gap` no puede expresar: centrar un bloque (`mx-auto`) y márgenes negativos cuando el diseño los usa o hacen falta para lograrlo (una separación negativa del auto layout, un solape, un elemento que se sale de su contenedor). Cada margin que no sea `mx-auto` lleva un comentario con su motivo.
- Un hijo que puede quedar vacío (un `role="status"`, un mensaje de error) no deja hueco ni recibe margin: se saca del flujo mientras está vacío.
- Grid para el layout de página y las rejillas; flex para alinear dentro de un componente.
- Móvil primero: la clase sin prefijo es el caso base y los breakpoints suman. `max-md:` queda para excepciones.
- Container queries (`@container` con `@md:`) cuando el componente debe adaptarse a su contenedor y no al viewport.
- Eje horizontal con propiedades lógicas (`ps-` `pe-` `ms-` `me-` `text-start` `border-s`), que respetan la dirección del texto.

**Estados.**

- El estado visual se lee del atributo que ya lo expresa: `aria-expanded:`, `aria-selected:`, `aria-[current=page]:`, `disabled:`, `data-*:`. Así el estilo y la accesibilidad no se desincronizan.
- Foco con `focus-visible:` y un outline con contraste suficiente. Si el diseño oculta el outline del navegador, se reemplaza por otro indicador visible.
- `hover:` es una mejora: en v4 solo aplica en dispositivos con puntero, así que nada esencial depende de él.
- Movimiento condicionado con `motion-safe:` o `motion-reduce:`.

**Clases completas.** Tailwind detecta las clases leyendo los archivos como texto, sin ejecutar código. Una clase armada por partes (`` `bg-${tono}-600` ``, `text-{{ color }}-600`) no existe para el compilador. Los nombres se escriben completos y se eligen con un mapa o un condicional.

**Una propiedad, una clase.** Con dos utilidades que fijan la misma propiedad en el mismo elemento sin variante que las distinga (`p-4 p-6`), el resultado lo decide el orden del CSS generado, no el del atributo. Se deja una.

**Orden de las clases.** Si el proyecto tiene `prettier-plugin-tailwindcss`, ese orden manda. Si no: layout, caja, tipografía, visual, estados, y al final los prefijos responsivos.

### Paso 4 — CSS propio

La repetición se resuelve primero con lo que la tecnología ofrece: un componente, un partial, una macro o un bucle. El CSS propio es para lo que eso no resuelve. Lee `references/css-propio.md` antes de escribirlo.

| Necesidad | Herramienta |
|---|---|
| Un patrón que Tailwind no trae, o que se repite con valores distintos | `@utility` |
| Un estado o condición propia del proyecto (`dark` por `data-theme`, un modo de marca) | `@custom-variant` |
| Valores por defecto de elementos HTML | `@layer base` |
| HTML que no controlas (contenido de un CMS, una librería de terceros) | `@layer components` |

`@apply` se reserva para HTML que no controlas. Sobre marcado propio, una clase de componente con `@apply` duplica en CSS lo que ya está en el markup.

### Paso 5 — Verificación

Ejecuta el script desde la raíz del proyecto, sobre los archivos que tocaste (requiere Node 20+, el mismo que pide Tailwind v4):

```bash
node <ruta-de-esta-skill>/scripts/canonicalizar.mjs --css <css-de-entrada> <archivos-o-carpetas>
```

Usa el Tailwind instalado y el theme real del proyecto, y reporta cuatro secciones:

1. **Forma canónica** — clases con equivalente más corto (`mt-[68px] → mt-17`, `!flex → flex!`).
2. **Sintaxis riesgosa** — `bg-[--x]`, `outline-none`, `space-x-*`.
3. **Corchetes que quedan** — cada uno necesita un motivo. Cuando un token o un paso de la escala tiene el mismo valor, el script lo lista como "mismo valor" (`bg-[#2455d4]` → `bg-blue-600 · bg-action-primary`). Elige el que corresponde al rol en el diseño, no el primero.
4. **Clases sin CSS** — un typo, un token que no existe o una clase ajena a Tailwind.

Corrige las secciones 1 y 2 y vuelve a ejecutar, como máximo tres veces. Una sugerencia cuyo token no corresponde al rol del diseño, o un hallazgo dentro de un texto que no es código, no se aplica: se anota en **Verificación** con su motivo. El paso termina cuando las secciones 1 y 2 están vacías o cada hallazgo que queda está justificado.

Límites del script:
- No detecta todos los equivalentes (`top-[50%]` sigue siendo `top-1/2`). La sección 3 se revisa también contra la tabla de `references/valores-y-corchetes.md`.
- La sección 4 solo lee atributos `class` y `className` con texto fijo. Las clases dentro de `cn()`, `clsx()`, `cva()`, `[class.x]`, `[ngClass]` o `:class` se revisan pasándolas con `--clases "…"`.
- Si el proyecto convive con clases propias que no son de Tailwind (BEMIT, `js-*`), exclúyelas con `--ignorar "^(js-|c-|o-|u-)"` o el prefijo que corresponda.

Códigos de salida:
- **3**: error de uso (hay varios CSS de entrada, no encontró archivos o una ruta no existe). Corrige la invocación y repite.
- **2**: no pudo cargar Tailwind o su API interna cambió. Verifica a mano con `references/valores-y-corchetes.md` y `references/v3-a-v4.md`, y dilo en la entrega.

### Paso 6 — Entrega

Primero el código, listo para pegar: el marcado con sus clases y, si cambió, el bloque de `@theme` o de CSS propio con la ruta del archivo.

Después, un reporte con solo las secciones que tengan contenido:

```
**Theme** — tokens agregados o modificados y en qué archivo.
**Corchetes** — cada corchete que quedó, con su motivo en una línea.
**Márgenes** — cada utilidad de margin que no sea `mx-auto`, con su motivo en una línea.
**Divergencias** — valores del diseño fuera de escala o sin token, y huecos (estados o breakpoints no definidos).
**Verificación** — resultado del script, o por qué no se ejecutó.
```

La línea de verificación va siempre. Si no hubo cambios de theme, corchetes, márgenes ni divergencias, el reporte es esa sola línea.

## Reglas estrictas

Además de lo que piden los pasos:

- La configuración va en CSS (`@theme`, `@utility`, `@custom-variant`). `tailwind.config.js` y `@config` quedan para proyectos heredados; `@plugin` se usa solo para plugins que el proyecto ya tiene instalados.
- El CSS de entrada es `.css`. Sass, Less y Stylus no son compatibles con Tailwind v4.
- Unidades relativas por defecto: rem en tamaños, espaciados y breakpoints (la escala y los tokens ya los generan); `%`, `em`, viewport o contenedor cuando el diseño lo pide. Px solo en bordes, outline, radios, sombras y desenfoques.
- Además de los archivos del encargo, solo se tocan el CSS de entrada y los archivos CSS que importa. Cualquier otro archivo (configuración, `package.json`) se modifica tras confirmarlo con el usuario.
- No se agregan dependencias sin confirmación. La instalación de Tailwind sigue `references/setup.md`.
- Todo elemento enfocable conserva un indicador de foco visible.
- Los elementos se separan con `gap`, no con margin. El margin solo se admite para centrar (`mx-auto`) y en negativo cuando el diseño lo requiere, con su motivo anotado.
- `!` solo para sobrescribir estilos de terceros que no se pueden mover a una capa.

## Referencias

| Archivo | Leer cuando |
|---|---|
| `references/theme.md` | Se crea o modifica un `@theme`. |
| `references/valores-y-corchetes.md` | Vas a escribir un corchete que no reconoces en el resumen del Paso 2, o revisas la sección 3 del script. |
| `references/v3-a-v4.md` | Limpias clases existentes o dudas del nombre vigente de una utilidad. |
| `references/patrones.md` | Maquetas un layout, un componente con estados o un caso responsivo. |
| `references/css-propio.md` | Vas a escribir `@utility`, `@custom-variant`, `@layer` o `@apply`, o el proyecto convive con CSS de terceros. |
| `references/setup.md` | El proyecto no tiene Tailwind instalado o no tiene CSS de entrada. |
