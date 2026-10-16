import { useId } from 'react'
import { IMAGE_SIZES } from '../data/projectImages.ts'
import { getSrcSet } from '../data/responsiveImages.ts'
import { BackToProjectsLink } from './BackToProjectsLink.tsx'
import { HeroFade } from './HeroFade.tsx'
import { FlagIcon } from './icons.tsx'
import { revealOnLoad } from './revealOnLoad.ts'

type ProjectHeroProps = {
  name: string
  summary: string
  type: string
  address: string
  image: string
}

export function ProjectHero({ name, summary, type, address, image }: ProjectHeroProps) {
  const headingId = useId()
  const size = IMAGE_SIZES[image]

  return (
    <section aria-labelledby={headingId} className="relative">
      <HeroFade className="h-260 md:h-287.5 xl:h-326" />
      {/* mx-auto: centra la caja de 1440 */}
      <div className="relative mx-auto flex max-w-page flex-col gap-8 px-4 pt-24 md:gap-12.5 md:px-10 md:pt-28 xl:px-16 xl:pt-40">
        <BackToProjectsLink className="self-start md:gap-2" />

        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:gap-2">
          <div className="flex flex-col gap-8 xl:w-191.25 xl:shrink-0">
            <h1
              id={headingId}
              tabIndex={-1}
              className="font-heading text-h6 text-default focus:outline-hidden md:text-h4 xl:text-h3"
            >
              {name}
            </h1>
            <p className="text-body-regular-16 text-muted md:text-body-regular-18">{summary}</p>
          </div>

          {/* flex-wrap: si etiqueta y dirección no caben juntas, la dirección baja a su propia línea */}
          <div className="flex flex-wrap items-end gap-2 md:items-center md:gap-x-6 xl:min-w-0 xl:flex-1 xl:items-end xl:justify-end">
            {/* Borde real de 1 px: el relleno de Figma (16/24) se reduce en 1 */}
            <p className="shrink-0 rounded-lg border border-default bg-surface p-3.75 text-body-medium-14 text-default md:px-5.75 md:text-body-medium-18">
              {`${type} Development`}
            </p>
            <p className="flex min-w-0 items-center gap-1 py-4 text-body-medium-14 text-default md:text-body-medium-18">
              <FlagIcon className="shrink-0 text-subtle" />
              <span className="line-clamp-2">{address}</span>
            </p>
          </div>
        </div>

        <img
          src={image}
          srcSet={size && getSrcSet(image, size.width)}
          sizes="(min-width: 90rem) 1312px, (min-width: 55.5625rem) calc(100vw - 80px), (min-width: 48.375rem) 809px, (min-width: 31.125rem) calc(100vw - 32px), 466px"
          alt=""
          width={size?.width}
          height={size?.height}
          fetchPriority="high"
          ref={revealOnLoad}
          className="h-65 w-full rounded-lg object-cover md:h-112.75 md:rounded-2xl xl:h-173.25"
        />
      </div>
    </section>
  )
}
