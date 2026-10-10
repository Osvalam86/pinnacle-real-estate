import { useId } from 'react'
import { Link } from 'react-router'
import titleIconUrl from '../assets/news-title-icon.svg'
import { newsArticles, type NewsArticle } from '../data/news.ts'
import { Carousel } from './Carousel.tsx'
import { CalendarIcon } from './icons.tsx'

function NewsCard({ tag, title, publishedAt, dateLabel, image }: NewsArticle) {
  const titleId = useId()
  const linkId = useId()

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-default bg-page px-5.75 pt-5.75 pb-7.75">
      <img
        src={image}
        alt=""
        width="379"
        height="300"
        loading="lazy"
        className="h-75 w-full rounded-2xl object-cover"
      />
      <div className="flex flex-col items-start gap-4">
        <p className="rounded-lg border border-default bg-surface px-3.75 py-1.75 text-body-regular-12 text-muted">
          {tag}
        </p>
        <h3 id={titleId} className="font-heading text-body-medium-24 text-default">
          {title}
        </h3>
        <div className="flex items-center justify-between self-stretch">
          <p className="flex items-center gap-2 text-body-medium-14 text-subtle">
            <CalendarIcon className="shrink-0" />
            <time dateTime={publishedAt}>{dateLabel}</time>
          </p>
          {/* Línea dibujada dentro de la caja de 21 px para que no sume alto a la tarjeta */}
          <Link
            to="/case-study"
            id={linkId}
            aria-labelledby={`${linkId} ${titleId}`}
            className="relative text-body-medium-14 text-default after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current hover:text-gray-1"
          >
            Read More...
          </Link>
        </div>
      </div>
    </div>
  )
}

function getArticleKey(article: NewsArticle) {
  return article.title
}

function renderArticle(article: NewsArticle) {
  return <NewsCard {...article} />
}

function getStatusText(position: number, total: number) {
  return `Article ${position} of ${total}`
}

export function LatestNewsSection() {
  const headingId = useId()

  return (
    <section
      id="news"
      aria-labelledby={headingId}
      className="mx-auto flex max-w-page flex-col gap-16 px-4 py-16 md:px-10 md:py-20 xl:gap-18 xl:px-16 xl:py-22"
    >
      <div className="flex flex-col items-start gap-8 md:gap-10 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-col gap-4 xl:w-199 xl:gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <img
              src={titleIconUrl}
              alt=""
              width="38"
              height="38"
              className="size-6 shrink-0 md:size-9.5"
            />
            <h2
              id={headingId}
              tabIndex={-1}
              className="font-heading text-extra-30 text-default focus:outline-hidden md:text-h5 xl:text-h4"
            >
              Latest News
            </h2>
          </div>
          <p className="text-body-regular-16 text-muted md:text-body-regular-18">
            We've built a reputation for delivering exceptional results and exceeding our clients'
            expectations. From luxurious residential homes to state-of-the-art commercial properties,
            our team of experts is dedicated to bringing your vision to life.
          </p>
        </div>
        {/* Alto fijo de 61: el texto va recortado a la altura de mayúscula donde text-box lo admite */}
        <Link
          to="/case-study"
          className="flex h-15.25 items-center justify-center rounded-lg border border-default bg-surface px-5.75 text-body-medium-18 text-default hover:bg-surface-raised"
        >
          <span className="[text-box:trim-both_cap_alphabetic]">View all blog post</span>
        </Link>
      </div>

      <Carousel
        items={newsArticles}
        getKey={getArticleKey}
        renderItem={renderArticle}
        itemClassName="w-82 md:w-[38.09375rem] xl:w-[calc((100%-1rem)/2)]"
        previousLabel="Previous article"
        nextLabel="Next article"
        getStatusText={getStatusText}
      />
    </section>
  )
}
