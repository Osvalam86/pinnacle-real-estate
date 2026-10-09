# Valores y corchetes

Todo lo de este archivo está verificado compilando contra Tailwind 4.3 con la escala de fábrica (`--spacing: 0.25rem`).

## Contenido

1. Conversión de píxeles a la escala
2. Qué acepta cada familia de utilidades
3. Corchetes que tienen equivalente
4. Corchetes legítimos
5. Sintaxis de corchetes y variables
6. Valores que cambian en ejecución

---

## 1. Conversión de píxeles a la escala

Las utilidades de spacing y tamaño multiplican el número de la clase por `--spacing`. Con 0.25rem (4px), el número es `px ÷ 4` y acepta múltiplos de 0.25:

| px | Clase | px | Clase | px | Clase |
|---|---|---|---|---|---|
| 1 | `0.25` o `px` | 10 | `2.5` | 44 | `11` |
| 2 | `0.5` | 13 | `3.25` | 68 | `17` |
| 3 | `0.75` | 18 | `4.5` | 117 | `29.25` |
| 6 | `1.5` | 22 | `5.5` | 320 | `80` |

Cualquier píxel entero tiene forma directa. Un valor no entero (13.5px) no la tiene: se reporta como divergencia del diseño y, si hay que respetarlo, se escribe en corchetes con rem.

`1px` se escribe `px` en las utilidades que lo aceptan: `h-px`, `w-px`, `p-px`.

## 2. Qué acepta cada familia de utilidades

| Familia | Valor directo | Ejemplos | Si no cabe |
|---|---|---|---|
| Spacing y tamaño: `p` `m` `gap` `w` `h` `size` `min-*` `max-*` `inset` `top` `inset-s` `translate` `basis` `indent` `scroll-m` `scroll-p` `border-spacing` | Múltiplos de 0.25, negativos con `-`, fracciones, palabras clave, tokens `--spacing-*` | `mt-17` `-mt-4.5` `w-2/7` `size-11` `max-w-120` `translate-x-1/2` `h-dvh` `w-fit` `p-gutter` | Porcentaje que no es fracción: `w-[37%]`. Unidades de contenedor: `w-[50cqi]`. |
| Ancho máximo por contenedor: `max-w` `w` `min-w` | Tokens `--container-*` | `max-w-md` `max-w-content` `max-w-prose` | — |
| Grid: `grid-cols` `grid-rows` `col-span` `row-span` `col-start` `order` `columns` | Enteros | `grid-cols-15` `col-span-13` `order-13` `grid-cols-subgrid` `col-span-full` | Plantillas: `grid-cols-[1fr_auto]` |
| Flex: `flex` `grow` `shrink` | Enteros | `flex-2` `grow-2` `shrink-0` | — |
| `z` | Enteros, negativos con `-` | `z-45` `-z-1` | — |
| `opacity` y modificador `/` | 0–100 | `opacity-35` `bg-surface/35` | — |
| `aspect` | Proporciones y tokens | `aspect-4/3` `aspect-21/9` `aspect-video` | — |
| `rotate` `skew` `hue-rotate` | Grados enteros | `rotate-17` `skew-x-7` | Decimales: `rotate-[1.5deg]` |
| `scale` `brightness` `contrast` `saturate` | Porcentajes enteros | `scale-103` `brightness-115` | Decimales: `scale-[1.025]` |
| `duration` `delay` | Milisegundos enteros | `duration-250` `delay-75` | — |
| Bordes y líneas: `border` `outline` `outline-offset` `ring` `ring-offset` `divide` `decoration` `underline-offset` `stroke` | Píxeles enteros | `border-3` `outline-2` `ring-3` `underline-offset-3` | Decimales: `border-[1.5px]` |
| `line-clamp` | Enteros | `line-clamp-7` | — |
| Degradados | Ángulo y posición de paradas | `bg-linear-45` `from-10%` `to-90%` | Posición del radial: `bg-radial-[at_25%_25%]` |
| Interlineado `leading` | Múltiplos de la escala (como spacing) y tokens | `leading-7` (1.75rem) `leading-tight` | Sin unidad: token del estilo de texto, o `leading-[1.35]` |
| Tamaño de texto `text` | Solo tokens | `text-body-md` `text-heading-lg` | Un tamaño fuera del theme es un hueco del diseño. Si hay que respetarlo: `text-[0.8125rem]` y se reporta. |
| Interlineado junto al tamaño | Modificador `/` con la escala | `text-body-md/7` `text-sm/5.5` | `text-sm/[1.35]` |
| `tracking` | Solo tokens | `tracking-tight` | `tracking-[0.02em]` |
| `font` (peso) | Solo tokens con nombre | `font-medium` `font-bold` | Peso intermedio de fuente variable: `font-[650]` |
| `rounded` | Solo tokens | `rounded-card` `rounded-full` `rounded-none` | Mejor un token; si es único: `rounded-[10px]` |
| `shadow` `blur` `drop-shadow` `perspective` | Solo tokens | `shadow-card` `blur-md` | Mejor un token; si es único, corchetes |
| Color | Solo tokens, `transparent`, `current`, `inherit` | `bg-surface` `text-default` `bg-surface/50` | Un color fuera del theme es un hueco del diseño. Se reporta. |

## 3. Corchetes que tienen equivalente

El script de verificación corrige muchos de estos en su sección 1 (marcados con ✔). Los marcados con ✋ no los propone ahí y hay que revisarlos a mano. Cuando dos tokens o un token y un paso de la escala tienen el mismo valor, el script no elige: los lista como "mismo valor" en su sección 3 (marcados con ◐).

| Escrito | Equivalente | |
|---|---|---|
| `mt-[68px]` `mt-[4.25rem]` | `mt-17` | ✔ |
| `w-[18px] h-[18px]` | `size-4.5` | ✔ |
| `p-[2px]` | `p-0.5` | ✔ |
| `m-[-8px]` | `-m-2` | ✔ |
| `h-[1px]` | `h-px` | ✔ |
| `w-[100%]` `left-[100%]` | `w-full` `left-full` | ✔ |
| `top-[50%]` `w-[33.333%]` | `top-1/2` `w-1/3` | ✋ |
| `translate-x-[-50%]` | `-translate-x-1/2` | ✋ |
| `h-[100vh]` `h-[100dvh]` `min-h-[100svh]` | `h-screen` `h-dvh` `min-h-svh` | ✔ |
| `w-[fit-content]` `w-[min-content]` | `w-fit` `w-min` | ✔ |
| `max-w-[65ch]` | `max-w-prose` | ✋ |
| `grid-cols-[repeat(3,minmax(0,1fr))]` | `grid-cols-3` | ✔ |
| `col-span-[2]` `order-[1]` `z-[10]` | `col-span-2` `order-1` `z-10` | ✔ |
| `aspect-[16/9]` `aspect-[1/1]` | `aspect-video` `aspect-square` | ✔ |
| `rotate-[45deg]` `duration-[300ms]` | `rotate-45` `duration-300` | ✔ |
| `scale-[1.05]` | `scale-105` | ✋ |
| `opacity-[50%]` | `opacity-50` | ✔ |
| `opacity-[.5]` | `opacity-50` | ✋ |
| `border-[1px]` `border-[2px]` | `border` `border-2` | ✔ |
| `ring-[3px]` | `ring-3` | ✋ |
| `rounded-[9999px]` `rounded-[0px]` | `rounded-full` `rounded-none` | ✋ / ✔ |
| `font-[700]` `font-[500]` | `font-bold` `font-medium` | ✔ |
| `leading-[24px]` `leading-[1.5]` | `leading-6` `leading-normal` | ✔; ◐ si existe un `--spacing-*` de 24px |
| `bg-[#2455d4]` cuando existe `--color-blue-600` | `bg-blue-600`, o el semántico que lo referencia según el rol | ✔ si solo un token tiene ese valor; ◐ si hay más |
| `gap-[24px]` cuando existe `--spacing-gutter: 1.5rem` | `gap-gutter` o `gap-6`, según el rol | ◐ |
| `text-[16px]` cuando existe `--text-body-md: 1rem` | `text-body-md` | ◐ |
| `bg-[var(--brand)]` | `bg-(--brand)` | ✔ |
| `bg-[--brand]` | `bg-(--brand)` (con corchetes genera CSS inválido) | Sección 2 del script |
| `[display:flex]` `[margin-top:16px]` `[mask-type:luminance]` | `flex` `mt-4` `mask-type-luminance` | ✔ |
| `min-[768px]:` `min-[48rem]:` | `md:` (si coincide con un breakpoint) | ✋ / ✔ |
| `[@media(prefers-reduced-motion:reduce)]:` | `motion-reduce:` | ✔ |
| `data-[current]:` | `data-current:` | ✔ |
| `aria-[expanded=true]:` | `aria-expanded:` | ✔ |
| `has-[:checked]:` | `has-checked:` | ✔ |
| `[&:hover]:` | `hover:` | ✋ |
| `nth-[3]:` | `nth-3:` | ✋ |

## 4. Corchetes legítimos

Un corchete es correcto cuando expresa algo que no tiene forma directa. Lista cerrada:

| Caso | Ejemplo |
|---|---|
| Plantilla de grid | `grid-cols-[1fr_auto_2fr]` `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]` |
| Cálculo o función CSS | `w-[calc(100%-(--spacing(8)))]` `text-[clamp(1rem,2vw,1.5rem)]` `py-[calc(--spacing(4)-1px)]` |
| Decimal o unidad que la familia no admite | `border-[1.5px]` `leading-[1.35]` `tracking-[0.02em]` `w-[37%]` `w-[50cqi]` `rotate-[1.5deg]` |
| Atributo con valor | `aria-[current=page]:font-bold` `data-[state=open]:flex` |
| Selector sin variante propia | `[&>svg]:size-4` `[&_p]:text-pretty` `group-[.is-open]:flex` `nth-[2n+1]:bg-raised` |
| Condición sin variante propia | `supports-[display:grid]:grid` `min-[50rem]:flex` (breakpoint puntual, fuera del theme) |
| Propiedad sin utilidad | `[view-transition-name:card]` `[interpolate-size:allow-keywords]` `[--gap:1rem]` |
| Contenido y recursos | `content-['']` `bg-[url('/img/hero.png')]` `bg-size-[200px_100px]` |

Cada corchete que queda se menciona en la entrega con su motivo. Si el mismo valor aparece dos veces o más, deja de ser excepción: sube a `@theme` o a una `@utility`.

## 5. Sintaxis de corchetes y variables

- **Espacios**: guion bajo. `grid-cols-[1fr_500px_2fr]` produce `1fr 500px 2fr`. En URLs el guion bajo se conserva. Para un guion bajo literal ambiguo: `content-['hola\_mundo']`.
- **Variable CSS**: paréntesis, sin `var()`. `bg-(--brand)` equivale a `bg-[var(--brand)]`.
- **Tipo ambiguo**: cuando una variable podría ser tamaño o color, se indica el tipo: `text-(length:--size)`, `text-(color:--tone)`.
- **Escala dentro de un cálculo**: `--spacing(n)`. `py-[calc(--spacing(4)-1px)]`.
- **Important**: al final. `flex!`, `md:hidden!`.
- **Variantes apiladas**: se leen de izquierda a derecha, como en CSS. `*:first:pt-0` aplica a los hijos que son el primero.

## 6. Valores que cambian en ejecución

Un valor que viene de los datos (porcentaje de progreso, color elegido por el usuario, posición calculada) no se resuelve con una clase armada en ejecución ni con un `style` de la propiedad final. Se pasa como variable CSS y una utilidad la consume:

```html
<div class="h-2 w-(--progress) bg-action-primary" style="--progress: 40%"></div>
```

```jsx
<div className="h-2 w-(--progress) bg-action-primary" style={{ '--progress': `${value}%` }} />
```

La clase queda fija y detectable por Tailwind, y el valor puede cambiar sin generar CSS nuevo.
