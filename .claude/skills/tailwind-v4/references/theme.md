# Theme con `@theme`

## Contenido

1. `@theme` frente a `:root`
2. Namespaces y utilidades que generan
3. Reset por categoría
4. Nombres de tokens
5. Estilos de texto compuestos
6. `@theme inline` y `@theme static`
7. Modos (claro, oscuro, marca)
8. Organización en archivos
9. Usar los tokens fuera de las clases

---

## 1. `@theme` frente a `:root`

Una variable dentro de `@theme` hace dos cosas: se publica como variable CSS en `:root` y crea utilidades. `--color-surface` produce `bg-surface`, `text-surface`, `border-surface`, `fill-surface` y el resto de utilidades de color.

| Va en `@theme` | Va en `:root` (dentro de `@layer base`) |
|---|---|
| Valores que deben existir como clase: colores, tamaños de texto, radios, sombras, breakpoints. | Variables que no deben generar clases: valores internos de un componente, variables que JavaScript cambia en ejecución. |

`@theme` se escribe en el nivel superior del archivo, nunca dentro de un selector o de una media query. Las sobrescrituras por modo se hacen fuera de él (sección 7).

## 2. Namespaces y utilidades que generan

| Namespace | Genera | Ejemplo |
|---|---|---|
| `--color-*` | Todas las utilidades de color | `--color-surface` → `bg-surface`, `text-surface` |
| `--background-color-*` | Solo `bg-*` | `--background-color-raised` → `bg-raised` |
| `--text-color-*` | Solo `text-*` de color | `--text-color-default` → `text-default` |
| `--border-color-*` | Solo `border-*` de color | `--border-color-subtle` → `border-subtle` |
| `--font-*` | `font-*` (familia) | `--font-body` → `font-body` |
| `--text-*` | `text-*` (tamaño, con interlineado y más) | `--text-heading-lg` → `text-heading-lg` |
| `--font-weight-*` | `font-*` (peso) | `--font-weight-medium` → `font-medium` |
| `--tracking-*` | `tracking-*` | `--tracking-wide` → `tracking-wide` |
| `--leading-*` | `leading-*` | `--leading-tight` → `leading-tight` |
| `--spacing` | Escala de todas las utilidades de spacing y tamaño | `--spacing: 0.25rem` → `p-4` = 1rem |
| `--spacing-*` | Valor con nombre en spacing y tamaño | `--spacing-gutter` → `p-gutter`, `gap-gutter`, `w-gutter` |
| `--container-*` | `max-w-*`, `w-*`, `min-w-*` y variantes `@*:` | `--container-content` → `max-w-content`, `@content:` |
| `--breakpoint-*` | Variantes responsivas | `--breakpoint-md` → `md:`, `max-md:` |
| `--radius-*` | `rounded-*` | `--radius-card` → `rounded-card` |
| `--shadow-*` | `shadow-*` | `--shadow-card` → `shadow-card` |
| `--inset-shadow-*` | `inset-shadow-*` | |
| `--drop-shadow-*` | `drop-shadow-*` | |
| `--text-shadow-*` | `text-shadow-*` | |
| `--blur-*` | `blur-*`, `backdrop-blur-*` | |
| `--perspective-*` | `perspective-*` | |
| `--aspect-*` | `aspect-*` | `--aspect-card` → `aspect-card` |
| `--ease-*` | `ease-*` | `--ease-emphasized` → `ease-emphasized` |
| `--animate-*` | `animate-*` (con su `@keyframes` dentro de `@theme`) | |

Los tres namespaces de color por propiedad (`--background-color-*`, `--text-color-*`, `--border-color-*`) no aparecen en la tabla de la documentación oficial, pero están verificados por compilación en Tailwind 4.3. Úsalos solo en el caso de la sección 4.

Los namespaces son independientes entre sí: resetear `--font-*` no toca `--font-weight-*`, y resetear `--text-*` no toca `--text-shadow-*`.

## 3. Reset por categoría

El theme de fábrica trae paleta de colores, escala tipográfica, radios, sombras y breakpoints. Mientras exista, `bg-red-500` compila aunque ese rojo no esté en el diseño, y nadie lo nota. Al resetear una categoría, cualquier clase fuera del diseño deja de generar CSS y el script de verificación la reporta en la sección 4.

**Regla**: se resetea una categoría solo cuando el diseño la define.

```css
@theme {
  --color-*: initial;   /* el diseño trae su paleta */
  --text-*: initial;    /* el diseño trae su escala tipográfica */
  /* radios, sombras y breakpoints se quedan: el diseño no los define */

  --color-white: #fff;
  --color-black: #000;
  --color-blue-600: #2455d4;
  /* ... */
}
```

Qué sobrevive al reset, porque no viene del theme:

| Categoría reseteada | Siguen existiendo |
|---|---|
| `--color-*` | `bg-transparent`, `text-current`, `text-inherit`. Se pierden `white` y `black`: se redeclaran si se usan. |
| `--radius-*` | `rounded-none`, `rounded-full`. |
| `--shadow-*` | `shadow-none`. |
| `--text-*` | Nada de tamaño. Pesos, tracking e interlineado viven en otros namespaces. |
| `--breakpoint-*` | Solo los breakpoints que redeclares. Los de contenedor (`--container-*`) no se ven afectados. |

Casos en los que no se resetea:

- Proyecto sin diseño ni tokens (un prototipo rápido).
- Proyecto que usa una librería o plantilla que depende de la paleta de fábrica.
- Proyecto existente que ya decidió no resetear. No se cambia sin preguntar.

`--spacing` no se resetea nunca. De esa variable dependen todos los valores directos (`mt-17`, `w-4.5`). `--*: initial` (reset total) tampoco se usa: borra la escala de spacing y los pesos tipográficos junto con todo lo demás.

## 4. Nombres de tokens

- **Primitivos** con nombre descriptivo y escala: `--color-blue-600`, `--color-gray-50`.
- **Semánticos** con nombre de rol: `--color-surface`, `--color-action-primary`.
- Los semánticos referencian a los primitivos con `var()`: `--color-surface: var(--color-white);`.
- Nombres en inglés, minúsculas y con guiones, igual que las utilidades de Tailwind.

**Prefijo repetido.** Un token semántico pensado para una sola propiedad produce clases redundantes con `--color-*`: `--color-text-default` genera `text-text-default`, y también `bg-text-default`, que no tiene sentido. Para esos tokens se usa el namespace de la propiedad:

| En lugar de | Usa | Clase resultante |
|---|---|---|
| `--color-text-default` | `--text-color-default` | `text-default` |
| `--color-bg-raised` | `--background-color-raised` | `bg-raised` |
| `--color-border-subtle` | `--border-color-subtle` | `border-subtle` |

Los colores que se usan en varias propiedades (marca, estados) se quedan en `--color-*`.

**Unidades.** Tamaños, spacing y breakpoints en `rem`. Los breakpoints en una misma unidad entre sí, porque Tailwind los ordena por valor. Los píxeles quedan para bordes, radios y sombras.

**Espaciado.** La escala (`--spacing: 0.25rem`) ya cubre cualquier múltiplo de 4px, así que no se declaran tokens numéricos (`--spacing-1`, `--spacing-2`…): un `--spacing-1: 0.5rem` cambiaría el significado de `p-1` y rompería la conversión `px ÷ 4`. Solo se declaran espaciados con nombre de rol: `--spacing-gutter`, `--spacing-section`.

## 5. Estilos de texto compuestos

Un estilo de texto de Figma (tamaño, interlineado, tracking, peso) es un solo token `--text-*` con subpropiedades:

```css
@theme {
  --text-heading-lg: 2rem;
  --text-heading-lg--line-height: 1.2;
  --text-heading-lg--letter-spacing: -0.01em;
  --text-heading-lg--font-weight: 700;

  --text-body-md: 1rem;
  --text-body-md--line-height: 1.5;
}
```

`text-heading-lg` aplica las cuatro propiedades. Se puede ajustar una sin romper el resto: `text-heading-lg leading-tight`, o `text-body-md/7` para cambiar solo el interlineado.

Cuando el estilo cambia por breakpoint, el token apunta al valor móvil y se re-apunta en una media query dentro de `@layer base`. La clase es una sola (`text-heading-1`) y cambia sola:

```css
@theme {
  --text-2xl: 1.5rem;  --text-2xl--line-height: 2rem;
  --text-3xl: 2rem;    --text-3xl--line-height: 2.5rem;

  --text-heading-1: var(--text-2xl);
  --text-heading-1--line-height: var(--text-2xl--line-height);
}

@layer base {
  @media (width >= 64rem) {
    :root {
      --text-heading-1: var(--text-3xl);
      --text-heading-1--line-height: var(--text-3xl--line-height);
    }
  }
}
```

Este token no lleva `@theme inline`: inline copia el valor en la utilidad y la redefinición deja de tener efecto. Si el diseño trata las versiones como estilos distintos, cada una es su propio token y se combinan con prefijos: `text-heading-md lg:text-heading-lg`.

La tipografía fluida es opcional y solo si el diseño la pide: `--text-display: clamp(2rem, 1.5rem + 2vw, 3rem);`.

## 6. `@theme inline` y `@theme static`

**`inline`** — la utilidad usa el valor de la variable en lugar de referenciarla. Se usa cuando el token apunta a una variable que se define en otro lugar del árbol, por ejemplo una fuente cargada por `next/font` o una variable que pone JavaScript:

```css
@theme inline {
  --font-body: var(--font-inter);   /* --font-inter lo define next/font en <html> */
}
```

Sin `inline`, `var(--font-body)` se resolvería en `:root`, donde `--font-inter` todavía no existe, y la fuente caería al respaldo.

Para semánticos que apuntan a primitivos del mismo theme no hace falta `inline`.

**`static`** — Tailwind solo publica las variables que se usan en clases o en el CSS. `@theme static` las publica todas. Úsalo cuando un token se lee solo desde JavaScript o desde un `style` inline.

## 7. Modos (claro, oscuro, marca)

Solo cuando el diseño define modos. El patrón: los semánticos viven en `@theme` y cada modo los sobrescribe en un selector, dentro de `@layer base`. Las clases del marcado no cambian entre modos.

```css
@theme {
  --color-white: #fff;
  --color-gray-50: #f9fafb;
  --color-gray-900: #111827;

  --color-surface: var(--color-white);
  --text-color-default: var(--color-gray-900);
}

@layer base {
  [data-theme="dark"] {
    --color-surface: var(--color-gray-900);
    --text-color-default: var(--color-gray-50);
  }
}

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

- El selector `[data-theme="dark"]` en `<html>` permite que el usuario elija modo. Si el modo depende solo del sistema operativo, se usa `@media (prefers-color-scheme: dark)` en lugar del selector y no hace falta `@custom-variant`.
- `@custom-variant dark` solo se declara si hay excepciones que el token no resuelve, como una imagen distinta por modo (`dark:hidden`). Con semánticos bien definidos casi no se necesita.
- Agrega `scheme-light` y `scheme-dark` (o `scheme-light-dark` en `<html>`) para que los controles nativos y las barras de desplazamiento sigan el modo.
- Cada par de texto y fondo se verifica en ambos modos: 4.5:1 para texto normal y 3:1 para texto grande y componentes de interfaz.

## 8. Organización en archivos

Un theme corto puede vivir en el CSS de entrada. Cuando crece, se separa:

```
styles/
├── app.css         ← entrada: @import "tailwindcss" y el resto de imports
├── theme.css       ← @theme
├── base.css        ← @layer base: modos y valores por defecto de elementos
└── utilities.css   ← @utility y @custom-variant
```

```css
/* app.css */
@import "tailwindcss";
@import "./theme.css";
@import "./base.css";
@import "./utilities.css";
```

`theme.css` puede compartirse entre proyectos de la misma marca: se importa igual en cada uno.

## 9. Usar los tokens fuera de las clases

- **En CSS**: `var(--color-surface)`, `var(--text-body-md)`, `--spacing(4)` para un múltiplo de la escala, `--alpha(var(--color-blue-600) / 50%)` para opacidad.
- **En corchetes**: `rounded-[calc(var(--radius-xl)-1px)]`.
- **En JavaScript**: la variable CSS directamente (`'var(--color-surface)'`), o `getComputedStyle(document.documentElement).getPropertyValue('--color-surface')` si se necesita el valor resuelto.
- **En media queries**, donde no funcionan las variables: `@media (width >= theme(--breakpoint-md))`. En el marcado se usa la variante `md:`.
