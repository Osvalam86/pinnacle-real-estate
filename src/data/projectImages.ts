// sizes de la foto de ProjectCard: en el carrusel de Featured la tarjeta es más estrecha que en las rejillas
export const CAROUSEL_CARD_SIZES = '538px'
export const GRID_CARD_SIZES =
  '(min-width: 90rem) 538px, (min-width: 79.25rem) calc(50vw - 96px), (min-width: 48.375rem) 538px, (min-width: 37.625rem) calc(100vw - 64px), 538px'

// Medidas reales de cada archivo: projects.json no las incluye y no se modifica
export const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  '/images/projects/the-grand-estate.webp': { width: 1715, height: 965 },
  '/images/projects/the-business-hub.webp': { width: 1715, height: 965 },
  '/images/projects/the-village.webp': { width: 1715, height: 965 },
  '/images/projects/the-skyline.webp': { width: 1715, height: 965 },
  '/images/projects/the-old-mill.webp': { width: 1715, height: 965 },
  '/images/projects/the-courtyard.webp': { width: 1715, height: 965 },
  '/images/projects/the-arcade.webp': { width: 1715, height: 957 },
  '/images/projects/the-workshop.webp': { width: 1715, height: 957 },
  '/images/projects/the-terraces.webp': { width: 1715, height: 957 },
}
