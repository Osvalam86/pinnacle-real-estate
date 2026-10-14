import { useId } from 'react'
import { ARTICLE_IMAGES, type ArticleImageGroup } from '../data/articleImages.ts'
import { readingMinutes, type ProjectArticle } from '../data/readingTime.ts'
import { Button } from './Button.tsx'
import {
  ShareFacebookIcon,
  ShareInboxIcon,
  ShareLinkCoreIcon,
  ShareLinkIcon,
  ShareLinkedInIcon,
  ShareXIcon,
} from './icons.tsx'

type ArticleSection = ProjectArticle[number]

// Alto de cada foto por sección y posición (360 / desde 774)
const IMAGE_HEIGHTS: Record<string, string[]> = {
  planning: ['h-48 md:h-107.5'],
  design: ['h-46.25 md:h-68.25', 'h-51 md:h-68.25'],
  amenities: ['h-36.25 md:h-68.25', 'h-36.25 md:h-68.25'],
  community: ['h-46.25 md:h-98'],
}

// Ancho de cada foto dentro de su grupo desde 774; por debajo, columna a todo el ancho
const LAYOUT_WIDTHS: Record<ArticleImageGroup['layout'], string[]> = {
  single: [''],
  'pair-fixed': ['md:w-121.5 md:shrink-0', 'md:min-w-0 md:flex-1'],
  'pair-equal': ['md:min-w-0 md:flex-1', 'md:min-w-0 md:flex-1'],
}

const SHARE_ICON_CLASSES = 'size-4.5 shrink-0 md:size-6'

function ProjectSidebar({ article }: { article: ProjectArticle }) {
  const amenitiesId = useId()
  const amenitiesSection = article.find((section) => section.id === 'amenities')
  const amenities = amenitiesSection?.list ?? []

  return (
    // Sin el recorte de Figma: cortaría el contorno de foco del botón del CTA
    <div className="flex min-w-70 flex-col gap-6 bg-page xl:w-100.75 xl:shrink-0 xl:gap-8">
      {/* Borde real de 1 px: el relleno de Figma (24) se reduce en 1 */}
      <div className="flex flex-col gap-4 rounded-lg border border-default bg-page p-5.75">
        <p id={amenitiesId} className="font-heading text-body-medium-24 text-default">
          Amenities
        </p>
        {/* Línea de Figma: trazo de 1 px centrado en una caja de alto 0 */}
        <div className="relative after:absolute after:inset-x-0 after:top-[-0.5px] after:h-px after:bg-gray-10" />
        <ul aria-labelledby={amenitiesId} className="flex flex-col gap-4">
          {amenities.map((item) => (
            <li key={item.name} className="text-body-medium-18 text-muted md:text-body-medium-20">
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start md:gap-8 xl:grid-cols-1">
        {/* tramo 3: los iconos pasan a botones. Borde real de 1 px: el relleno de Figma (15/16/16/16) se reduce en 1 */}
        <div
          aria-hidden="true"
          className="flex items-center gap-8 rounded-lg border border-default bg-surface px-3.75 pt-3.5 pb-3.75 md:gap-4 xl:gap-10"
        >
          {/* #FFFFFF de 774 a 1439, como en Figma */}
          <p className="font-heading text-heading-medium-20 text-default md:text-body-medium-24 md:text-gray-1 xl:text-default">
            Share
          </p>
          <div className="flex flex-1 items-center justify-between gap-4 text-subtle">
            <ShareLinkCoreIcon className="shrink-0 md:hidden" />
            <ShareLinkIcon className="hidden shrink-0 md:block" />
            <ShareInboxIcon className={SHARE_ICON_CLASSES} />
            <ShareFacebookIcon className={SHARE_ICON_CLASSES} />
            <ShareXIcon className={SHARE_ICON_CLASSES} />
            <ShareLinkedInIcon className={SHARE_ICON_CLASSES} />
          </div>
        </div>

        <div className="hidden flex-col gap-2 rounded-lg py-2 md:flex">
          <p className="font-heading text-body-medium-24 text-default">
            {`${readingMinutes(article)}min Read`}
          </p>
          {/* tramo 3: relleno con el progreso de lectura */}
          <div aria-hidden="true" className="h-2 rounded-2xl border border-control" />
        </div>
      </div>

      <div className="hidden flex-col gap-4 xl:flex">
        <p className="font-heading text-body-medium-24 text-default">Have a project in mind?</p>
        <Button to="/contact" variant="primary" className="w-full text-body-medium-16">
          Schedule a free call
        </Button>
      </div>
    </div>
  )
}

function ArticleImages({ sectionId, group }: { sectionId: string; group: ArticleImageGroup }) {
  const heights = IMAGE_HEIGHTS[sectionId] ?? []
  const widths = LAYOUT_WIDTHS[group.layout]

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      {group.images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          className={`w-full rounded-lg object-cover md:rounded-2xl ${heights[index] ?? ''} ${widths[index] ?? ''}`}
        />
      ))}
    </div>
  )
}

function ArticleSectionBlock({ slug, section }: { slug: string; section: ArticleSection }) {
  const headingId = useId()
  const images = ARTICLE_IMAGES[slug]?.[section.id]

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-8">
      <h2 id={headingId} className="font-heading text-extra-25 text-default md:text-h6 xl:text-h5">
        {section.title}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-body-medium-16 text-muted md:text-body-medium-18">
          {paragraph}
        </p>
      ))}
      {section.list && (
        // Sangría de Figma: el texto empieza a 1,5 em; la viñeta queda en el hueco
        <ul className="list-disc ps-6 text-body-medium-16 text-muted md:ps-6.75 md:text-body-medium-18">
          {section.list.map((item) => (
            <li key={item.name}>{`${item.name}: ${item.text}`}</li>
          ))}
        </ul>
      )}
      {images && <ArticleImages sectionId={section.id} group={images} />}
    </section>
  )
}

type ProjectDetailsSectionProps = {
  slug: string
  article: ProjectArticle
}

export function ProjectDetailsSection({ slug, article }: ProjectDetailsSectionProps) {
  return (
    <div className="bg-page">
      {/* mx-auto: centra la caja de 1440. Desde 1440 la columna pasa a la derecha sin cambiar el orden
          del DOM: el artículo no tiene enfocables y el orden de tabulación no varía */}
      <div className="mx-auto flex max-w-page flex-col gap-16 px-4 pt-22 pb-16 md:px-10 md:pt-26 md:pb-20 xl:flex-row-reverse xl:items-start xl:justify-between xl:gap-2 xl:px-16 xl:pt-32 xl:pb-22">
        <ProjectSidebar article={article} />
        <article className="flex flex-col gap-8 xl:w-191.25 xl:shrink-0">
          {article.map((section) => (
            <ArticleSectionBlock key={section.id} slug={slug} section={section} />
          ))}
        </article>
      </div>
    </div>
  )
}
