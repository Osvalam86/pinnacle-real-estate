# Instalación y CSS de entrada

## Contenido

1. Requisitos
2. Instalación por tecnología
3. CSS de entrada base
4. Detección de clases
5. Herramientas del editor

---

## 1. Requisitos

- Node 20 o superior.
- Navegadores: Safari 16.4+, Chrome 111+, Firefox 128+. Tailwind v4 depende de `@property`, `color-mix()` y capas de cascada. Si el proyecto debe soportar navegadores anteriores, Tailwind v4 no es opción: avisa antes de instalar.
- El CSS de entrada es `.css`. Tailwind v4 no es compatible con Sass, Less ni Stylus: un proyecto con `styles.scss` necesita un archivo `.css` para Tailwind.

## 2. Instalación por tecnología

Antes de instalar, confirma con el usuario. Usa el gestor de paquetes que ya tiene el proyecto (npm, pnpm, yarn, bun): el archivo de bloqueo lo indica.

### Vite (React, Vue, Svelte, HTML con Vite)

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

CSS de entrada en `src/styles/app.css`, importado desde el punto de entrada (`src/main.tsx`, `src/main.ts`).

### Next.js

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

CSS de entrada en el archivo global que ya tenga el proyecto (normalmente `app/globals.css`), importado en `app/layout.tsx`. Las fuentes de `next/font` se conectan al theme con `@theme inline` (ver `theme.md`, sección 6).

### Angular

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

```json
// .postcssrc.json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

CSS de entrada en `src/styles.css`. Si el proyecto usa `styles.scss`, se crea `src/styles.css` para Tailwind y se agrega a `styles` en `angular.json`.

Los estilos de cada componente se compilan por separado: para usar `@apply` o `@variant` ahí, el archivo empieza con `@reference` (ver `css-propio.md`, sección 6). Lo recomendado es poner las clases en la plantilla.

### Nunjucks, Eleventy, HTML estático y cualquier proyecto sin bundler

```bash
npm install tailwindcss @tailwindcss/cli
```

```json
// package.json
{
  "scripts": {
    "css:dev": "tailwindcss -i ./src/styles/app.css -o ./dist/css/app.css --watch",
    "css:build": "tailwindcss -i ./src/styles/app.css -o ./dist/css/app.css --minify"
  }
}
```

El HTML enlaza el archivo compilado: `<link rel="stylesheet" href="/css/app.css">`. Los archivos `.njk`, `.html` y similares se detectan solos.

### Webpack

```bash
npm install tailwindcss @tailwindcss/webpack css-loader mini-css-extract-plugin
```

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', '@tailwindcss/webpack'],
      },
    ],
  },
};
```

### Otros (PostCSS genérico)

Igual que Next.js: `@tailwindcss/postcss` en la configuración de PostCSS. `postcss-import` y `autoprefixer` sobran: Tailwind ya resuelve imports y prefijos.

## 3. CSS de entrada base

Punto de partida para un proyecto nuevo. Ajusta el reset según la regla de `theme.md`, sección 3, y llena los tokens con los valores del diseño. No dejes valores de ejemplo.

```css
/* src/styles/app.css */
@import "tailwindcss";
@import "./theme.css";
@import "./base.css";
@import "./utilities.css";
```

```css
/* src/styles/theme.css */
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-black: #000;
  /* primitivos y semánticos del diseño */

  --font-body: /* familia del diseño */;

  /* --text-*: initial;  solo si el diseño trae escala tipográfica */
  /* --breakpoint-*: initial;  solo si el diseño trae sus breakpoints */
}
```

```css
/* src/styles/base.css */
@layer base {
  html {
    font-family: var(--font-body);
  }
}
```

```css
/* src/styles/utilities.css */
/* @utility y @custom-variant del proyecto */
```

Un proyecto pequeño puede tener todo en `app.css`. Se separa cuando el theme crece.

**Prefijo.** Si Tailwind convive con otro framework de CSS (Bootstrap, estilos heredados) y hay riesgo de choque de nombres: `@import "tailwindcss" prefix(tw);`. Las clases se escriben `tw:flex tw:md:p-4` y el theme se declara sin prefijo.

## 4. Detección de clases

Tailwind lee todos los archivos del proyecto como texto y genera CSS para lo que reconoce. Ignora lo que está en `.gitignore`, `node_modules`, binarios y archivos CSS.

| Necesidad | Solución |
|---|---|
| Una librería en `node_modules` que trae clases de Tailwind | `@source "../node_modules/@empresa/ui";` |
| Excluir una carpeta | `@source not "../src/legacy";` |
| Fijar la raíz de búsqueda (monorepos) | `@import "tailwindcss" source("../src");` |
| Clases que solo llegan en ejecución (desde una API o un CMS) | `@source inline("bg-surface text-default");`, con llaves para rangos: `@source inline("{hover:,}bg-blue-{500,600}");` |

Las rutas de `@source` son relativas al archivo CSS.

## 5. Herramientas del editor

No se instalan como parte de la tarea, pero si el proyecto las tiene se respetan:

- **Tailwind CSS IntelliSense** (extensión de VS Code): autocompleta clases y tokens del theme y marca conflictos.
- **`prettier-plugin-tailwindcss`**: ordena las clases. Si existe, su orden manda sobre el de la skill.
