# Patrones de layout, estados y accesibilidad visual

## Contenido

1. Separación y layout
2. Responsivo
3. Container queries
4. Propiedades lógicas
5. Estados desde atributos
6. Foco
7. Accesibilidad visual
8. Movimiento
9. Texto
10. Clases condicionales por tecnología

---

## 1. Separación y layout

**La separación es del contenedor, no del hijo.** El espacio entre elementos se declara con `gap` en un contenedor flex o grid. Así un hijo se puede mover, ocultar o reordenar sin dejar márgenes sueltos.

```html
<!-- Pila vertical -->
<div class="flex flex-col gap-4">…</div>

<!-- Fila con alineación -->
<div class="flex items-center gap-3">…</div>

<!-- Rejilla de tarjetas que se ajusta sola -->
<ul class="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6">…</ul>

<!-- Layout de página -->
<div class="grid min-h-dvh grid-rows-[auto_1fr_auto]">…</div>
```

- **Grid** para el layout de página, las rejillas y todo lo que se alinea en dos ejes.
- **Flex** para alinear elementos dentro de un componente (el equivalente del auto layout de Figma).
- **Subgrid** para que los hijos de una tarjeta se alineen con los de sus hermanas: `grid grid-rows-subgrid row-span-3`.
**Sin margin para separar.** Donde el diseño usa auto layout, o la separación cabe en un `gap`, no se usa margin ni `space-x-*` / `space-y-*`. Si el padre no es flex ni grid, se convierte.

```html
<!-- No: cada hijo carga con su separación -->
<section>
  <header>…</header>
  <ul class="mt-10">…</ul>
  <button class="mx-auto mt-10 block">…</button>
</section>

<!-- Sí: la separación y la alineación son del contenedor -->
<section class="flex flex-col gap-10">
  <header>…</header>
  <ul>…</ul>
  <button class="self-center">…</button>
</section>
```

El margin queda para lo que `gap` no puede expresar:

- Centrar un bloque: `mx-auto`.
- Márgenes negativos, cuando el diseño los usa o hacen falta para lograrlo: una separación negativa del auto layout (`gap` no admite negativos), un solape entre dos elementos o un elemento que se sale de su contenedor.

Cada margin que no sea `mx-auto` lleva un comentario con su motivo y se lista en la entrega.

**Hijos que pueden quedar vacíos.** Un `role="status"` o un mensaje de error que a veces no tiene contenido sigue siendo un hijo del contenedor y recibe su `gap`. No se le da margin condicional: se saca del flujo mientras está vacío (`empty:sr-only`, o `sr-only` según el estado) y vuelve al flujo cuando tiene texto. Sigue en el DOM, así el lector de pantalla anuncia el cambio.

## 2. Responsivo

- La clase sin prefijo es móvil. Cada breakpoint suma desde ahí: `flex-col md:flex-row`.
- Los breakpoints vienen del theme. Un breakpoint puntual que el diseño no define se escribe `min-[50rem]:`, y se reporta.
- `max-md:` solo para una excepción que no tiene sentido en móvil primero.
- Rango: `md:max-lg:flex` aplica solo entre `md` y `lg`.
- Los estilos de texto del diseño que cambian por breakpoint se combinan con tokens: `text-heading-md lg:text-heading-lg`.

## 3. Container queries

Cuando un componente se usa en lugares de distinto ancho (columna lateral, rejilla, página completa), se adapta a su contenedor y no al viewport:

```html
<div class="@container">
  <article class="flex flex-col gap-4 @md:flex-row">…</article>
</div>
```

- `@container` marca el contenedor; `@sm:`, `@md:`, `@lg:` usan los tamaños de `--container-*`.
- Con nombre, para contenedores anidados: `@container/card` y `@md/card:flex-row`.
- `@max-md:` y rangos `@min-md:@max-xl:` funcionan igual que los breakpoints.
- `@container-size` crea un contenedor de alto y ancho, para unidades `cqb`; requiere un alto definido.
- Container queries para componentes; breakpoints para el layout de la página.

## 4. Propiedades lógicas

En el eje horizontal se usan las utilidades lógicas, que respetan la dirección del texto:

| En lugar de | Usa |
|---|---|
| `pl-*` `pr-*` | `ps-*` `pe-*` |
| `ml-*` `mr-*` | `ms-*` `me-*` |
| `left-*` `right-*` | `inset-s-*` `inset-e-*` |
| `border-l` `border-r` | `border-s` `border-e` |
| `rounded-l-*` `rounded-r-*` | `rounded-s-*` `rounded-e-*` |
| `text-left` `text-right` | `text-start` `text-end` |
| `float-left` | `float-start` |

`px-*`, `mx-*` e `inset-x-*` ya son lógicas en v4. En el eje vertical, `pt-*` y `pb-*` son correctas; las lógicas (`pbs-*`, `pbe-*`, `mbs-*`) solo hacen falta si el proyecto soporta escritura vertical.

## 5. Estados desde atributos

El estado visual se lee del atributo que ya lo expresa para la tecnología asistiva. Así el estilo y la accesibilidad no pueden desincronizarse.

| Estado | Variante | Selector que genera |
|---|---|---|
| Expandido | `aria-expanded:` | `[aria-expanded="true"]` |
| Seleccionado | `aria-selected:` | `[aria-selected="true"]` |
| Presionado | `aria-pressed:` | `[aria-pressed="true"]` |
| Página actual | `aria-[current=page]:` | `[aria-current="page"]` |
| Inválido | `aria-invalid:` | `[aria-invalid="true"]` |
| Deshabilitado nativo | `disabled:` | `:disabled` |
| Deshabilitado por ARIA | `aria-disabled:` | `[aria-disabled="true"]` |
| Atributo booleano propio | `data-active:` | `[data-active]` |
| Atributo con valor | `data-[state=open]:` | `[data-state="open"]` |
| Abierto (`<details>`, `<dialog>`, popover) | `open:` | `[open]`, `:popover-open`, `:open` |
| Inerte | `inert:` | `[inert]` |

`aria-current:` sin corchetes genera `[aria-current="true"]`, que no coincide con `aria-current="page"`. Para la página actual se usa `aria-[current=page]:`.

`data-state-open:` genera `[data-state-open]` (atributo booleano), no `[data-state="open"]`.

**Estado del padre o de un hermano:**

- `group` en el padre y `group-aria-expanded:` en el hijo.
- `in-aria-expanded:` aplica si cualquier ancestro tiene el atributo, sin marcar el padre.
- `peer` en el hermano anterior y `peer-user-invalid:` en el siguiente.
- `has-checked:` estiliza el contenedor según un descendiente.

**Formularios**: `user-invalid:` muestra el error solo después de que el usuario interactuó, en lugar de `invalid:`, que lo muestra desde que carga la página.

## 6. Foco

```html
<button class="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
```

- `focus-visible:` en lugar de `focus:`: el indicador aparece con teclado y no con clic.
- El indicador tiene un contraste de al menos 3:1 contra el fondo adyacente (WCAG 1.4.11).
- Si el diseño no muestra el outline del navegador, se reemplaza: `outline-hidden` más un indicador propio. Nunca se quita sin reemplazo (WCAG 2.4.7).
- Con encabezados o barras fijas, el elemento enfocado no puede quedar tapado (WCAG 2.4.11): `scroll-mt-*` en los destinos o `scroll-pt-*` en el contenedor con desplazamiento.
- Un patrón de foco repetido se convierte en `@utility` (ver `css-propio.md`).

## 7. Accesibilidad visual

| Requisito | Cómo se cumple con clases |
|---|---|
| Área táctil mínima de 24 × 24 px (WCAG 2.5.8) | `min-h-6 min-w-6`. Para controles táctiles, 44 px: `min-h-11 min-w-11`, o `pointer-coarse:min-h-11`. |
| Texto redimensionable (1.4.4) | Tamaños en rem, que es lo que generan los tokens y la escala. |
| Espaciado de texto ajustable (1.4.12) | Contenedores de texto sin alto fijo: `min-h-*` en lugar de `h-*`. |
| Reflow a 320 px (1.4.10) | Móvil primero, sin anchos fijos en px: `w-full max-w-*`. |
| El color no es el único indicador (1.4.1) | Enlaces dentro de texto con `underline`; errores con icono o texto además del color. |
| Modo de alto contraste | `forced-colors:` para restaurar bordes o indicadores que dependan de sombras o fondos. |
| Texto solo para lectores de pantalla | `sr-only`; `focus:not-sr-only` en un enlace para saltar al contenido. |

## 8. Movimiento

- Las transiciones se declaran con sus propiedades y su duración desde tokens: `transition-colors duration-200 ease-out`.
- Todo movimiento que desplaza, escala o rota se condiciona: `motion-safe:transition-transform` o `motion-reduce:transition-none`.
- Entrada de elementos sin JavaScript: `starting:opacity-0` con `transition-discrete` en elementos que aparecen (`popover`, `<dialog>`).
- Animaciones complejas y coreografías quedan fuera de esta skill.

## 9. Texto

- Títulos con `text-balance`; párrafos con `text-pretty`.
- Truncar en una línea: `truncate`. En varias: `line-clamp-3`.
- Cadenas largas sin espacios (URLs, correos): `wrap-break-word` o `wrap-anywhere`.
- Cifras alineadas en tablas: `tabular-nums`.
- Altura igual a una línea de texto, útil para iconos junto a texto: `h-lh`.

## 10. Clases condicionales por tecnología

Las clases se escriben completas y se eligen con un mapa o un condicional. Nunca se arman por partes.

**React / Next**

```jsx
const tonos = {
  info: 'bg-surface text-default',
  marca: 'bg-action-primary text-white',
};

<span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 ${tonos[tono]}`}>
```

Si el proyecto ya usa `clsx`, `cn` o `cva`, se usan esas funciones igual que en el resto del código.

**Angular**

```html
<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5"
      [class.bg-action-primary]="tono === 'marca'"
      [class.bg-surface]="tono === 'info'">
```

**Nunjucks**

```njk
{% set tonos = { info: 'bg-surface text-default', marca: 'bg-action-primary text-white' } %}
<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 {{ tonos[tono] }}">
```

**Vue**

```html
<span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5', tonos[tono]]">
```
