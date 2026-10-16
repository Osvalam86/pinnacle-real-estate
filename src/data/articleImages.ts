// Fotos del artículo por proyecto y por id de sección. Solo The Grand Estate tiene fotos en el diseño.

type ArticleImage = {
  src: string
  alt: string
  /** Medidas reales del archivo */
  width: number
  height: number
  /** false si la foto no tiene variantes por ancho: se sirve solo el original */
  variants?: false
}

export type ArticleImageGroup = {
  /** single: una foto · pair-fixed: la primera de ancho fijo y la segunda ocupa el resto · pair-equal: a partes iguales */
  layout: 'single' | 'pair-fixed' | 'pair-equal'
  images: ArticleImage[]
}

const GRAND_ESTATE = '/images/projects/the-grand-estate'

export const ARTICLE_IMAGES: Record<string, Record<string, ArticleImageGroup>> = {
  'the-grand-estate': {
    planning: {
      layout: 'single',
      images: [
        {
          src: `${GRAND_ESTATE}/01.webp`,
          alt: 'Top-down cutaway of a furnished home, with its rooms laid out around a garden',
          width: 1715,
          height: 965,
        },
      ],
    },
    design: {
      layout: 'pair-fixed',
      images: [
        {
          src: `${GRAND_ESTATE}/02.webp`,
          alt: 'Living room with red sofas, a chandelier and tall windows onto the garden',
          width: 1715,
          height: 965,
        },
        {
          src: `${GRAND_ESTATE}/03.webp`,
          alt: 'Double-height sitting room with red armchairs and a crystal chandelier',
          width: 724,
          height: 965,
          variants: false,
        },
      ],
    },
    amenities: {
      layout: 'pair-equal',
      images: [
        {
          src: `${GRAND_ESTATE}/04.webp`,
          alt: 'Private movie theater with rows of red reclining seats facing two screens',
          width: 1715,
          height: 965,
        },
        {
          src: `${GRAND_ESTATE}/05.webp`,
          alt: 'Movie theater with red reclining seats in front of a large screen',
          width: 1715,
          height: 965,
        },
      ],
    },
    community: {
      layout: 'single',
      images: [
        {
          src: `${GRAND_ESTATE}/06.webp`,
          alt: 'Open lounge with green sofas and wooden tables beside a wall of windows',
          width: 1715,
          height: 965,
        },
      ],
    },
  },
}
