import type projects from './projects.json'

export type ProjectArticle = (typeof projects)[number]['article']

const WORDS_PER_MINUTE = 200

// Cuenta como palabra cada fragmento entre espacios con al menos una letra o cifra: el guion suelto no cuenta
function countWords(article: ProjectArticle) {
  const texts = article.flatMap((section) => [
    section.title,
    ...section.paragraphs,
    ...(section.list ?? []).flatMap((item) => [item.name, item.text]),
  ])
  return texts
    .join(' ')
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length
}

// D17: minutos redondeados hacia arriba, mínimo 1
export function readingMinutes(article: ProjectArticle) {
  return Math.max(1, Math.ceil(countWords(article) / WORDS_PER_MINUTE))
}
