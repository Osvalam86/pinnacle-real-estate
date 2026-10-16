import { useId } from 'react'
import { IMAGE_SIZES } from '../data/projectImages.ts'
import { getSrcSet } from '../data/responsiveImages.ts'
import { Button } from './Button.tsx'
import { LocationIcon } from './icons.tsx'

type HeadingLevel = 'h2' | 'h3' | 'h4'

type ProjectCardProps = {
  name: string
  description: string
  location: string
  tag: string
  image: string
  slug: string
  /** sizes de la foto en el contexto donde se usa la tarjeta */
  imageSizes: string
  headingLevel: HeadingLevel
  /** Separación entre la imagen y el texto; sustituye al gap-8 por defecto */
  gapClassName?: string
}

export function ProjectCard({
  name,
  description,
  location,
  tag,
  image,
  slug,
  imageSizes,
  headingLevel: Heading,
  gapClassName = 'gap-8',
}: ProjectCardProps) {
  const titleId = useId()
  const linkId = useId()
  const size = IMAGE_SIZES[image]

  return (
    <div
      className={`flex flex-col ${gapClassName} rounded-2xl border border-default bg-page p-3.75 md:p-5.75`}
    >
      <img
        src={image}
        srcSet={size && getSrcSet(image, size.width)}
        sizes={imageSizes}
        alt=""
        width={size?.width}
        height={size?.height}
        loading="lazy"
        className="h-75 w-full rounded-2xl object-cover"
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {/* Enfocable por programa: «See More» lleva el foco al título de la primera tarjeta nueva */}
          <Heading
            id={titleId}
            tabIndex={-1}
            className="font-heading text-body-medium-24 text-default focus:outline-hidden"
          >
            {name}
          </Heading>
          <p className="line-clamp-2 text-body-regular-16 text-muted">{description}</p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="flex items-center gap-1 text-body-regular-14 text-subtle">
            <LocationIcon className="shrink-0" />
            <span className="line-clamp-2">{location}</span>
          </p>
          <p className="rounded-lg border border-default bg-surface px-3.75 py-1.75 text-body-regular-12 text-muted">
            {tag}
          </p>
        </div>
        <Button
          to={`/projects/${slug}`}
          variant="primary"
          id={linkId}
          aria-labelledby={`${linkId} ${titleId}`}
          className="text-body-bold-16"
        >
          View Property
        </Button>
      </div>
    </div>
  )
}
