export type NewsArticle = {
  tag: string
  title: string
  /** Fecha en ISO para <time dateTime> */
  publishedAt: string
  /** Fecha tal como se muestra */
  dateLabel: string
  image: string
}

export const newsArticles: NewsArticle[] = [
  {
    tag: 'Home Improvement',
    title: "5 Ways to Increase Your Home's Value",
    publishedAt: '2022-05-10',
    dateLabel: 'May 10, 2022',
    image: '/images/shared/card-default.webp',
  },
  {
    tag: 'Planning',
    title: 'How to Plan Your Dream Home',
    publishedAt: '2023-01-15',
    dateLabel: 'Jan 15, 2023',
    image: '/images/shared/card-default.webp',
  },
  {
    tag: 'Smart Tech',
    title: 'The Future of Smart Homes',
    publishedAt: '2022-05-10',
    dateLabel: 'May 10, 2022',
    image: '/images/shared/card-default.webp',
  },
]
