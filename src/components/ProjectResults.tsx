import { useId, useRef, useState, type Ref } from 'react'
import { flushSync } from 'react-dom'
import { Link, useLocation, useNavigationType, useSearchParams } from 'react-router'
import titleIconUrl from '../assets/featured-title-icon.svg'
import projects from '../data/projects.json'
import { matchesSearch, readSearchValues } from '../data/projectFilters.ts'
import { ProjectCard } from './ProjectCard.tsx'

type Project = (typeof projects)[number]

// Tarjetas visibles hasta pulsar «See More»: 4 por debajo de xl y 6 desde xl
const COLLAPSED_COUNT = 4
const COLLAPSED_COUNT_XL = 6

const PARAGRAPH_CLASSES = 'text-body-regular-16 text-muted md:text-body-regular-18'

// Plegada, cada tarjeta se oculta con CSS según su posición; el ancho no se lee con JavaScript
function getCollapsedClasses(index: number) {
  if (index >= COLLAPSED_COUNT_XL) return 'hidden'
  if (index >= COLLAPSED_COUNT) return 'hidden xl:block'
  return undefined
}

function ProjectGrid({ results }: { results: Project[] }) {
  const listRef = useRef<HTMLUListElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  function handleSeeMore() {
    // Primera tarjeta oculta en este momento (la quinta por debajo de xl, la séptima desde xl):
    // se lee del estilo calculado antes de desplegar
    const items = Array.from(listRef.current?.children ?? [])
    const firstHidden = items.find((item) => getComputedStyle(item).display === 'none')
    // Se pinta antes de mover el foco: el título tiene que estar visible
    flushSync(() => setIsExpanded(true))
    firstHidden?.querySelector<HTMLElement>('h2')?.focus()
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
            className={isExpanded ? undefined : getCollapsedClasses(index)}
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
          // Desde xl solo existe si quedan tarjetas ocultas en ese ancho
          className={`relative self-center rounded-lg border border-default bg-surface px-5.75 py-3.75 text-body-medium-18 text-default hover:bg-surface-raised ${results.length > COLLAPSED_COUNT_XL ? '' : 'xl:hidden'}`}
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
          to="/projects#search"
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
