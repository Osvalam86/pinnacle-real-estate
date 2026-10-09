# De v3 a v4: nombres y sintaxis vigentes

Esta tabla sirve para escribir v4 sin arrastrar hábitos de v3 y para limpiar clases existentes. No es una guía de migración: un proyecto v3 completo se migra con `npx @tailwindcss/upgrade`.

Varias formas antiguas siguen compilando en v4 por compatibilidad. Que compilen no significa que sean correctas: algunas cambiaron de significado.

## Contenido

1. Configuración
2. Utilidades renombradas
3. Utilidades eliminadas
4. Escalas que cambiaron de significado
5. Cambios de comportamiento sin aviso
6. Sintaxis

---

## 1. Configuración

| v3 | v4 |
|---|---|
| `tailwind.config.js` | `@theme` en el CSS de entrada |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| `content: [...]` | Detección automática. Rutas extra con `@source "../ruta";` |
| `safelist` | `@source inline("underline");` |
| `darkMode: 'class'` | `@custom-variant dark (&:where(.dark, .dark *));` |
| `prefix: 'tw-'` | `@import "tailwindcss" prefix(tw);` y clases `tw:flex` |
| `theme.extend.colors` | Variables `--color-*` en `@theme` |
| `theme(colors.red.500)` en CSS | `var(--color-red-500)` |
| `theme(screens.md)` en media queries | `theme(--breakpoint-md)` |
| `@layer utilities { .x {} }` para crear utilidades | `@utility x {}` |
| `corePlugins` | No existe |
| `container: { center, padding }` | `@utility container { margin-inline: auto; padding-inline: 2rem; }` |
| Paquete `tailwindcss` como plugin de PostCSS | `@tailwindcss/postcss` |
| `postcss-import` y `autoprefixer` | Ya incluidos; se quitan |
| CLI `npx tailwindcss` | `npx @tailwindcss/cli` |
| Plugin `@tailwindcss/container-queries` | Incluido: `@container`, `@md:` |

## 2. Utilidades renombradas

| v3 | v4 | ¿Compila la forma vieja? |
|---|---|---|
| `bg-gradient-to-r` | `bg-linear-to-r` | Sí |
| `flex-shrink-0` `flex-grow` | `shrink-0` `grow` | Sí |
| `overflow-ellipsis` | `text-ellipsis` | Sí |
| `decoration-slice` `decoration-clone` | `box-decoration-slice` `box-decoration-clone` | Sí |
| `break-words` | `wrap-break-word` | Sí |
| `start-4` `end-4` | `inset-s-4` `inset-e-4` | Sí |
| `bg-left-top` `object-left-top` | `bg-top-left` `object-top-left` | Sí |
| `max-w-screen-md` | `max-w-3xl` o `max-w-(--breakpoint-md)` | Sí |
| `outline-none` | `outline-hidden` | Sí, pero hace otra cosa (sección 5) |

## 3. Utilidades eliminadas

| v3 | v4 |
|---|---|
| `bg-opacity-50` `text-opacity-50` `border-opacity-*` `ring-opacity-*` `divide-opacity-*` `placeholder-opacity-*` | Modificador de opacidad: `bg-black/50`, `text-default/80` |
| `transform` `filter` `backdrop-filter` para activar efectos | No hacen falta: `rotate-45`, `blur-md` funcionan solos |
| `transform-none` para quitar `scale`, `rotate` o `translate` | `scale-none`, `rotate-none`, `translate-none` |

## 4. Escalas que cambiaron de significado

En v4 cada paso de la escala tiene nombre. Las formas sin nombre siguen compilando con su valor de v3 (salvo `ring`), pero en v4 ese valor tiene otro nombre:

| Valor visual de v3 | En v4 se escribe |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `blur-sm` / `backdrop-blur-sm` | `blur-xs` / `backdrop-blur-xs` |
| `blur` / `backdrop-blur` | `blur-sm` / `backdrop-blur-sm` |
| `drop-shadow-sm` | `drop-shadow-xs` |
| `drop-shadow` | `drop-shadow-sm` |
| `ring` (3px) | `ring-3` |

En código nuevo no se escriben las formas sin nombre (`shadow`, `rounded`, `blur`, `ring`): son alias heredados, y `shadow-sm` en v3 y en v4 son sombras distintas. Con el nombre explícito no hay ambigüedad entre versiones. Y si el proyecto resetea esas categorías, se usan los tokens del diseño.

## 5. Cambios de comportamiento sin aviso

| Qué | v3 | v4 | Qué hacer |
|---|---|---|---|
| Color de borde por defecto | `gray-200` | `currentColor` | Toda clase `border` o `divide` lleva su color: `border border-subtle`. |
| `ring` | 3px azul | 1px `currentColor` | Escribir ancho y color: `ring-2 ring-action-primary`. |
| `outline-none` | Outline invisible que se mantenía en alto contraste | Quita el outline también en alto contraste | `outline-hidden`, y un indicador de foco propio con `focus-visible:`. |
| `hover:` | Siempre | Solo con `@media (hover: hover)` | Nada esencial depende de hover. |
| `space-*` y `divide-*` | Selector `~` | Selector `:not(:last-child)` | Usar `gap` en flex o grid. |
| Placeholder | `gray-400` | Color del texto al 50% | Definir `placeholder:text-*` si el diseño lo especifica. |
| Botones | `cursor: pointer` | `cursor: default` | Restaurar en `@layer base` si el diseño lo pide (ver `css-propio.md`). |
| `<dialog>` | Centrado con margin | Margin en 0 | Centrar con clases o en `@layer base`. |
| Atributo `hidden` | Una clase `flex` lo anulaba | El atributo gana | Quitar el atributo para mostrar el elemento. |
| Degradados con variantes | La variante reiniciaba todo el degradado | Se conservan las demás paradas | `via-none` para pasar de tres paradas a dos. |
| `transition` y `transition-colors` | Sin `outline-color` | Incluyen `outline-color` | Fijar el color del outline fuera del estado para que no se anime desde otro valor. |
| `transition-[opacity,transform]` | Animaba `scale` y `rotate` | Ya no, porque usan propiedades individuales | `transition-[opacity,scale]`. |

## 6. Sintaxis

| v3 | v4 |
|---|---|
| `!flex` `md:!hidden` | `flex!` `md:hidden!` |
| `bg-[--brand]` | `bg-(--brand)` |
| `grid-cols-[max-content,auto]` (coma como espacio) | `grid-cols-[max-content_auto]` |
| `first:*:pt-0` (de derecha a izquierda) | `*:first:pt-0` (de izquierda a derecha) |
| `group-[.is-open]:` y `data-[current]:` para todo | Variantes directas cuando existen: `data-current:`, `aria-expanded:`, `has-checked:`, `in-*:`, `not-*:`, `nth-3:` |
| `@apply` en estilos de Vue, Svelte, Angular o CSS Modules sin más | `@reference "../app.css";` al inicio del bloque |
