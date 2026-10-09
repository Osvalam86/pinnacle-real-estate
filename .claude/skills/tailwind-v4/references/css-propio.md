# CSS propio en un proyecto con Tailwind v4

## Contenido

1. Antes de escribir CSS
2. `@utility`
3. `@custom-variant` y `@variant`
4. `@layer base`
5. `@layer components`
6. `@apply` y `@reference`
7. CSS de terceros y capas
8. `!important`

---

## 1. Antes de escribir CSS

La repetición de clases se resuelve primero con la herramienta de la tecnología:

| Tecnología | Herramienta |
|---|---|
| React, Next, Vue, Angular, Svelte | Un componente |
| Nunjucks, Handlebars, Twig | Una macro o un partial |
| Listas de datos | Un bucle sobre un solo elemento |
| HTML estático sin plantillas | Edición múltiple; si el patrón es grande, `@layer components` (sección 5) |

El CSS propio es para lo que eso no resuelve. Cada pieza va en su capa para que las utilidades puedan sobrescribirla.

## 2. `@utility`

Para una propiedad o patrón que Tailwind no trae, o que se repite con valores distintos. Funciona con todas las variantes (`hover:`, `md:`, `dark:`).

**Simple:**

```css
@utility focus-ring {
  outline: 2px solid var(--color-action-primary);
  outline-offset: 2px;
}
```

```html
<a class="focus-visible:focus-ring">
```

**Funcional** (recibe un valor):

```css
@utility stack-* {
  display: flex;
  flex-direction: column;
  gap: --spacing(--value(number));
}
```

`stack-4`, `stack-2.5` y `md:stack-6` funcionan. `--value()` acepta:

- Tokens del theme: `--value(--tab-size-*)`.
- Números sin unidad: `--value(integer)`, `--value(number)`, `--value(percentage)`, `--value(ratio)`.
- Valores en corchetes: `--value([length])`.
- Palabras fijas: `--value("auto", "none")`.
- Un valor por defecto para usar la clase sin sufijo: `--value(integer, --default(4))`.

Se escriben con propiedades CSS y variables del theme, no con `@apply`. Tailwind las ordena según la cantidad de propiedades, así que una utilidad de una sola propiedad puede sobrescribir otra de varias.

## 3. `@custom-variant` y `@variant`

**`@custom-variant`** crea una variante del proyecto:

```css
/* Modo oscuro por atributo en lugar de prefers-color-scheme */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* Condición con varias reglas */
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

`&:where(...)` mantiene la especificidad en cero, para que la variante no gane a otras clases por accidente.

**`@variant`** aplica una variante existente dentro de CSS propio:

```css
.cms-content a {
  color: var(--color-action-primary);
  @variant hover {
    text-decoration-thickness: 2px;
  }
}
```

## 4. `@layer base`

Valores por defecto de elementos HTML y sobrescrituras de modo. Lo que es igual en todo el sitio y no varía por instancia:

```css
@layer base {
  html {
    font-family: var(--font-body);
    color: var(--text-color-default);
    background-color: var(--color-surface);
  }

  /* v4 dejó los botones con cursor: default. Solo si el diseño pide pointer: */
  button:not(:disabled),
  [role="button"]:not([aria-disabled="true"]) {
    cursor: pointer;
  }
}
```

Para el `<html>` o el `<body>` también sirven clases directamente en el marcado: `<body class="bg-surface font-body text-default">`.

## 5. `@layer components`

Para HTML que no controlas: contenido que llega de un CMS o de Markdown, o el marcado de una librería. Las utilidades pueden sobrescribir estas clases.

```css
@layer components {
  .cms-content {
    h2 {
      font-size: var(--text-heading-md);
      line-height: var(--text-heading-md--line-height);
      margin-block-start: --spacing(8);
    }
    a {
      color: var(--color-action-primary);
      text-decoration: underline;
    }
  }
}
```

Se escribe con propiedades CSS y variables del theme. En HTML estático sin plantillas, un patrón grande que se repite (una tarjeta, un botón) también puede ir aquí.

## 6. `@apply` y `@reference`

`@apply` copia utilidades dentro de una regla CSS. Se usa solo cuando las utilidades expresan algo que sería largo en CSS, sobre HTML que no controlas:

```css
@layer components {
  .third-party-select {
    @apply rounded-md border border-subtle px-3 py-2 focus-visible:focus-ring;
  }
}
```

No se usa para crear clases de componente sobre marcado propio (`.btn { @apply ... }`). Esa repetición se resuelve con un componente o una macro (sección 1).

**`@reference`**: los estilos que se compilan por separado (bloques `<style>` de Vue, Svelte o Astro, CSS Modules, estilos de componente de Angular) no ven el theme. Para usar `@apply`, `@variant` o tokens ahí, se referencia el CSS de entrada sin duplicarlo:

```css
@reference "../../styles/app.css";

.title {
  @apply text-heading-lg;
}
```

Usar `var(--text-heading-lg)` directamente evita el `@reference` y es más rápido de compilar.

## 7. CSS de terceros y capas

Tailwind v4 usa capas de cascada nativas (`theme`, `base`, `components`, `utilities`). **Cualquier CSS fuera de una capa gana a todo lo que está en capas, sin importar la especificidad.** El CSS de una librería importado sin capa anula las utilidades: `p-4` deja de funcionar sobre un componente de la librería.

La solución es meter el CSS de terceros en una capa:

```css
@import "tailwindcss";
@import "libreria/estilos.css" layer(components);
```

Si la librería ofrece una opción para emitir sus estilos en una capa propia, se usa esa opción y se declara el orden:

```css
@layer theme, base, libreria, components, utilities;
@import "tailwindcss";
```

El CSS propio del proyecto también va en una capa (`base` o `components`) o en `@utility`. CSS propio sin capa gana a las utilidades y rompe la regla de que la clase del marcado manda.

## 8. `!important`

El modificador va al final de la clase: `hidden!`, `md:p-0!`.

Se reserva para sobrescribir estilos de terceros que no se pueden mover a una capa. Si hace falta `!` para ganar a CSS propio del proyecto, el problema es de capas (sección 7), no de especificidad.
