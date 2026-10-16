# DESIGN.md · Pinnacle

Contrato entre el diseño y el código. Recoge cómo se tradujo el archivo de Figma, qué se cambió y por qué, qué se añadió porque el diseño no lo dibujó, y qué se probó. Está escrito en su estado final: las decisiones que se corrigieron por el camino aparecen ya corregidas, y las retiradas conservan su ID con el motivo.

**Figma manda sobre este documento.** Cuando algo no está aquí, el valor es el del archivo.

---

## 1 · Fuentes

- **Diseño:** «Free Real Estate Portfolio website template.» de **Herve Wabo**, Figma Community, licencia CC BY 4.0. Marca interna: Pinnacle. <https://www.figma.com/community/file/1387710768278467368/free-real-estate-portfolio-website-template>
- **Copia de trabajo:** los identificadores de nodo de este documento son de una copia del archivo. Las instancias apuntan a copias de biblioteca, así que por script se buscan por el nombre del componente, no por el id.
- **Alcance:** Home, Projects, Project Details, Contact y 404, a 1440, 774 y 360. Fuera: About us, Services, Blog, Blog Details y Privacy Policy, y cualquier API real.

| Página | 1440 | 774 | 360 |
|---|---|---|---|
| Home | `2007:3170` | `2007:3444` | `2007:3710` |
| Projects | `2007:3973` | `2007:4109` | `2007:4245` |
| Project Details | `2007:6026` | `2007:6203` | `2007:6380` |
| Contact | `2007:7841` | `2007:7637` | `2007:7411` |
| 404 | `2007:5788` | `2007:5867` | `2007:5946` |

Assets: `95:716`. Logo: `95:718`. Botón: `95:747` (variantes Primary `95:746`, Secondary `95:752`, Tetiary `95:754`, Link `96:391`).

---

## 2 · Criterio de fidelidad

1. **Se calca el diseño.** Medidas, separaciones, radios y colores salen de Figma, también cuando no siguen la base 4. Las propiedades invisibles (recortes, mínimos, rellenos que no se ven) se calcan si cuesta poco.
2. **Lo invisible se implementa siempre:** semántica, nombres accesibles, teclado, foco y avisos.
3. **Lo que el diseño no dibujó se diseña** con su propio sistema: foco, hover, error, abierto, deshabilitado. Va en la tabla de añadidos (§ 11).
4. **Lo que el diseño hizo mal se corrige lo mínimo:** contraste, área táctil, estado activo del menú, textos incoherentes entre anchos. Va en la tabla de desviaciones (§ 10) con el valor original, el corregido y el motivo, para que la fidelidad siga siendo verificable. Si una corrección rompe algo que funcionaba, se retira (D47).
5. **Ajustes por estética:** solo los que pidió el autor, puntuales y sin convertirse en regla (A31, A33, A34).
6. **Diferencias propias del navegador, de la plataforma o del lector** se anotan y no se corrigen (§ 13).
7. **Elemento por función, no por nombre de componente.** Una instancia del botón sin acción (las etiquetas de tarjeta, «Residential Development») es texto: el nombre en Figma dice cómo se dibujó, no qué hace.

---

## 3 · Tokens (`src/styles/theme.css`)

El archivo de Figma no tiene variables: tiene 14 estilos de color (el acento y 13 grises), 44 estilos de texto y 1 estilo de efecto. Todo va en `@theme`, con el nombre de Figma en comentario.

### Color

- **Primitivos:** los 14 estilos de color (`accent` `#FF5200` y `gray-1` a `gray-13`), disponibles para las excepciones de fidelidad.
- **Semánticos:** lo que leen los componentes. Fondo de página `gray-13` (`#020100`), superficie `gray-12`, superficie elevada `gray-11`, borde por defecto `gray-10`, texto por defecto `gray-4`, texto secundario `gray-6`, texto tenue `gray-7`, texto sobre el acento `gray-13`, foco `gray-1`.
- **Borde de control:** `gray-7` (`#8D8D8C`) en todos los límites de control (D2, D3, D9, D10, D18, D20, D21): 6,28:1 sobre `#020100` y 5,49:1 sobre `#161514`. Es el único gris del archivo que llega a 3:1 en los dos fondos sin ser color de texto.
- **Fuera del sistema (añadidos):** `--color-accent-hover: #fe6d2f` (A46), el color de la sombra interior del Primary button de Figma; `feedback-danger` `#FB7185` (A19): 7,75:1 sobre `#020100`, 6,78:1 sobre `#161514` y 6,11:1 sobre `#201F1F`. No hay color de éxito.
- **Colores sueltos del diseño** (sin estilo local, como `#BFBFBF`, `#262626`, `#B7B7B7`): pasan al token más cercano (D28, D45, D51, D54). Un estilo por pieza.
- **Sobre el naranja:** texto grande en `gray-1`, texto normal en `gray-13` (D1, D6, D49, D50). El naranja no cambia: bajarlo hasta que el blanco dé 4,5:1 (`#D04400`, 4,66:1) cambiaría la marca en todo el sitio.

### Tipografía

- **Familias:** Clash Display (500, 600, 700) en títulos y Satoshi (400, 500, 700) en texto, de Fontshare (§ 9).
- **Clases de texto con el nombre de Figma:** `text-h3`, `text-h4`, `text-h5`, `text-h6`, `text-extra-30`, `text-extra-25`, `text-body-medium-16`, `text-body-regular-18`… Solo entran los estilos usados en los 15 frames.
- **Incoherencias del archivo** (el token toma el valor real y el mapa conserva el nombre): `Body/Bold/12px` mide 13; `Body/Bold/10px` y `Body/Medium/10px` miden 11; `Body/Medium/24px` es Clash Display Medium a 120 %; `Body/Regular/20px` y `18px` van a 160 % y el resto a 150 %; `Extra/25px-bold` y `Extra/30px-bold` son Semibold. Home usa un «18px-medium» que no está entre los locales: «View all blog post» usa `text-body-medium-18`.
- **Textos sin token:** «View all blog post», el logotipo del footer (Satoshi Bold 27), las firmas de las reseñas del hero y «Share» a 360.
- **Nombres de Tailwind con valor distinto al de fábrica:** `rounded-xl`, `rounded-3xl`, `leading-tight`, `leading-relaxed` y de `text-3xl` en adelante.

### Medidas, capas y efectos

| Token | Valor | Origen |
|---|---|---|
| Breakpoints | `md` 48.375rem (774), `xl` 90rem (1440) | Los dos anchos del diseño, literales |
| `--container-page` | 90rem (`max-w-page`) | Ancho máximo del contenido (A27) |
| `--outline-color-focus` | `gray-1` | Foco del sitio |
| `--z-index-raised` · `backdrop` · `menu` · `hero-art` · `hero-cover` · `skip-link` | 10 · 30 · 40 · 41 · 42 · 50 | Capas del menú, el hero de Home y los enlaces de salto |
| `--inset-shadow-button` | `inset -3px 5px 4px 0 #2c2c2c` | Secondary, valor de capa sin estilo |
| `--inset-shadow-button-accent` | `inset -3px 5px 4px 0 #fe6d2f` | Primary, valor de capa sin estilo |
| `--inset-shadow-pin-dot` | `inset 0 1px 2px 0 rgb(224 224 224 / 0.56)` | Punto de los pines |
| `--inset-shadow-flag` | `inset 0 4px 4px 0 rgb(0 0 0 / 0.25)` | Marco de la bandera |
| `--shadow-review-lg` · `--shadow-review-sm` | Sombras de las reseñas del hero | Valores de capa sin estilo |

El efecto «icon effet» (sombra interior `#FC6E32`) va dentro de cada SVG de icono de título como filtro.

---

## 4 · Valores arbitrarios

Un valor arbitrario rompe la trazabilidad con Figma, así que cada uno queda aquí con su motivo.

| Dónde | Valor | Motivo |
|---|---|---|
| Fondo del sitio | Posiciones con decimales de las rayas B y del resplandor; tamaño, giro `155.9678deg` y `blur-[52px]` del resplandor; degradado radial en sRGB | Calco de las tres colocaciones de `Bg elements`. El desenfoque se calibró midiendo contra el render de Figma (mínimo de diferencia en 52 px). Las utilidades de degradado de Tailwind mezclan en oklab |
| `HeroFade` y capa extra de Contact | Degradados lineales `rgb(0 0 0/0) 74.4577% → #000 91.1695%` y `74.4577% → 100%` | Sin token de degradado; `#000` tal cual Figma |
| Mallas del CTA | Posiciones `left`/`right` y `top: calc(50% ± …)` por tramo | Centro de cada malla en Figma, redondeado a píxel |
| Título del CTA | `word-spacing` de `1.14px`, `1.75px` y `-2.25px` | Separación entre palabras de Figma (5, 9, 9) con una frase corrida |
| Carrusel | `xl:w-[calc((100%-2rem)/3)]`, `xl:w-[calc((100%-1rem)/2)]`, `md:w-[38.09375rem]`, `[scrollbar-width:none]` | Anchos de tarjeta de Figma; barra oculta |
| Services | `grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))]` | A33, mínimo de 416 |
| Pines | Izquierda en % y posición vertical en px por slug (`PIN_POSITIONS`) | Calco sobre el mapa |
| Hero de Home | Degradados de fondo y de borde de las reseñas por ancho, máscara del `::before`, `before:rounded-[inherit]`, `backdrop-blur-[7px]`, `grid-cols-[auto_auto]` | Cristal de las reseñas; la escala de desenfoque salta de 4 a 8 |
| About | Cuatro `calc(50% ± …)` de las líneas; posición, tamaño y giro de las dos imágenes | Calco de capas sin auto layout |
| Testimonials | `md:grid-cols-[auto_minmax(0,1fr)]` | Retrato a la izquierda y `figcaption` como hijo directo del `figure` |
| Recorte a la altura de mayúscula | `[text-box:trim-both_cap_alphabetic]` en «View all blog post», citas y firmas | Calco del recorte de Figma; sin soporte, el texto queda centrado |
| Campo de búsqueda | `[&::-webkit-search-cancel-button]:appearance-none` | Sin el botón de borrar del navegador |
| Autocompletado (A30) | Sombra interior y `-webkit-text-fill-color` | El campo conserva sus colores |
| Enlaces de la casilla | `[text-decoration-skip-ink:none]` | `textDecorationSkipInk: false` en Figma |
| Línea de Amenities | `::after` de 1 px en `top: -0.5px` | Línea de 1 px centrada en una caja de alto 0 |
| Alto contraste | `[CanvasText]`, `[LinkText]` | Colores del sistema para líneas y puntos dibujados con fondo (A59) |
| Hover del naranja | `#FE6D2F` como token `accent-hover` | A46 |
| Error | `#FB7185` como token `feedback-danger` | A19 |

---

## 5 · Reglas de maquetación

- **Separación con `gap`** en el padre, como el auto layout de Figma. `margin` solo para centrar (`mx-auto`) o en negativo cuando el diseño lo usa, siempre comentado. En el repo quedan: el carril del carrusel (`-mx-4 md:-mx-10 xl:mx-0`), el contador de Featured (`md:-mb-3`), el buscador sobre el mapa (`-mt-12`; `gap` no admite negativos), el solape de About a 774 (`md:-mt-0.75 xl:mt-0`; CSS no reparte espacio negativo con `space-between`), los retratos superpuestos (`-space-x-4`) y el botón del newsletter (`-m-0.5`).
- **Móvil primero:** sin variantes `max-*`.
- **Un hijo que puede quedar vacío** (un `role="status"`) se saca del flujo (`sr-only` o `empty:sr-only`) para no dejar un `gap` de más. Un mensaje que solo existe a veces no se pinta en el DOM.
- **Borde interior de Figma.** En este archivo los trazos son interiores y no cuentan en el layout. En CSS el borde ocupa su píxel: borde real de 1 px y relleno reducido en 1 (24/16 → 23/15). La caja exterior y la distancia del borde al texto son las de Figma, y el borde se conserva en alto contraste. En imágenes, `outline` con desfase −1. Encima de un hijo que recorta, en un `::after`. **En elementos con sombra interior no**: el borde, aunque sea transparente, mueve la sombra (medido en los 13 botones).
- **Un trazo interior de frame se pinta encima de sus hijos** (la barra de lectura: borde sobre el relleno).
- **«Fill» entre cajas de distinto relleno:** rejilla de columnas iguales, no `flex-1`.
- **Alineación por eje.** La alineación `MIN` del eje cruzado de Figma se calca en cada variante según la dirección del flex. En una fila (también con salto) `items-start` calca `MIN`; si en otro ancho la caja pasa a columna con hijos «Fill», se devuelve el estiramiento (`xl:items-stretch`). Un texto «Hug» dentro de una columna «Fill» se calca con `self-start`.
- **Figma no cuenta el espacio final de un texto** en el ancho de su caja.
- **Todo el sitio:**
  - contenido limitado a 1440 y centrado; fondos y bordes a todo el ancho (A27);
  - foco: contorno de 2 px `gray-1` con 2 px de separación en `:focus-visible` (≥ 3,25:1 sobre todos los fondos);
  - hover de las cajas-enlace con la superficie elevada;
  - enlaces dentro de texto subrayados, con `hover:text-gray-1`; enlaces de navegación con subrayado de 1 px en hover, sin mover el layout;
  - mano (`cursor: pointer`) en todos los botones activos (A28);
  - error en `feedback-danger`, sin icono; el mensaje comunica el error y el color solo lo acompaña.
- **`color-scheme: dark`** en todo el sitio (A40). Los `<select>` llevan además fondo y color explícitos, y cada `<option>` el suyo (A44).
- **Iconos y SVG:** una sola fuente por dibujo, en `icons.tsx` con `currentColor` y nombres sin dirección (`ArrowIcon`, `StrokeArrowIcon`, `StrokeXIcon`). Los trazados se compararon por programa con la exportación de Figma. Si Figma redondea la caja de la exportación, se ajusta solo la primera línea del SVG a la medida de la capa. Si el mismo dibujo va a dos tamaños con el trazo sin escalar, `vector-effect="non-scaling-stroke"`. Las imágenes con texto alternativo (estrellas) se quedan como archivo con `<img>`.

---

## 6 · Rutas, enlaces y foco

### Rutas

| Ruta | Página | `<title>` |
|---|---|---|
| `/` | Home | Pinnacle Real Estate |
| `/projects` | Projects | Página – Pinnacle |
| `/projects/:slug` | Project Details (9 proyectos, una plantilla) | Nombre del proyecto – Pinnacle |
| `/contact` | Contact | Página – Pinnacle |
| `/case-study` | Página genérica: destino de los enlaces sin página en alcance | About this case study – Pinnacle |
| `*` y slug desconocido | 404, sin redirigir | Page Not Found – Pinnacle |

Un solo `<title>`, el estático de `index.html` (lo leen los clientes sin JavaScript); cada página lo actualiza con `document.title`. En el detalle el título se calcula en la página y se pasa por prop: el efecto del hijo corre antes que el del padre.

### Mapa de enlaces

Criterio: ancla a Home si la sección existe y es otra; página genérica si no. Ningún `href="#"`.

| Enlace | Destino |
|---|---|
| Menú: Home / Projects / Contact us | `/` · `/projects` · `/contact` |
| Menú: About Us / Services / News | `/#about` · `/#services` · `/#news` |
| Footer · Navigation: Home / Projects / Testimonials / FAQ’s / Terms & Conditions | `/` · `/projects` · `/#testimonials` · `/#faq` · genérica |
| Footer · About Us: Our Story / Our Values / Our Team | Genérica |
| Footer · Projects: Portfolio / Categories | `/projects` · `/projects#search` |
| Footer · Services (4) | `/#services` |
| Footer · Contact Us: Contact Form / Our Office | `/contact#form` · `/contact#office` |
| Home: Schedule a Call · View Our Projects · View all Projects · CTA | `/contact` · `/projects` |
| View Property y pines del mapa | `/projects/:slug` |
| Back to all Projects (los dos) · Schedule a free call | `/projects` · `/contact` |
| Learn More About Us · Learn more · View all blog post · Read More · Terms of Use · Privacy Policy | Genérica |
| Correo · teléfono | `mailto:info@pinnacle.com` · `tel:+11234567890` |
| Get Directions | Google Maps con destino «Upper Macungie Township, PA» (D35), pestaña nueva |
| Redes del footer y de Contact | Página principal de cada red, pestaña nueva |
| 404 y genérica: Back to Home Page | `/` |

### Página actual (D5)

| Ruta | `aria-current` |
|---|---|
| `/` | Home = `page` |
| `/projects` | Projects = `page` |
| `/projects/:slug` | Projects = `true` (es la sección, no la página) |
| `/contact` | Contact us = `page` |
| `/case-study`, 404 | Ninguno |

Las anclas nunca se marcan. `aria-[current]:` cubre `page` y `true`; la variante `aria-current:` de Tailwind solo coincide con `true`.

### Foco al navegar (`src/routing/RouteFocus.tsx`)

- **Primera carga sin ancla:** el foco no se mueve.
- **Cambio de ruta:** sube al inicio y el foco va al `<h1>`, sin contorno. Excepción: en Projects va al inicio del contenido (`#main-content`), porque el `<h1>` queda debajo del hero.
- **Con ancla:** baja a la sección y enfoca su primer encabezado. Un ancla inexistente se trata como cambio de ruta.
- **Enlace a la URL actual:** con ancla repite desplazamiento y foco; sin ancla sube al inicio y enfoca el `<h1>`. `location.key` entra en las dependencias porque React Router navega con `replace` y clave nueva en cada pulsación.
- **Atrás y Adelante** conservan el desplazamiento. Un cambio solo de parámetros de búsqueda no activa nada.
- **`<BrowserRouter useTransitions={false}>`:** el cierre del menú, el cambio de `<main>`, el desplazamiento y el foco salen en el mismo render; sin ello las anclas pulsadas desde el panel enseñaban 1 o 2 fotogramas de la página anterior. Las transiciones de React Router solo sirven para rutas diferidas y aquí no hay. **Si se añaden rutas diferidas, revisar esta decisión.**
- **Re-anclaje (`keepAnchored`).** Tras el desplazamiento a un ancla, si el destino se mueve más de 1 px se vuelve a desplazar al instante, sin tocar el foco. Motivo: React Aria monta las pestañas de Services en un segundo render (+53 px a 1440 y +236 a 360) y las fuentes pueden llegar después; el scroll anchoring nativo de Chromium elegía mal el ancla. Disparadores: `ResizeObserver` sobre `#main-content`, `loadingdone` y `fonts.ready`. Se cierra con la primera interacción (rueda, toque, puntero, tecla), a los 2000 ms (estimado) o al llegar otra navegación.
- **Foco programático de contenedores (A55, `focusContainer`).** `<main>`, `<footer>` y `form#search` no tienen `tabindex` en reposo. `focusContainer` lo pone solo para el foco del enlace de salto o del ancla y lo quita en el `blur` o en un `pointerdown` dentro. Con el atributo fijo, un clic en un párrafo enfocaba `<main>` y Tab volvía a su principio (saltos de hasta −9367 px). Los encabezados que reciben foco llevan `tabIndex={-1}` en el JSX.
- **`key={project.slug}`** en el detalle: React reutilizaba el componente y el aviso «Link copied» seguía en el proyecto nuevo.
- **Enlaces de salto (A26):** «Skip to main content» y «Skip to footer», ocultos hasta recibir el foco, con el aspecto del Primary button. Sin «Skip to menu»: el menú es lo primero del documento.

---

## 7 · Componentes y comportamiento

### Piezas compartidas

| Pieza | Qué es |
|---|---|
| `Button` | Variantes `primary`, `secondary` y `tertiary` (Tetiary en Figma). Con `to` pinta `Link`; sin él, `<button>` con `type` obligatorio. Sin alto fijo; texto, ancho y layout los pone quien lo usa. Sin pulsado ni deshabilitado: nada en alcance los usa. «Send» no lo usa (es un frame suelto en Figma) y solo recibe su hover |
| `SectionTitle` | Título con icono (`h1` o `h2`) de las cabeceras alineadas a la izquierda. `alignClassName` deja el icono arriba en la FAQ por debajo de 1440. Las cabeceras centradas (Services, Testimonials) y el título del formulario de Contact no lo usan |
| `SiteBackground` · `HeroFade` | Fondo del sitio y fundido de los héroes (§ Fondo) |
| `ProjectCard` | Tarjeta de proyecto de Home, Projects y Project Details. Nivel de título configurable, `gapClassName`, `imageSizes` obligatorio |
| `Carousel` | Carril de Featured Projects y Latest News |
| `FaqSection` | FAQ de Home y de Contact; `paddingBottomClassName` (88 a 1440 en Contact) |
| `ContactHero` · `ContactInfo` · `MessageHero` · `BackToProjectsLink` | Hero de Contact, datos de contacto, hero del 404 y de la genérica, enlace de vuelta a Projects |
| CTA | En Home, Projects y Project Details, pegado al footer; no en Contact ni en el 404 |

### Cabecera y menú (A1)

- Barra en flujo, ni fija ni sticky. Un solo `<nav aria-label="Main">` y una sola lista para los tres anchos. Logo `alt="Pinnacle"`, botón `Menu`.
- **Panel por debajo de 1440:** desplegable bajo la barra, a todo el ancho y con el alto de su contenido; el resto de la página, oscurecido (`gray-13` al 60 %). Los 5 enlaces en filas de 56 y Contact us a todo el ancho. Icono X con el panel abierto.
- **Se comporta como modal:** al abrir, el foco va al primer enlace; Esc cierra y devuelve el foco a «Menu»; también cierra al pulsar fuera (detectado con `composedPath()`), al activar un enlace y al llegar a 1440. Mientras está abierto, los enlaces de salto, `<main>` y `<footer>` quedan `inert` y la página no se desplaza (con `scrollbar-gutter: stable` si hay barra clásica). Sin animaciones.
- Hover: enlaces subrayados; Contact us `gray-11` → `gray-10`; pastilla `gray-12` → `gray-11`; hamburguesa `gray-4` → `gray-1`.

### Footer y newsletter

- Un `<nav aria-label="Footer">` con 5 grupos, cada uno con su `<h2>` y su `<ul>`. Logo con el mismo `logo.svg` de la barra (D36). Grupos repartidos a todo el ancho a 1440 (D37). Pegado abajo en páginas más bajas que la ventana (A49).
- **Barra inferior:** en el DOM, copyright y después redes; a 360 se invierte con CSS. Excepción documentada: el diseño cambia el orden visual entre anchos y el tabulador no varía.
- **Newsletter:** envío simulado, sin petición de red. Validación solo al enviar; el formato lo comprueba el navegador (`type="email"`: `hola` da error y `a@b` pasa). El campo se vacía tras suscribirse y el foco no se mueve.
  - **Error:** `<p>` sin `role`, solo mientras hay error, enlazado con `aria-describedby`; `aria-invalid` y foco de vuelta al campo.
  - **Éxito:** `role="status"` siempre en el DOM, solo con la confirmación. El error y el éxito nunca comparten pieza: un mismo nodo como aviso y como descripción se leía dos veces.
  - **Zona de clic (A61):** el `<label>` es una capa absoluta sobre la caja de 305×53 y el campo y el botón llevan `relative`. Un `<label>` no puede contener el botón de envío (un `<button>` también se puede etiquetar).
  - Textos: «Email address», «Subscribe to our newsletter», «Enter your email address.», «Enter a valid email address, like name@example.com.», «Thank you. You’re subscribed.».

### Pestañas de Services

- `Tabs` de React Aria Components. Orientación horizontal desde 774 y vertical por debajo (`matchMedia`): en vertical responde a las cuatro flechas. La selección sigue al foco. Solo el panel activo está en el DOM y no lleva `tabindex` porque contiene enlaces.
- Cambio de panel instantáneo. Fotos sin `loading="lazy"` y con `decoding="sync"`: Firefox las pintaba con un destello al montar tres `<img>` nuevos en cada cambio.
- Nombres: lista `Services`; «Learn more...» con `aria-labelledby` (su texto más el título de la tarjeta).
- Contenido de las otras tres pestañas redactado (A6): el archivo solo desarrolla Residential.

### Carrusel (Featured Projects y Latest News)

- **Sin dependencia:** lista con desplazamiento nativo y `scroll-snap`, flechas propias. Nada se oculta ni queda inerte.
- Flechas con `aria-disabled`, nunca `disabled`: un botón que pasa a `disabled` con el foco dentro lo deja en el documento.
- Contador «01/03» con `aria-hidden`: marca la primera tarjeta alineada con el inicio del contenido. Aviso oculto `Project N of 3` / `Article N of 3` en `role="status"`, solo al cambiar la posición.
- Una tarjeta por pulsación, desplazamiento suave e instantáneo con movimiento reducido (A36). Con foco de teclado en una tarjeta que no cabe, el carril la trae a la vista; con ratón no.
- 328 de ancho por debajo de 774; carril hasta los bordes de la ventana por debajo de 1440 (A35).
- **`tabIndex={-1}` en el `<ul>`:** Firefox hace tabulable toda caja con desplazamiento. Durante un clic en un hueco lo pierde y lo recupera con `setTimeout(0)` (A55).
- Featured a 1440: caben las tres, las dos flechas deshabilitadas (D8).

### Buscador y rejilla de Projects

- `<form role="search" aria-label="Projects">` sobre el JSON local. Filtros en la URL (`q`, `location`, `type`, `cost`): los vacíos se omiten y un valor desconocido se trata como sin filtro. `q` busca dentro del nombre sin distinguir mayúsculas; el resto, coincidencia exacta.
- **Se filtra al enviar**, no al escribir. Tras enviar, la página baja a los resultados (A39) y el foco se queda en el botón; se anuncia «N projects found» en un `role="status"` siempre en el DOM. Un envío sin cambio de URL navega con `replace` para que el aviso no se calle; Atrás y Adelante restauran campos y resultados sin anunciar.
- **Desplegables:** `<select>` nativo con opacidad 0 sobre una cara propia (`aria-hidden`). Un `<select>` con estilos mide lo que su opción más larga y no daría los anchos de Figma. A 1440 crecen con la opción elegida (A38); a 774 columnas iguales con mínimo igual a su texto de reposo (D44). El código no gestiona teclas: cada navegador aplica las suyas.
- **Pines:** enlaces al detalle en una lista `Projects on the map`, en el orden del JSON (no el visual, que cambia entre anchos). Anillo `gray-13` de 2 px entre la pastilla y el contorno (A37). Sin pin para The Courtyard ni los proyectos 7 a 9: no hay posición que leer.
- **Rejilla:** 9 proyectos (A41). «See More» pliega a 4 por debajo de 1440 y a 6 desde 1440; al pulsarlo se muestran todos y el foco va al título de la primera tarjeta nueva. La rejilla se vuelve a plegar con cada búsqueda (`key={search}`).
- **Sin resultados (A42):** título, línea de ayuda y «Clear filters» a `/projects#search`, que limpia y enfoca el buscador.

### Project Details

- **Hero:** `<h1>` con el nombre del proyecto; «Back to all Projects» antes del `<h1>`, como se ve. Etiqueta `{type} Development` y dirección como texto; si no caben en una fila, la dirección baja (A54).
- **Columna lateral antes del artículo** en el DOM (como a 774 y 360) y a la derecha a 1440 con `xl:flex-row-reverse`. Sus títulos («Amenities», el del CTA) son párrafos; los encabezados son los 5 `<h2>` del artículo.
- **Columna fija a 1440 (A15):** `sticky` a 32 px de arriba con la variante `sticky-fits`, en `rem`, que la desactiva si la ventana mide menos de 705 de alto (641 + 32 + 32) o si crece la letra.
- **Barra de lectura (D17, D18):** 0 % cuando el principio del artículo llega arriba de la ventana y 100 % cuando el final llega abajo. Fuera del árbol de accesibilidad. El relleno se mueve con `style.translate` (Tailwind v4 usa la propiedad individual; `transform` se sumaría). Minutos a 200 palabras por minuto, redondeo hacia arriba, mínimo 1: los 9 proyectos dan «2min Read».
- **Compartir (D16):** lista `Share` con 5 controles. Copiar confirma «Link copied» (3 s) en un `role="status"`; si falla, «Couldn't copy the link». El segundo icono usa `navigator.share` donde existe («Share via…») y si no un `mailto:` («Share by email»); si `share` falla por algo distinto de `AbortError`, abre el `mailto:`. Facebook, X y LinkedIn con su URL de compartir, en pestaña nueva.
- Fotos del artículo solo en The Grand Estate, con texto alternativo descriptivo; el resto lleva el artículo sin fotos. Viñetas nativas.
- **«You may also like»:** los 3 proyectos siguientes en el orden del JSON, con vuelta; 3 a 1440 y 2 por debajo; la tercera oculta por CSS. Divider con borde (visible en alto contraste), no fondo.

### Formulario de Contact

- Mismos campos y un solo orden en el DOM en los tres anchos (D23, D24): Name, prefijo, Phone Number, Business Email, Select budget, Service, Message, casilla, Terms of Use, Privacy Policy, «Send».
- **Etiqueta flotante (A18):** en reposo el campo es idéntico al diseño; con foco, valor o autocompletado el texto pasa a 12 px y sube al relleno superior, sin mover el valor ni cambiar la caja, sin animación. La caja es el propio `<label>`; la etiqueta lleva `pointer-events-none` para que Chrome abra las sugerencias al primer clic. Sin atributo `placeholder`.
- El valor que no cabe se corta con puntos suspensivos sin foco y vuelve a su inicio al salir del campo (A43; Firefox mostraba el final).
- **Selector de prefijo:** `<select>` nativo transparente sobre la bandera; 8 países, Camerún preseleccionado como está dibujado. Camerún sale del Figma; las otras 7 de circle-flags (cambia el estilo de dibujo al elegir otra).
- **Validación al enviar:** Name, Business Email y Message vacíos o solo con espacios, y la casilla. Mensaje a 8 px bajo cada control, `aria-invalid` y `aria-describedby`, foco al primero que falla (con `focusVisible: true`, A45). `flushSync` pinta los mensajes antes de mover el foco. Los errores siguen hasta el siguiente envío. Los mensajes no son región viva: el foco ya los lee.
- **Casilla:** nativa con `appearance-none`, marca dibujada en código (A20). **`aria-required` en lugar de `required`:** con `required` nativo Chromium la exponía como «entrada inválida» desde la carga. Excepción documentada a «nativo antes que ARIA»; la validación es la del envío.
- **Envío simulado:** sin petición de red; los valores se descartan. El formulario se sustituye en la misma caja por «Thank you. We’ve received your message.», que recibe el foco y se queda hasta salir de Contact o recargar.

### Datos de contacto, 404 y página genérica

- Cajas de correo, teléfono, «Get Directions» y redes con hover de superficie elevada. Los tres grupos pasan a una fila desde 1062, lo que haría el auto layout con salto de Figma. `#office` enfoca el `<h2>` «Our Office».
- 404 y genérica comparten `MessageHero`. La genérica añade el párrafo (A24) y la línea de créditos (A25) con 5 enlaces en pestaña nueva. El hueco hasta el footer se pinta con el fondo de página (A49).

### Fondo del sitio

- Capa `Bg elements`: dos grupos de rayas (`bg-lines.svg`, uno girado 45°) y un resplandor en CSS, en tres colocaciones calcadas: base (Projects, Project Details, 404 y genérica), Home y Contact.
- Por encima de 1440 se ancla a la caja centrada de 1440 (A47). Los héroes salvo el de Home llevan un fundido a negro (`HeroFade`); Contact a 1440, además, una capa extra de 1440×1165. Las secciones con relleno `#020100` tapan el fondo, a todo el ancho.
- Envoltorio raíz `relative isolate flex min-h-dvh flex-col overflow-clip`: `clip` recorta sin crear contenedor de desplazamiento (la columna sticky funciona dentro); `min-h-dvh` y `grow` en `<main>` dejan el footer abajo.
- Fondo, fundidos, líneas de About y mallas del CTA, ocultos en alto contraste (A48, A53, A56).

---

## 8 · Accesibilidad implementada

Objetivo: WCAG 2.2 AA. Este documento no afirma conformidad; § 14 dice qué se probó.

- **Estructura:** landmarks `banner`, `main` y `contentinfo`; un `<h1>` por página y encabezados sin saltos; listas reales para tarjetas, pines, redes y compartir; secciones con `aria-labelledby`.
- **Nombres accesibles:** todo control con nombre; «View Property», «Learn more...» y «Read More...» con el título de su tarjeta; enlaces externos con «(opens in a new tab)»; fotos y decoración con `alt=""` y SVG con `aria-hidden="true"`; estrellas con alt cuando son la valoración y `alt=""` cuando el texto de al lado ya la da.
- **Mensajes:** un error se lee con el foco por `aria-describedby`; una región viva solo para lo que se anuncia sin mover el foco (éxito del newsletter, buscador, carril, «Link copied»). Nunca la misma pieza para las dos cosas.
- **Espacios ocultos:** todo `span sr-only` de solo espacio lleva `whitespace-pre` (con `md:not-sr-only`, también `md:whitespace-pre`, porque `not-sr-only` devuelve `white-space: normal`). Un espacio único en un `span` que el flex vuelve bloque colapsa y no llega al árbol: NVDA leía «We're buildingcommunities.». Se miden el nombre accesible y el texto del árbol, porque pueden diferir.
- **Foco:** contorno común en `:focus-visible`. `focus:outline-hidden` solo donde es la única señal (encabezados y contenedores con foco programático). Un control cuya caja ya dibuja el foco (campos de Contact y del newsletter, con `has-focus-visible:`) va con `focus:outline-none`: el contorno transparente de `outline-hidden` salía en alto contraste como doble indicador.
- **Botones del hero (A51):** con el foco suben por encima de la torre, que tapaba de 4 a 6 px del contorno.
- **Alto contraste (`forced-colors: active`):**
  - `Button` primary y secondary y «Send»: `forced-colors:not-focus-visible:outline forced-colors:not-focus-visible:-outline-offset-1` (A58). Sin `not-focus-visible:` la utilidad tapaba el foco común.
  - Líneas y puntos dibujados con fondo, en `CanvasText` (o `LinkText` en un enlace) (A59).
  - Iconos con clase de color propia, `forced-colors:text-inherit` (A60).
  - Se ocultan solo las imágenes decorativas que van detrás de texto.
- **Movimiento:** desplazamiento suave solo con `motion-safe`; sin animaciones en menú, pestañas ni etiquetas.
- **Áreas de toque:** el botón del newsletter pasa de 20×20 a 24×24 sin mover el icono; los iconos de compartir a 360 (18×18) cumplen por separación.

---

## 9 · Imágenes, fuentes, build y despliegue

### Imágenes (`public/images/`)

- 16 fotos exportadas del archivo de Figma a tamaño de origen; 10 retratos, el hero de Contact y las fotos de los proyectos 7 a 9, generados (D29, D30, A41).
- **Variantes por ancho:** escalera 640 · 960 · 1280 · 1920 sin pasar del original (`getSrcSet` en `src/data/responsiveImages.ts`; torre `[606]`, About `[400, 800]`). Sin variantes: mapa (ahorro medido del 1–10 %), foto 03 (724 px) y retratos. Se regeneran si cambia un original.
- **`sizes` = ancho efectivo pintado:** el máximo entre el ancho de la caja y su alto por la proporción del archivo, porque todas las fotos usan `object-cover`. Validados de 1 en 1 px entre 320 y 1880 en 71 instancias.
- **Torre del hero:** WebP calidad 90 con canal alfa (153 KB, −83 % frente al PNG, sin halo medido en el borde).
- **Foto principal de cada ruta** (torre, mapa, hero del detalle, hero de Contact): `fetchPriority="high"` y `revealOnLoad`: oculta hasta `load` y aparición instantánea (A57). Antes se pintaban por franjas hasta 9 s a 1440.
- Las que se montan al interactuar (Services), sin `lazy` y con `decoding="sync"`.

### Fuentes

Clash Display y Satoshi por la API de Fontshare, en dos hojas de estilo (pedidas juntas, la API devolvía solo la primera familia). La ITF Free Font License prohíbe distribuirlas por repositorio, así que ningún archivo de fuente entra en el repo ni en el despliegue. Si la API no responde, queda la pila del sistema. Si se añade una CSP, debe permitir `api.fontshare.com` en `style-src` y `cdn.fontshare.com` en `font-src`.

### Build (`vite.config.ts`)

- JS en 4 trozos con `build.rolldownOptions.output.codeSplitting.groups`: react (react, react-dom, scheduler, react-router), react-aria, index y el runtime. Último build: react 257 kB, index 176 kB, react-aria 98 kB, runtime 0,6 kB; CSS 61,6 kB.
- Las clases de Tailwind viven como texto en el JS de los componentes: cambiar una clase cambia el trozo `index`, no solo el CSS. Tailwind también lee los comentarios y las cadenas: `@source not inline("blur")` en `app.css` evita la regla `.blur` que generaba `'blur'` en un `addEventListener`.
- `pnpm lint` (ESLint con `jsx-a11y` estricto) corre antes del build en el despliegue.

### Despliegue (Netlify)

- `/assets/*` inmutable 1 año (llevan huella en el nombre). `/images/*`, HTML y favicon con revalidación.
- **SPA renderizada en cliente:** el HTML inicial llega vacío y las tarjetas al compartir usan solo las `og:` estáticas de `index.html`. Decisión consciente para un portafolio; un sitio con necesidades de SEO se prerenderizaría.
- El 404 lo pinta la aplicación y el servidor responde 200.
- **Metadatos:** `description`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image` (`public/og-image.png`, 1200×630, compuesta desde capturas reales de Home) con ancho, alto y `og:image:alt`, y `twitter:card`. Fuera, a propósito: `author` (podría leerse como autoría del diseño), `og:locale`, `og:site_name` y metadatos por ruta (las redes no ejecutan JS).

---

## 10 · Desviaciones

Lo que cambia respecto al diseño, con el valor original para poder verificar la fidelidad. Contraste calculado sobre el fondo real; criterio WCAG entre paréntesis.

| ID | Dónde | Elemento | Original | Corregido | Motivo | Estado |
|---|---|---|---|---|---|---|
| D1 | Home, Projects, Project Details | Título del CTA | `gray-4` `#F0F0F0` sobre `#FF5200`: 2,85:1 | `gray-1`: 3,25:1 (peor punto sobre las mallas: 2,69:1 a 1440, 2,50:1 a 360) | Texto grande exige 3:1 (1.4.3) | Aplicada |
| D2 | Menú | Borde de la pastilla de página actual (también Contact us en `/contact`) | `gray-10` sobre `#020100`: 1,40:1 | `gray-7`: 6,28:1 | Estado visible de un control (1.4.11) | Aplicada |
| D3 | Footer | Borde del campo del newsletter | `gray-11`: 1,27:1 | `gray-7` | Límite de un campo (1.4.11) | Aplicada |
| D4 | Footer | Columna «Properties» | «Properties» | «Projects» | Menú y footer nombraban distinto el mismo destino | Aplicada |
| D5 | Menú | Página actual | «Home» marcado en Projects, Project Details, Contact y 404 | Página real con `aria-current`; ninguna en 404 y genérica | Estado incorrecto en el diseño | Aplicada |
| **D6** | Todo el sitio | **Texto de los botones naranjas** | **`gray-4` `#F0F0F0` sobre `#FF5200`: 2,85:1** | **`gray-13` `#020100`: 6,41:1** | **Texto normal exige 4,5:1 (1.4.3); el blanco solo da 3,25:1** | **Aplicada** |
| D7 | Home | Textos de los botones del hero | «View Our Projucts» a 1440; minúsculas a 774 y 360 | «Schedule a Call» y «View Our Projects» en los tres | Errata y un solo texto por control | Aplicada |
| D8 | Home | Flecha «siguiente» de Featured a 1440 | Activa | Deshabilitada | Las 3 tarjetas ya caben | Aplicada |
| D9 | Home | Pestaña activa de Services | Relleno: 1,14:1 frente a la inactiva | Borde `gray-7` | Estado visible (1.4.11) | Aplicada |
| D10 | Projects | Borde de los 4 campos del buscador | `gray-10` sobre `#161514`: 1,22:1 | `gray-7` en los cuatro | Límite de un campo (1.4.11); los cuatro por coherencia | Aplicada |
| D11 | Projects | Sexta tarjeta a 1440 | Repite «The Village» con otra foto | The Courtyard, con esa foto | Un proyecto no aparece dos veces | Aplicada |
| D12 | Projects | «See More» a 1440 | Dibujado bajo 6 tarjetas | — | Con 9 proyectos (A41) el botón existe también a 1440 y la sección mide lo que el diseño | Retirada |
| D13 | Projects | Ubicación de las tarjetas | «Upper Macungie Township, PA» en todas | Tres ubicaciones | El filtro «Location» necesita más de un valor | Aplicada |
| D14 | Project Details | Tarjeta 1 de «You may also like» | Título «The Skyline» con datos y foto de The Grand Estate | Datos y foto del proyecto que toque | Datos de otro proyecto | Aplicada |
| D15 | Project Details | Tarjetas 2 y 3 de «You may also like» | La misma foto (la imagen por defecto) | Cada proyecto con su foto | Una foto para dos proyectos | Aplicada |
| D16 | Project Details | Instagram en Compartir | Instagram | X, con su URL de compartir | Instagram no admite compartir un enlace desde la web | Aplicada |
| D17 | Project Details | «5min Read» y barra | Texto fijo y barra parada en 272 px | Minutos calculados («2min Read») y progreso real | Un indicador que no indica nada; unas 300 palabras no son 5 minutos | Aplicada |
| D18 | Project Details | Carril de la barra de lectura | `gray-10`: 1,40:1 | Contorno `gray-7`, sin relleno | Con progreso real, el carril da la proporción (1.4.11) | Aplicada |
| D19 | Project Details, Contact | Título del CTA lateral y del formulario | «Have a project in your mind?» | «Have a project in mind?» | Redacción | Aplicada |
| D20 | Contact | Borde de los 7 campos | `gray-10`: 1,40:1 | `gray-7` | Límite de un campo (1.4.11) | Aplicada |
| D21 | Contact | Casilla de aceptación | Relleno 1,14:1 y borde 1,40:1 | Borde `gray-7` | Límite de un control (1.4.11) | Aplicada |
| D22 | Footer | «Our Offices» | «Our Offices» | «Our Office» | Footer y página nombraban distinto el mismo bloque | Aplicada |
| D23 | Contact | «Preferred Location» a 360 | Tercer desplegable solo a 360 | Se quita; el formulario mide 72 px menos | Un formulario no cambia de campos según el ancho | Aplicada |
| D24 | Contact | Orden de los campos a 774 | Name y Email en fila, Phone debajo | Name y Phone en fila, Email debajo | Un solo orden en el DOM que coincide con lo que se ve (2.4.3) | Aplicada |
| D25 | Contact | Texto de la casilla | Urbanist Medium 16/150 % | Satoshi Medium 16/150 % | Tercera familia para una sola línea | Aplicada |
| D26 | Contact | Caja del prefijo a 774 | 78×52 | 80×56, como a 1440 y 360 | Más baja que su fila | Aplicada |
| D27 | Contact | Menú a 360 | Frame suelto de 80 px | Componente de 64 px | Un solo menú móvil en el sitio | Aplicada |
| D28 | Contact | Colores sueltos a 360 | `#BFBFBF` y `#262626` | `gray-6` y `gray-10` | Trazabilidad con los tokens; diferencia de 1–2 sobre 255 | Aplicada |
| D29 | Home | 10 retratos (reseñas, clientes, testimonios) | Fotos de caras del archivo, sin origen declarado | Retratos generados | Caras identificables junto a nombres y citas inventados; CC BY no licencia derechos de imagen | Aplicada |
| D30 | Contact | Foto del hero | 950×1267 ampliada a 1312; marca de un plugin con un enlace que ya no existe | Imagen generada de 2752×1536 con la misma escena | Origen sin confirmar y falta de resolución | Aplicada |
| D31 | Home | Fotos de Featured Projects | La imagen por defecto en algunas tarjetas a 774 y 360 | Cada proyecto con su foto en los tres anchos | Una tarjeta no cambia de foto según el ancho | Aplicada |
| D32 | Home | Tercera tarjeta de testimonios a 1440 | Repite a Emily J. Smith con la cita de David L. Lee | Michael R. Torres con una cita nueva | Una persona no firma dos testimonios | Aplicada |
| D33 | Home | Empresa de Sarah K. Johnson | «Johnson Co» a 1440 | «Johnson Construction» en los tres | Un solo texto por persona | Aplicada |
| D34 | Home | Párrafo de testimonios a 360 | «We're not just building…» | «At Pinnacle, we're not just building…» | Un solo texto por sección | Aplicada |
| D35 | Contact | Destino de «Get Directions» | Dirección ficticia, sin enlace | El texto no cambia; el enlace lleva a «Upper Macungie Township, PA» | Maps no encuentra la dirección ficticia | Aplicada |
| D36 | Footer | Logo a 1440 | Texto del logo en `gray-1` | El mismo `logo.svg` de la barra (`gray-4`) | El mismo logo en la misma página | Aplicada |
| D37 | Footer de Home | Grupos a 1440 | Juntos a la izquierda, separación 64 | Repartidos a todo el ancho | Así están en el componente y en las otras 4 páginas | Aplicada |
| D38 | Home | Cabecera de Services por debajo de 774 | Título e icono a la izquierda | Título, icono y párrafo centrados | Centrada a 774 y 1440, y la de Testimonials también a 360 | Aplicada |
| D39 | Home | Tarjetas de Featured a 360 | 324,67 de ancho, rellenos 16, 24 y 24 | 328 y relleno 16 en las tres | Una tarjeta no cambia de relleno dentro del carril | Aplicada |
| D40 | Home | Párrafo de Featured | «we've» | «We've» | Mayúscula inicial | Aplicada |
| D41 | Home | Icono de la flecha deshabilitada | `gray-4` | `gray-7` | Activa y deshabilitada solo se distinguían a 1,14:1 | Aplicada |
| D42 | Projects | Borde de los pines | 0,8 px en 9 de 13 y 1 px en 4 | 1 px en todos | El navegador pinta 0,8 como 1 px y rompía el alto | Aplicada |
| D43 | Projects | Separación entre tarjetas a 360 | 16, 32 y 16 alternados | 16 en todas | La alternancia agrupa de dos en dos y no sobrevive al filtrado | Aplicada |
| D44 | Projects | Desplegables a 774 | Tres de 199,33; el contenido invade el relleno | Columnas iguales con mínimo igual a su texto | «Project Cost» se cortaba con el relleno respetado | Aplicada |
| D45 | Home | Color del párrafo del hero a 360 | `#BFBFBF` | `gray-6` | Trazabilidad (criterio de D28) | Aplicada |
| D46 | Home | Párrafo del hero a 360 | «we've» | «We've» | Un solo texto en los tres anchos | Aplicada |
| D47 | Home | Cita de Amanda | — | — | Las correcciones probadas alargaban la primera línea fuera de la pantalla a 360: queda el texto de Figma | Retirada |
| **D48** | Home | **Fondo de las reseñas del hero** | Degradado al 50 % sobre la torre: 1,47:1 en el peor punto | Capa `gray-13` opaca bajo el mismo degradado: ≥ 4,63:1 | 1.4.3; con cualquier transparencia la torre deja pasar luz (95 %: 4,36:1) | Aplicada |
| **D49** | Home | **Título de About** | `gray-4` sobre el naranja: 2,85:1 | `gray-1`: 3,25:1 | 1.4.3, texto grande (criterio de D1) | Aplicada |
| **D50** | Home | **Párrafo y valoración de About** | `gray-1` sobre el naranja: 3,25:1 | `gray-13`: 6,41:1 | 1.4.3 (criterio de D6) | Aplicada |
| D51 | Home | Colores sueltos de Testimonials a 774 y 360 | `#BFBFBF` y `#262626` | `gray-6` y `gray-10` | Trazabilidad | Aplicada |
| D52 | Home | Separadores de las firmas | Guion y comas en tres colores distintos | Todos en `gray-6`; solo el nombre en `gray-4` | Un estilo por pieza | Aplicada |
| D53 | Home | Espacios sobrantes de Sarah | Inicial en la firma y final en la cita | Sin los dos | El inicial desplazaba la firma | Aplicada |
| D54 | Home, Contact | Colores sueltos de la FAQ a 360 | `#262626` y `#BFBFBF` | `gray-10` y `gray-6` | Trazabilidad | Aplicada |

---

## 11 · Añadidos que el diseño no dibujó

| ID | Dónde | Qué se añade |
|---|---|---|
| A1 | Menú | Panel abierto a 774 y 360 con los 5 enlaces y Contact us |
| A2 | Newsletter | Mensajes de error y de confirmación |
| A3 | Todo el sitio | Estados de foco y hover de todos los controles |
| A4 | Todo el sitio | Página genérica como destino de los enlaces sin página |
| A5 | Home | Tercera noticia («Smart Tech · The Future of Smart Homes», de la página Blog del archivo) |
| A6 | Home | Contenido de las pestañas Property Management, Commercial y Development |
| A7 | Carrusel | Flechas deshabilitadas y posiciones 02 y 03 |
| A8 | Projects | Opciones de los desplegables y datos de filtro del JSON |
| A9 | Projects | Aviso del número de resultados |
| A10 | Projects | Texto escrito del campo de búsqueda en `gray-4` |
| A11 | Projects | Sexto proyecto (The Courtyard) |
| A12 | Projects | Pines como enlaces al detalle, con foco y hover |
| A13 | Project Details | Detalle de los demás proyectos con la misma plantilla |
| A14 | Project Details | Destino de cada icono de compartir y confirmación «Link copied» |
| A15 | Project Details | Columna lateral fija a 1440 |
| A16 | Project Details | Progreso real de lectura y minutos por proyecto |
| A17 | Project Details | Regla de selección de «You may also like» |
| A18 | Contact | Etiqueta flotante |
| A19 | Contact | Asterisco en los obligatorios, mensajes de error y color de error |
| A20 | Contact | Casilla marcada: relleno de acento y marca en `#020100` |
| A21 | Contact | Confirmación en la misma caja |
| A22 | Contact | 8 países con su bandera |
| A23 | Contact | Opciones de «Select budget» y «Service you are interested in» |
| A24 | Genérica | Título y párrafo propios sobre la maqueta del 404 |
| A25 | Genérica | Línea de créditos del diseño y de los iconos, con 5 enlaces |
| A26 | Todo el sitio | Enlaces de salto «Skip to main content» y «Skip to footer» |
| A27 | Todo el sitio | Contenido limitado a 1440 y centrado en ventanas más anchas |
| A28 | Todo el sitio | Mano en todos los botones activos |
| A29 | Footer | Campo con ancho máximo de 305 y separación mínima de 16 entre grupos |
| A30 | Newsletter | Colores propios con autocompletado del navegador |
| A31 | CTA | Ancho máximo del título por tramo (308, 614, 915). Ajuste puntual |
| A32 | Home | La caja del título de Services puede encoger por debajo de 360 |
| A33 | Home | Tarjetas de Services en columnas automáticas con mínimo de 416. Ajuste puntual |
| A34 | Home | Párrafo de Services con ancho máximo de 694 entre 774 y 1439. Ajuste puntual |
| A35 | Carrusel | Tarjetas de 328 por debajo de 774; carril hasta los bordes por debajo de 1440 |
| A36 | Carrusel | Desplazamiento suave y seguimiento del foco de teclado |
| A37 | Projects | Anillo `gray-13` en el foco de los pines |
| A38 | Projects | Desplegables que crecen con la opción elegida a 1440; hover |
| A39 | Projects | Bajada a los resultados tras enviar |
| A40 | Todo el sitio | `color-scheme: dark` |
| A41 | Projects | Proyectos 7 a 9 (The Arcade, The Workshop, The Terraces), con contenido inventado y fotos generadas |
| A42 | Projects | Sin resultados: título, ayuda y «Clear filters» |
| A43 | Contact | Valor largo con puntos suspensivos; etiqueta limitada a su hueco |
| A44 | Contact | Fondo y color propios en cada `<option>` |
| A45 | Contact | Contorno visible en el foco tras un envío fallido, también con ratón |
| A46 | Todo el sitio | Hover del naranja: `#FE6D2F` (texto `gray-13`, 7,39:1) |
| A47 | Fondo | Anclado a la caja de 1440 en ventanas más anchas |
| A48 | Fondo | Oculto en alto contraste, junto con los fundidos |
| A49 | Todo el sitio | Footer abajo en páginas más bajas que la ventana; hueco del 404 y la genérica con el fondo de página |
| A50 | Home | Torre y reseñas centradas entre los anchos del diseño |
| A51 | Home | Botones del hero por encima de la torre con el foco |
| A52 | Home | Título de About en dos líneas por debajo de 360 |
| A53 | Home | Líneas de About ocultas en alto contraste |
| A54 | Project Details | La dirección baja de línea si no cabe junto a la etiqueta |
| A55 | Todo el sitio | Foco programático de contenedores sin `tabindex` en reposo; hueco del carril |
| A56 | CTA | Mallas ocultas en alto contraste |
| A57 | 4 rutas | Foto principal entera al terminar de cargar |
| A58 | Todo el sitio | Contorno de los botones primary, secondary y «Send» en alto contraste |
| A59 | Varias | Línea de Amenities, subrayados y puntos de los pines visibles en alto contraste |
| A60 | Varias | Iconos con color propio que heredan el del sistema en alto contraste |
| A61 | Footer | Toda la caja del newsletter enfoca el campo |

### Invisibles (sin cambio visual)

Etiquetas de todos los campos; nombre de cada red y aviso de pestaña nueva; `aria-current`; nombre del carrusel, de sus flechas y aviso de posición; patrón de teclado de pestañas; `<form role="search">`; `<h1>` en cada página; pines en lista con nombre; `alt=""` del mapa; barra de lectura fuera del árbol; `autocomplete` en nombre, teléfono y correo; selector de prefijo «Country code».

---

## 12 · Diferencias entre anchos que se respetan

- Enlaces e iconos del footer en `gray-1` solo a 774; títulos de grupo a 18 y copyright a 12 a 360.
- El título del CTA no lleva la forma decorativa a 360. Copyright escrito «@2024 Pinnacle. All Rights Reserved.».
- Botones del hero a 18 px a 1440 y a 16 a 774 y 360. «View all blog post» más alto que los demás (61).
- Pines: 5 a 1440 y 774, 3 a 360. Buscador en una fila, en tres y en columna. Tarjetas visibles al cargar: 6, 4 y 4.
- Project Details: columna a la derecha a 1440 y encima a 774 y 360; «Schedule a free call» solo a 1440; «5min Read» y su barra a 1440 y 774. «Share» en `#FFFFFF` solo a 774.
- Contact: datos a la izquierda del formulario a 1440 y encima a 774 y 360; «Send» debajo a todo el ancho a 360. Relleno lateral de 64 en el 404 a 774.
- FAQ: 2 columnas a 1440 y 1 a 774 y 360; separación 24 · 32 · 24 entre tarjetas a 360; icono del título arriba a 774 y 360.
- «You may also like»: 3, 2 y 2 tarjetas; imagen → texto a 24 a 360 solo en esta sección.
- Testimonials: 4 tarjetas a 1440 y 3 a 774 y 360; sin fondo de tarjeta a 1440.
- Entre 774 y 1439 se calca la composición de 774 salvo los ajustes A31, A33 y A34.

---

## 13 · Diferencias propias del navegador, la plataforma y el lector

Se anotan y no se corrigen.

**Firefox**

- Un clic en un título con `tabindex="-1"` y Tab devuelve el foco al principio de la página (en Chromium sigue desde el título). Con `.focus()` por script no ocurre.
- Tras un clic en un hueco, Tab sigue desde el punto pulsado; Chromium, desde el inicio del contenedor.
- Al cerrar el menú con Esc tras abrirlo con ratón, el foco vuelve a «Menu» sin `:focus-visible`.
- El `<select>` se abre con Espacio (Chrome también con Intro); el historial de autocompletado sale al segundo clic o con la flecha abajo.
- Sin Web Share en escritorio: sale «Share by email».
- Viñetas nativas 0,5 px más altas; cajas redondeadas a 1/60 px (Chromium, a 1/64).

**Chromium**

- Con la columna sticky de Project Details, el placeholder del newsletter pierde el suavizado subpíxel a partir de 1440. Ninguna caja cambia.
- `line-clamp` junto al recorte a la altura de mayúscula corta las letras bajo la línea base en Edge: las firmas de Testimonials no llevan `line-clamp` desde 774.
- Suavizado de las líneas de 1,5 px del fondo distinto del de Figma; décimas de ancho por el render de Satoshi y Clash Display.
- A 320 (fuera del diseño) el bloque del título de Testimonials se sale 8 px por lado, sin desplazamiento horizontal.

**Rueda y anclas.** Si se pulsa un enlace de ancla con la rueda aún girando, la página sigue a la rueda (Chrome y Firefox). Medido con rueda real: los fallos coinciden exactamente con los recorridos con eventos de rueda después del clic. `keepAnchored` cubre los cambios de alto y se cierra con la primera interacción.

**Netlify.** El runtime de 589 B se sirve sin comprimir. Una URL inexistente bajo `/assets/` devuelve el HTML con 200 y caché inmutable (nunca la enlaza nada).

**Lectores de pantalla**

- NVDA: con el lector activo el primer Tab va a «Skip to footer» (el cursor de exploración ya está en el primero); al enfocar `<main>`, el footer o el buscador lee el contenedor entero; «cliqueable» al leer `<main>`; un mismo aviso repetido («Link copied», «No projects match…») no se vuelve a anunciar; «Email address» dos veces solo en la lectura de corrido del footer.
- El `<h1>` del 404 se lee en dos líneas en modo exploración por el `<br>`.

---

## 14 · Pruebas

Ningún arnés forma parte del repo. Cada tramo se midió con scripts de un solo uso y se comprobó a la vista.

### Por programa (Chromium y Firefox)

| Qué | Cómo |
|---|---|
| Medidas frente a Figma | 360, 774, 1440 y 1880 (y 320, 500, 773, 1000, 1439 donde aplica), Edge sin interfaz |
| Barrido entre 774 y 1439 | De 1 en 1 px en Chromium (7 rutas y los 9 proyectos) y Firefox 158 por WebDriver BiDi |
| Huella antes y después de cada cambio | 7 rutas × 5 anchos: cajas, Tab real, contornos de foco, alto del documento y desplazamiento horizontal |
| Navegación y foco | 56 casos (rutas, anclas, Atrás y Adelante, buscador, «See More», enlaces de salto, menú) en dev, en el build y en Firefox |
| «Clic + Tab» | 55 casos en 7 rutas a 360 y 1440 |
| Alto contraste emulado | Edge (`forced-colors`) y Firefox (`document_color_use = 2`), 7 rutas |
| Iconos y SVG | Trazados frente a la exportación de Figma; licencia de los iconos por diferencia de píxeles frente a su paquete |
| Contraste | En el peor píxel sobre fondos decorativos, en el navegador |
| Carga de imágenes | Acotada: perfil P (150 ms, 200 kB/s), 4 rutas × 2 anchos, mediana de 3. No es una medida de rendimiento |

### A mano (contra Netlify)

| Qué | Dispositivo | Resultado |
|---|---|---|
| Teclado en las 6 rutas y el newsletter | Portátil 1366 × 768, Firefox | Sin fallos |
| NVDA 2026.2 en las 6 rutas, avisos, formularios y créditos | PC, Chrome | 4 hallazgos, corregidos y confirmados |
| TalkBack en Home y Contact; compartir del sistema, teclado virtual, footer abajo | Android, Chrome | Sin fallos tras los arreglos |
| Alto contraste real (Acuático) en 4 rutas y el footer | Windows, Chrome | Correcto tras un arreglo (doble indicador en los campos) |
| Primera visita con caché vacía | Chrome en incógnito y Firefox en privada | Las 4 fotos principales enteras de una vez |
| Revisión a la vista en cada tramo | Chrome y Firefox en Windows, PC y portátil | Correcto |

**Hallazgos de las pruebas manuales, corregidos:** espacios ocultos que no llegaban al árbol de accesibilidad; aviso del buscador que se callaba sin cambio de URL; casilla anunciada como inválida antes de enviar; error del newsletter leído dos veces.

### Sin probar

Safari, iOS y VoiceOver; NVDA con Firefox; TalkBack con Firefox; alto contraste real en Firefox; el texto del árbol de accesibilidad en Firefox (BiDi no lo expone; los nombres sí se midieron); Featured Projects con NVDA por debajo de 1440; gesto táctil real en el carrusel; carrusel, pestañas y bajada a resultados con movimiento reducido (revisado en el código, no medido); qué pasa si la API de Fontshare no responde; anclas a 774 con menú contra el build; si arrastrar la barra de desplazamiento cuenta como interacción para `keepAnchored`.

---

## 15 · Límites conocidos

- **Foto 03 de The Grand Estate:** el origen en Figma es de 724×965; entre 1302 y 1439 se amplía ×1,006 a ×1,195.
- **Barra de lectura a 774:** el bloque queda arriba y sale de pantalla al desplazarse, así que casi siempre se ve vacía.
- **Banderas:** al elegir otro país cambia el estilo de dibujo (Camerún sale del Figma; las demás, de circle-flags).
- **Listas del sistema:** la abierta de los desplegables es la del navegador, más ancha que el control y con su color de resaltado.
- **Carrusel:** tras un clic en una zona no interactiva de una tarjeta y una flecha del teclado, el carril pinta el contorno de foco recortado por debajo de 1440. La barra se oculta solo con `scrollbar-width: none` (versiones de navegador anteriores la muestran).
- **Formularios:** un control corregido sigue con su error hasta el siguiente envío; la confirmación de Contact no ofrece volver al formulario; por debajo de 360 se cortan «Phone Numb…» y «Service you are intere…».
- **Fondo:** por encima de unos 1463 px se ve el borde derecho de las rayas (A47; Figma no define más allá).
- **Reseñas del hero:** con la capa opaca (D48), el desenfoque de fondo ya no deja ver nada; se mantiene porque quitarlo cambia el render del texto, del borde y de la sombra.
- **Media estrella:** el SVG pinta centrado el trazo que en Figma va por dentro (0,15 px).
- **Cita de Amanda a 320:** la primera línea queda cortada 27 px; el diseño no tiene ese ancho.
- **Alto contraste:** al navegar, el `<h1>` muestra un recuadro, porque es la única señal de dónde quedó el foco; desaparece con el primer clic o Tab.
- **Fuentes de respaldo:** si Clash Display no carga, el título del CTA puede pasar a 3 líneas entre 366 y 773.
