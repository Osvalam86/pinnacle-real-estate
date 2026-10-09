# Pinnacle · pinnacle-real-estate

Maquetación del diseño «Pinnacle» (Figma Community, Herve Wabo, CC BY 4.0) como pieza de portafolio de Osvaldo. El objetivo es fidelidad al diseño y accesibilidad implementada, con cada cambio respecto al diseño documentado.

## Alcance

- Páginas: Home, Projects, Project Details (`/projects/:slug`), Contact, 404 y una página genérica para los enlaces sin página propia.
- Anchos del diseño: 1440, 774 y 360.
- Fuera de alcance: API real, pruebas automatizadas propias, medidas de rendimiento y cualquier otra página del diseño.

## Stack

React 19, Vite 8, TypeScript, React Router, pnpm y Node 26. Tailwind CSS v4 con el plugin de Vite: el theme vive en CSS con `@theme` y no hay `tailwind.config`. React Aria Components solo para patrones complejos (por ejemplo, pestañas).

Comandos: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm preview`.

## Archivos que no se tocan sin pedirlo

- `src/data/projects.json`: contenido aprobado de los 6 proyectos.
- `public/images/`: imágenes con nombres y rutas ya fijados. No renombrar, convertir ni optimizar.

## Skills

- Estructura y semántica: `semantic-markup`, antes de escribir marcado.
- Estilos: `tailwind-v4` (está en `.claude/skills/`), sobre el marcado ya resuelto.
- Tokens: `theme-tokens`, con salida `@theme`.

`semantic-markup` y `theme-tokens` vienen de la cuenta de Osvaldo, no del repo. Si alguna no aparece como disponible, para y dilo.

## Reglas de maquetación

- Fidelidad por defecto. Las medidas, colores y textos salen del diseño o de la tarea; no se inventan. Si falta un dato, se pregunta.
- Se usan los tokens del `@theme`. Un valor arbitrario (entre corchetes) solo cuando no hay token, y se anota.
- Elemento nativo antes que ARIA.
- Todo control tiene foco visible, hover y, si aplica, estados de error y de abierto.
- Ningún `href="#"`: cada enlace tiene destino real.
- Un solo texto por control en los tres anchos, y el orden del DOM coincide con el orden visual.
- Una composición de varios elementos se monta con sus elementos, no con una imagen aplanada.
- Las fuentes (Clash Display y Satoshi) se cargan desde la API de Fontshare. Nunca se añaden archivos de fuente al repo: su licencia lo prohíbe.
- Toda diferencia con el diseño se anota en `DESIGN.md` con valor original, valor corregido y motivo. Si `DESIGN.md` aún no existe, lista las anotaciones en el informe.

## Forma de trabajo

- Haz solo lo que pide la tarea. Si algo no sale como se esperaba, para y dilo; no lo arregles por tu cuenta ni ajustes la expectativa.
- No hagas commits ni push: los hace Osvaldo en GitHub Desktop.
- No instales, actualices ni quites dependencias sin petición explícita.
- Marcado, estilos y accesibilidad los decide y revisa Osvaldo. Datos, rutas y build siguen patrones simples y se explican en lenguaje llano.
- Al terminar, informa de qué hiciste y qué no, con la salida literal de los comandos, y separa lo comprobado de lo supuesto.
- No afirmes conformidad con WCAG: di qué se comprobó y cómo.
- Respuestas en español. Código, nombres de archivo y clases en inglés. Los textos del sitio van en inglés, tal como están en el diseño y en `projects.json`.
