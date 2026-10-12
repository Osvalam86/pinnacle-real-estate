import { useId } from 'react'
import { Link } from 'react-router'
import { LocationIcon } from './icons.tsx'

type HeadingLevel = 'h2' | 'h3' | 'h4'

type ProjectCardProps = {
  name: string
  description: string
  location: string
  tag: string
  image: string
  slug: string
  headingLevel: HeadingLevel
}

// Medidas reales de cada archivo: projects.json no las incluye y no se modifica
const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
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

export function ProjectCard({
  name,
  description,
  location,
  tag,
  image,
  slug,
  headingLevel: Heading,
}: ProjectCardProps) {
  const titleId = useId()
  const linkId = useId()
  const size = IMAGE_SIZES[image]

  return (
    <div className="flex flex-col gap-8 rounded-2xl border border-default bg-page p-3.75 md:p-5.75">
      <img
        src={image}
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
        <Link
          to={`/projects/${slug}`}
          id={linkId}
          aria-labelledby={`${linkId} ${titleId}`}
          className="rounded-lg bg-accent px-6 py-4 text-center text-body-bold-16 text-inverse inset-shadow-button-accent"
        >
          View Property
        </Link>
      </div>
    </div>
  )
}
