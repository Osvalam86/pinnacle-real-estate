# Pinnacle · pinnacle-real-estate

Maquetación del diseño «Pinnacle» (Figma Community, Herve Wabo, CC BY 4.0) como pieza de portafolio de Osvaldo. El objetivo es fidelidad al diseño y accesibilidad implementada, con cada cambio respecto al diseño documentado.

## Alcance

- Páginas: Home, Projects, Project Details (`/projects/:slug`), Contact, 404 y una página genérica para los enlaces sin página propia.
- Anchos del diseño: 1440, 774 y 360.
- Breakpoints: `md` es 774 y `xl` es 1440 (definidos en `src/styles/theme.css`). Entre 774 y 1439 se ve la maqueta de tablet. Por encima de 1440 el contenido se limita a 1440 y se centra.
- Fuera de alcance: API real, pruebas automatizadas propias, medidas de rendimiento y cualquier otra página del diseño.

## Stack

React 19, Vite 8, TypeScript, React Router, pnpm y Node 26. Tailwind CSS v4 con el plugin de Vite: el theme vive en CSS con `@theme` y no hay `tailwind.config`. React Aria Components solo para patrones complejos (por ejemplo, pestañas).

Comandos: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm preview`.

## Archivos que no se tocan sin pedirlo

- `src/data/projects.json`: contenido aprobado de los 9 proyectos.
- `public/images/`: imágenes con nombres y rutas ya fijados. No renombrar, convertir ni optimizar. Las variantes por ancho (sufijos `-640`, `-960`, `-1280` y `-1920`; `hero-tower-606` y `about-400`/`about-800`) y `home/hero-tower.webp` se generaron con sharp-cli 6.1.0 desde los originales de `pinnacle-assets` (WebP q82; la torre q90 con alfa). Si cambia un original, sus variantes se regeneran con el mismo método y en la misma tarea.

## Skills

- Estructura y semántica: `semantic-markup`, antes de escribir marcado.
- Estilos: `tailwind-v4` (está en `.claude/skills/`), sobre el marcado ya resuelto.
- Tokens: `theme-tokens`, con salida `@theme`.

`semantic-markup` y `theme-tokens` vienen de la cuenta de Osvaldo, no del repo. Si alguna no aparece como disponible, para y dilo.

La skill `figma-design-to-code` llega con el plugin de Figma y se carga sola al leer un diseño. En este proyecto sirve solo para leer valores. Sobre ella mandan CLAUDE.md, el bloque de la tarea y las skills `semantic-markup` y `tailwind-v4`. No se descargan recursos de Figma: las imágenes ya están en `public/images/` y los iconos los entrega Osvaldo. Los iconos que son el único contenido de un control van en línea con `currentColor`.

## Reglas de maquetación

- Fidelidad por defecto. Las medidas, colores y textos salen del diseño o de la tarea; no se inventan. Si falta un dato, se pregunta.
- Se usan los tokens del `@theme`. Un valor arbitrario (entre corchetes) solo cuando no hay token, y se anota.
- Elemento nativo antes que ARIA.
- Todo control tiene foco visible, hover y, si aplica, estados de error y de abierto.
- Ningún `href="#"`: cada enlace tiene destino real.
- Un solo texto por control en los tres anchos, y el orden del DOM coincide con el orden visual.
- Excepción al orden del DOM: la barra inferior del footer a 360 invierte el orden visual con CSS, porque el diseño lo cambia entre anchos y el tabulador no varía.
- Una composición de varios elementos se monta con sus elementos, no con una imagen aplanada.
- La separación entre elementos es gap en el padre (flex o grid), como el auto layout de Figma. No se usa margin para separar. Solo se admite mx-auto para centrar y margin negativo cuando el diseño lo requiere; cada uno lleva un comentario con su motivo y se lista en el informe.
- Las fuentes (Clash Display y Satoshi) se cargan desde la API de Fontshare. Nunca se añaden archivos de fuente al repo: su licencia lo prohíbe.
- Toda diferencia con el diseño se anota en `DESIGN.md` con valor original, valor corregido y motivo. Si `DESIGN.md` aún no existe, lista las anotaciones en el informe.

## Forma de trabajo

- Haz solo lo que pide la tarea. Si algo no sale como se esperaba, para y dilo; no lo arregles por tu cuenta ni ajustes la expectativa.
- No hagas commits ni push: los hace Osvaldo en GitHub Desktop.
- No instales, actualices ni quites dependencias sin petición explícita.
- Marcado, estilos y accesibilidad los decide y revisa Osvaldo. Datos, rutas y build siguen patrones simples y se explican en lenguaje llano.
- Al terminar, informa de qué hiciste y qué no, con la salida literal de los comandos, y separa lo comprobado de lo supuesto.
- No afirmes conformidad con WCAG: di qué se comprobó y cómo.

## Idioma

- Identificadores en inglés: archivos, componentes, hooks, variables, props, `id`, clases y atributos.
- Texto visible del sitio en inglés: es el del diseño y el de `projects.json`.
- Comentarios del código en español. Pocos, y solo para explicar un porqué.
- Documentación (`README.md`, `DESIGN.md`, `CLAUDE.md`) y mensajes de commit en español.
- Informes y respuestas a Osvaldo en español, siempre.
