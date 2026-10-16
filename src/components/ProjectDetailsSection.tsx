import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { useLocation } from 'react-router'
import { ARTICLE_IMAGES, type ArticleImageGroup } from '../data/articleImages.ts'
import { readingMinutes, type ProjectArticle } from '../data/readingTime.ts'
import { getSrcSet } from '../data/responsiveImages.ts'
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

const AMENITIES_SIZES =
  '(min-width: 90rem) 486px, (min-width: 66.1875rem) calc(50vw - 44px), (min-width: 48.375rem) 486px, calc(100vw - 32px)'

// sizes de cada foto por sección y posición; la que no tiene variantes por ancho no lo lleva
const SIZES_BY_SECTION: Record<string, string[]> = {
  planning: [
    '(min-width: 90rem) 765px, (min-width: 52.8125rem) calc(100vw - 80px), (min-width: 48.375rem) 765px, (min-width: 23.375rem) calc(100vw - 32px), 342px',
  ],
  design: ['(min-width: 48.375rem) 486px, (min-width: 22.5625rem) calc(100vw - 32px), 329px'],
  amenities: [AMENITIES_SIZES, AMENITIES_SIZES],
  community: [
    '(min-width: 90rem) 765px, (min-width: 48.5625rem) calc(100vw - 80px), (min-width: 48.375rem) 697px, (min-width: 22.5625rem) calc(100vw - 32px), 329px',
  ],
}

// Ancho de cada foto dentro de su grupo desde 774; por debajo, columna a todo el ancho
const LAYOUT_WIDTHS: Record<ArticleImageGroup['layout'], string[]> = {
  single: [''],
  'pair-fixed': ['md:w-121.5 md:shrink-0', 'md:min-w-0 md:flex-1'],
  'pair-equal': ['md:min-w-0 md:flex-1', 'md:min-w-0 md:flex-1'],
}

const SHARE_ICON_CLASSES = 'size-4.5 shrink-0 md:size-6'
const SHARE_CONTROL_CLASSES = 'flex text-subtle hover:text-default'
const COPY_MESSAGE_MS = 3000

// Progreso de lectura del artículo (0–1), escrito por ref en el relleno de la barra: sin estado por fotograma.
// Solo desde 774, donde se ve la barra
function useReadingProgress(
  articleRef: RefObject<HTMLElement | null>,
  fillRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const article = articleRef.current
    const fill = fillRef.current
    if (!article || !fill) return

    const media = window.matchMedia('(width >= 48.375rem)')
    const observer = new ResizeObserver(schedule)
    let frame = 0

    function update() {
      frame = 0
      const rect = article!.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const range = rect.height - viewportHeight
      // Si el artículo cabe entero, la barra se llena cuando su final entra en la ventana
      const progress =
        range > 0
          ? Math.min(Math.max(-rect.top / range, 0), 1)
          : rect.bottom <= viewportHeight
            ? 1
            : 0
      // translate y no transform: sustituye al -translate-x-full de la clase en lugar de sumarse
      fill!.style.translate = `${(progress - 1) * 100}%`
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    function start() {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      observer.observe(article!)
      schedule()
    }

    function stop() {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      cancelAnimationFrame(frame)
      frame = 0
    }

    function sync() {
      if (media.matches) start()
      else stop()
    }

    sync()
    media.addEventListener('change', sync)
    return () => {
      media.removeEventListener('change', sync)
      stop()
    }
  }, [articleRef, fillRef])
}

function ProjectShare({ title }: { title: string }) {
  const shareId = useId()
  const { pathname } = useLocation()
  const [copyMessage, setCopyMessage] = useState('')
  const timerRef = useRef(0)
  const url = window.location.origin + pathname
  const canShare = 'share' in navigator
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const mailtoHref = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function showCopyMessage(message: string) {
    setCopyMessage(message)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setCopyMessage(''), COPY_MESSAGE_MS)
  }

  function copyLink() {
    // Dentro de la promesa, también un navigator.clipboard ausente (contexto no seguro) o un fallo síncrono acaban en el aviso de error
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(url))
      .then(
        () => showCopyMessage('Link copied'),
        () => showCopyMessage("Couldn't copy the link"),
      )
  }

  function shareNatively() {
    navigator.share({ title, url }).catch((error: unknown) => {
      // Cerrar el panel de compartir no es un error; cualquier otro fallo abre el correo de respaldo
      if (!(error instanceof DOMException && error.name === 'AbortError')) window.location.assign(mailtoHref)
    })
  }

  const socialLinks = [
    {
      label: 'Share on Facebook (opens in a new tab)',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: ShareFacebookIcon,
    },
    {
      label: 'Share on X (opens in a new tab)',
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: ShareXIcon,
    },
    {
      label: 'Share on LinkedIn (opens in a new tab)',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: ShareLinkedInIcon,
    },
  ]

  return (
    // Borde real de 1 px: el relleno de Figma (15/16/16/16) se reduce en 1
    <div className="flex items-center gap-8 rounded-lg border border-default bg-surface px-3.75 pt-3.5 pb-3.75 md:gap-4 xl:gap-10">
      {/* #FFFFFF de 774 a 1439, como en Figma */}
      <p
        id={shareId}
        className="font-heading text-heading-medium-20 text-default md:text-body-medium-24 md:text-gray-1 xl:text-default"
      >
        Share
      </p>
      {/* Cada control mide lo mismo que su icono, sin relleno, para no mover el reparto */}
      <ul aria-labelledby={shareId} className="flex flex-1 items-center justify-between gap-4 text-subtle">
        <li className="relative flex">
          <button type="button" aria-label="Copy link" onClick={copyLink} className={SHARE_CONTROL_CLASSES}>
            <ShareLinkCoreIcon className="shrink-0 md:hidden" />
            <ShareLinkIcon className="hidden shrink-0 md:block" />
          </button>
          {/* Siempre en el DOM para que se anuncie; vacío no ocupa sitio. Sobre el icono: bottom-full
              y -translate-y-2 dejan 8 px de separación sin margen */}
          <p
            role="status"
            className="pointer-events-none absolute inset-s-1/2 bottom-full z-raised -translate-x-1/2 -translate-y-2 rounded-lg border border-default bg-surface px-2.75 py-1.75 text-body-medium-14 whitespace-nowrap text-default empty:sr-only"
          >
            {copyMessage}
          </p>
        </li>
        <li className="flex">
          {canShare ? (
            <button
              type="button"
              aria-label="Share via…"
              onClick={shareNatively}
              className={SHARE_CONTROL_CLASSES}
            >
              <ShareInboxIcon className={SHARE_ICON_CLASSES} />
            </button>
          ) : (
            <a
              href={mailtoHref}
              aria-label="Share by email"
              className={SHARE_CONTROL_CLASSES}
            >
              <ShareInboxIcon className={SHARE_ICON_CLASSES} />
            </a>
          )}
        </li>
        {socialLinks.map(({ label, href, Icon }) => (
          <li key={label} className="flex">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={SHARE_CONTROL_CLASSES}
            >
              <Icon className={SHARE_ICON_CLASSES} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

type ProjectSidebarProps = {
  article: ProjectArticle
  articleRef: RefObject<HTMLElement | null>
  title: string
}

function ProjectSidebar({ article, articleRef, title }: ProjectSidebarProps) {
  const amenitiesId = useId()
  const fillRef = useRef<HTMLDivElement>(null)
  useReadingProgress(articleRef, fillRef)
  const amenitiesSection = article.find((section) => section.id === 'amenities')
  const amenities = amenitiesSection?.list ?? []

  return (
    // Sin el recorte de Figma: cortaría el contorno de foco del botón del CTA
    <div className="flex min-w-70 flex-col gap-6 bg-page xl:w-100.75 xl:shrink-0 xl:gap-8 sticky-fits:sticky sticky-fits:top-8">
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
        <ProjectShare title={title} />

        <div className="hidden flex-col gap-2 rounded-lg py-2 md:flex">
          <p className="font-heading text-body-medium-24 text-default">
            {`${readingMinutes(article)}min Read`}
          </p>
          {/* Como en Figma, el trazo va encima del relleno: lo pinta ::after, no el borde del carril */}
          <div
            aria-hidden="true"
            className="relative h-2 overflow-clip rounded-2xl after:absolute after:inset-0 after:rounded-2xl after:border after:border-control"
          >
            {/* En alto contraste el fondo desaparece: CanvasText lo mantiene visible */}
            <div
              ref={fillRef}
              className="absolute inset-0 -translate-x-full rounded-2xl bg-accent forced-colors:bg-[CanvasText]"
            />
          </div>
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
  const sizes = SIZES_BY_SECTION[sectionId] ?? []
  const widths = LAYOUT_WIDTHS[group.layout]

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      {group.images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          srcSet={image.variants === false ? undefined : getSrcSet(image.src, image.width)}
          sizes={sizes[index]}
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
  /** Título de la página, el mismo de document.title, para compartir */
  title: string
}

export function ProjectDetailsSection({ slug, article, title }: ProjectDetailsSectionProps) {
  const articleRef = useRef<HTMLElement>(null)

  return (
    <div className="bg-page">
      {/* mx-auto: centra la caja de 1440. Desde 1440 la columna pasa a la derecha sin cambiar el orden
          del DOM: el artículo no tiene enfocables y el orden de tabulación no varía */}
      <div className="mx-auto flex max-w-page flex-col gap-16 px-4 pt-22 pb-16 md:px-10 md:pt-26 md:pb-20 xl:flex-row-reverse xl:items-start xl:justify-between xl:gap-2 xl:px-16 xl:pt-32 xl:pb-22">
        <ProjectSidebar article={article} articleRef={articleRef} title={title} />
        <article ref={articleRef} className="flex flex-col gap-8 xl:w-191.25 xl:shrink-0">
          {article.map((section) => (
            <ArticleSectionBlock key={section.id} slug={slug} section={section} />
          ))}
        </article>
      </div>
    </div>
  )
}
