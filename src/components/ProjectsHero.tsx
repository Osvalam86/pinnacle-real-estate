import { useId, useState, type ComponentType, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import projects from '../data/projects.json'
import { projectFilters, readSearchValues, type ProjectFilter } from '../data/projectFilters.ts'
import { SEARCH_FORM_STATE } from '../routing/navigationState.ts'
import { Button } from './Button.tsx'
import { HeroFade } from './HeroFade.tsx'
import { BillIcon, BoxIcon, ChevronIcon, FlagIcon } from './icons.tsx'
import { revealOnLoad } from './revealOnLoad.ts'

// Posición de cada pin respecto al mapa: izquierda en % del ancho del mapa y arriba en px.
// The Village y The Skyline no existen por debajo de md.
const PIN_POSITIONS: Record<string, string> = {
  'the-grand-estate':
    'left-[41.7683%] top-44.5 md:left-[44.0922%] md:top-54 xl:left-[1.4482%] xl:top-71',
  'the-business-hub':
    'left-[8.8415%] top-26.5 md:left-[22.0461%] md:top-34.75 xl:left-[23.7805%] xl:top-29.5',
  'the-village': 'hidden md:block md:left-[76.9452%] md:top-73.75 xl:left-[75.3811%] xl:top-92.25',
  'the-skyline': 'hidden md:block md:left-[8.6455%] md:top-72.25 xl:left-[53.2774%] xl:top-64.5',
  'the-old-mill':
    'left-[43.5976%] top-76.75 md:left-[45.9654%] md:top-100.5 xl:left-[48.0183%] xl:top-131.25',
}

const pinnedProjects = projects.filter((project) => project.slug in PIN_POSITIONS)

const FILTER_ICONS: Record<ProjectFilter['name'], ComponentType<{ className?: string }>> = {
  location: FlagIcon,
  type: BoxIcon,
  cost: BillIcon,
}

// Tamaño del icono de cada desplegable: BillIcon mide 18 en base
const FILTER_ICON_CLASSES: Record<ProjectFilter['name'], string> = {
  location: 'size-5 shrink-0',
  type: 'size-5 shrink-0',
  cost: 'size-4.5 shrink-0 md:size-5',
}

// En xl el desplegable mide lo que su opción elegida; solo Location puede encoger
const FILTER_WIDTH_CLASSES: Record<ProjectFilter['name'], string> = {
  location: 'xl:min-w-0',
  type: 'xl:shrink-0',
  cost: 'xl:shrink-0',
}

type SearchFormProps = {
  /** Se llama en cada envío, también cuando la URL no cambia, con la búsqueda resultante */
  onSearch: (search: string) => void
}

function SearchForm({ onSearch }: SearchFormProps) {
  const inputId = useId()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [values, setValues] = useState(() => readSearchValues(searchParams))
  const [syncedSearch, setSyncedSearch] = useState(location.search)

  // Los campos se releen cuando cambian los parámetros (atrás, adelante, enlace con otros filtros);
  // una navegación que no los cambia, como un enlace de salto, conserva lo escrito sin enviar
  if (location.search !== syncedSearch) {
    setSyncedSearch(location.search)
    setValues(readSearchValues(searchParams))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    const q = values.q.trim()
    if (q) params.set('q', q)
    for (const filter of projectFilters) {
      if (values[filter.name]) params.set(filter.name, values[filter.name])
    }
    setValues({ ...values, q })

    const search = params.size > 0 ? `?${params}` : ''
    onSearch(search)
    const isCurrentUrl =
      location.pathname === '/projects' && location.search === search && location.hash === ''
    // Sin cambio de URL se navega con replace: así el envío no queda como POP y el aviso lo distingue de atrás/adelante
    navigate({ pathname: '/projects', search }, { replace: isCurrentUrl, state: SEARCH_FORM_STATE })
  }

  return (
    <form
      role="search"
      aria-label="Projects"
      id="search"
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-lg bg-surface p-2 focus:outline-hidden xl:flex-row"
    >
      <div className="xl:min-w-70 xl:grow xl:basis-70">
        <label htmlFor={inputId} className="sr-only">
          Search for a property
        </label>
        <input
          id={inputId}
          type="search"
          name="q"
          placeholder="Search for a property"
          enterKeyHint="search"
          value={values.q}
          onChange={(event) => setValues({ ...values, q: event.target.value })}
          className="w-full rounded-lg border border-control bg-page px-5.75 py-3.75 text-body-medium-16 text-default placeholder:text-muted md:text-body-medium-20 [&::-webkit-search-cancel-button]:appearance-none"
        />
      </div>

      {/* En xl los desplegables pasan a ser hijos directos de la fila del formulario */}
      <div className="flex flex-col gap-2 md:flex-row xl:contents">
        {projectFilters.map((filter) => (
          <FilterSelect
            key={filter.name}
            filter={filter}
            value={values[filter.name]}
            onChange={(value) => setValues({ ...values, [filter.name]: value })}
          />
        ))}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="text-body-medium-16 md:text-body-medium-20 xl:shrink-0"
      >
        Find a property
      </Button>
    </form>
  )
}

type FilterSelectProps = {
  filter: ProjectFilter
  value: string
  onChange: (value: string) => void
}

function FilterSelect({ filter, value, onChange }: FilterSelectProps) {
  const selectId = useId()
  const Icon = FILTER_ICONS[filter.name]
  const selected = filter.options.find((option) => option.value === value)

  return (
    // La cara pinta el contorno de foco cuando el select invisible lo tiene
    <div
      className={`relative rounded-lg border border-control bg-surface p-3.75 hover:bg-surface-raised has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-focus md:flex-1 xl:flex-initial ${FILTER_WIDTH_CLASSES[filter.name]}`}
    >
      <label htmlFor={selectId} className="sr-only">
        {filter.label}
      </label>
      <span aria-hidden="true" className="flex items-center gap-2.5 text-subtle md:gap-2">
        <Icon className={FILTER_ICON_CLASSES[filter.name]} />
        {/* Entre md y xl la copia invisible del texto de reposo fija el ancho mínimo; el texto visible
            no aporta ancho (w-0 min-w-full) y se corta con puntos suspensivos */}
        <span className="grid min-w-0 flex-1 text-body-medium-16 text-muted md:text-body-medium-20">
          <span className="invisible col-start-1 row-start-1 h-0 whitespace-nowrap xl:hidden">
            {filter.label}
          </span>
          <span className="col-start-1 row-start-1 w-0 min-w-full truncate xl:w-auto xl:min-w-0">
            {selected?.label ?? filter.label}
          </span>
        </span>
        <ChevronIcon className="shrink-0" />
      </span>
      <select
        id={selectId}
        name={filter.name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 size-full cursor-pointer bg-surface text-body-medium-16 text-muted opacity-0"
      >
        <option value="">{filter.label}</option>
        {filter.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ProjectsHero({ onSearch }: SearchFormProps) {
  return (
    <div className="relative">
      <HeroFade className="h-233.25 xl:h-222.25" />
      <div className="relative mx-auto max-w-page px-4 pt-14 md:px-10 md:pt-26 xl:px-16">
        <div className="relative">
          <img
            src="/images/projects/map.webp"
            alt=""
            width="1690"
            height="1267"
            fetchPriority="high"
            ref={revealOnLoad}
            className="h-114.25 w-full rounded-2xl object-cover md:h-144.75 xl:h-168.75"
          />
          <ul aria-label="Projects on the map">
            {pinnedProjects.map((project) => (
              <li key={project.slug} className={`absolute ${PIN_POSITIONS[project.slug]}`}>
                {/* Punto de 12 px: 4 dentro de la pastilla y 8 fuera; -bottom cuenta desde dentro del borde */}
                <Link
                  to={`/projects/${project.slug}`}
                  className="relative block whitespace-nowrap rounded-lg border border-gray-6 bg-gray-5/45 p-3.75 text-body-bold-11 text-gray-13 decoration-1 backdrop-blur-md after:absolute after:-bottom-2.25 after:left-1/2 after:size-3 after:-translate-x-1/2 after:rounded-full after:bg-gray-13 after:inset-shadow-pin-dot hover:underline focus-visible:ring-2 focus-visible:ring-gray-13 forced-colors:after:bg-[CanvasText] md:px-5.75 md:text-body-bold-14 xl:text-body-bold-16"
                >
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* -mt-12: en Figma el hero es un auto layout con separación de -48 entre el mapa y el
            buscador, y gap no admite negativos. relative lo pinta por encima del mapa */}
        <div className="relative -mt-12 px-4 md:px-8 xl:px-16">
          <SearchForm onSearch={onSearch} />
        </div>
      </div>
    </div>
  )
}
