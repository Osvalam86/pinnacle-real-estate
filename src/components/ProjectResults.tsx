import { useId, useRef, useState, type Ref } from 'react'
import { flushSync } from 'react-dom'
import { Link, useLocation, useNavigationType, useSearchParams } from 'react-router'
import titleIconUrl from '../assets/featured-title-icon.svg'
import projects from '../data/projects.json'
import { matchesSearch, readSearchValues } from '../data/projectFilters.ts'
import { ProjectCard } from './ProjectCard.tsx'

type Project = (typeof projects)[number]

// Por debajo de xl se ven como máximo 4 tarjetas hasta pulsar «See More»
const COLLAPSED_COUNT = 4

const PARAGRAPH_CLASSES = 'text-body-regular-16 text-muted md:text-body-regular-18'

function ProjectGrid({ results }: { results: Project[] }) {
  const listRef = useRef<HTMLUListElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  function handleSeeMore() {
    // Se pinta antes de mover el foco: el título de la quinta tarjeta tiene que estar visible
    flushSync(() => setIsExpanded(true))
    listRef.current?.children[COLLAPSED_COUNT]?.querySelector<HTMLElement>('h2')?.focus()
  }

  return (
    <>
      <ul
        ref={listRef}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-y-8 xl:grid-cols-3"
      >
        {results.map((project, index) => (
          <li
            key={project.slug}
            className={!isExpanded && index >= COLLAPSED_COUNT ? 'hidden xl:block' : undefined}
          >
            <ProjectCard
              name={project.name}
              description={project.description}
              location={project.location}
              tag={project.tag}
              image={project.image}
              slug={project.slug}
              headingLevel="h2"
            />
          </li>
        ))}
      </ul>
      {!isExpanded && results.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={handleSeeMore}
          className="relative self-center rounded-lg border border-default bg-surface px-5.75 py-3.75 text-body-medium-18 text-default hover:bg-surface-raised xl:hidden"
        >
          See More
        </button>
      )}
    </>
  )
}

type ProjectResultsProps = {
  ref: Ref<HTMLElement>
  /** Búsqueda hecha con el formulario cuyo número de resultados se anuncia; null si no hubo ninguna */
  announcedSearch: string | null
}

export function ProjectResults({ ref, announcedSearch }: ProjectResultsProps) {
  const headingId = useId()
  const { search } = useLocation()
  const navigationType = useNavigationType()
  const [searchParams] = useSearchParams()
  const values = readSearchValues(searchParams)
  const results = projects.filter((project) => matchesSearch(project, values))
  const count = results.length

  return (
    <section
      ref={ref}
      aria-labelledby={headingId}
      className="mx-auto flex max-w-page flex-col gap-10.5 px-4 py-22 md:px-10 md:py-26 xl:px-16 xl:py-32"
    >
      <div className="flex flex-col gap-8 xl:w-199">
        <div className="flex items-center gap-2 md:gap-6">
          <img
            src={titleIconUrl}
            alt=""
            width="38"
            height="38"
            className="size-6 shrink-0 md:size-9.5"
          />
          <h1
            id={headingId}
            data-route-focus="main"
            className="font-heading text-extra-30 text-default md:text-h5 xl:text-h4"
          >
            Our Exceptional Projects
          </h1>
        </div>
        <p className={PARAGRAPH_CLASSES}>
          Explore our portfolio to see the breadth and quality of our work, and get inspired to start
          your own dream project.
        </p>
      </div>

      {/* Un solo aviso, siempre en el DOM y siempre el mismo nodo. Sin resultados, el aviso es el
          mensaje visible; con resultados va fuera del flujo (sr-only, sin gap) y el número solo se
          anuncia tras una búsqueda del formulario */}
      <div role="status" className={count === 0 ? 'flex flex-col gap-2' : 'sr-only'}>
        {count === 0 ? (
          <>
            <p className="font-heading text-body-medium-24 text-default">
              No projects match your search.
            </p>
            <p className={PARAGRAPH_CLASSES}>Try a different name or remove a filter.</p>
          </>
        ) : (
          // Atrás y adelante no anuncian aunque la URL coincida con la última búsqueda
          announcedSearch === search &&
          navigationType !== 'POP' &&
          (count === 1 ? '1 project found' : `${count} projects found`)
        )}
      </div>

      {count === 0 ? (
        <Link
          to="/projects"
          className="relative self-start rounded-lg border border-default bg-surface px-5.75 py-3.75 text-body-medium-16 text-default hover:bg-surface-raised"
        >
          Clear filters
        </Link>
      ) : (
        // La clave pliega la lista de nuevo con cada cambio de parámetros
        <ProjectGrid key={search} results={results} />
      )}
    </section>
  )
}
