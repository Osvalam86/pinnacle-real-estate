const WIDTH_STEPS = [640, 960, 1280, 1920]

/**
 * srcset de una foto: sus variantes por ancho (`<nombre>-<ancho>.webp`) menores que el original y el
 * original con su ancho
 */
export function getSrcSet(src: string, width: number, steps: number[] = WIDTH_STEPS) {
  const base = src.replace(/\.webp$/, '')
  return [
    ...steps.filter((step) => step < width).map((step) => `${base}-${step}.webp ${step}w`),
    `${src} ${width}w`,
  ].join(', ')
}
