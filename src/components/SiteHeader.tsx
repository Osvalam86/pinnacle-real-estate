import { useEffect, useId, useRef } from 'react'
import { Link, useMatch } from 'react-router'
import logoUrl from '../assets/logo.svg'
import projects from '../data/projects.json'
import { CloseIcon, MenuIcon } from './icons.tsx'

// Mismo valor que --breakpoint-xl: a partir de ahí el menú no existe y se cierra
const XL_QUERY = '(width >= 90rem)'

type Current = 'page' | 'true' | undefined

// El borde de 1 px va dentro de la caja, como en Figma: el relleno visible sigue siendo 24/16
const LINK_CLASSES =
  'block rounded-lg border border-transparent px-5.75 py-3.75 text-body-medium-16 text-default decoration-1 hover:underline aria-[current]:border-control aria-[current]:bg-surface aria-[current]:hover:bg-surface-raised xl:border-0 xl:p-0 xl:aria-[current]:border xl:aria-[current]:px-5.75 xl:aria-[current]:py-3.75'

const CONTACT_CLASSES =
  'block rounded-lg border border-transparent bg-surface-raised px-5.75 py-3.75 text-center text-body-medium-16 text-default inset-shadow-button hover:bg-gray-10 aria-[current=page]:border-control'

type SiteHeaderProps = {
  isMenuOpen: boolean
  onMenuOpenChange: (isOpen: boolean) => void
}

function useCurrentLinks() {
  const homeMatch = useMatch('/')
  const projectsMatch = useMatch('/projects')
  const projectMatch = useMatch('/projects/:slug')
  const contactMatch = useMatch('/contact')

  // Un slug desconocido pinta el 404: ahí Projects no se marca
  const isKnownProject =
    projectMatch !== null && projects.some((project) => project.slug === projectMatch.params.slug)

  let projectsCurrent: Current
  if (projectsMatch) projectsCurrent = 'page'
  else if (isKnownProject) projectsCurrent = 'true'

  return {
    home: homeMatch ? 'page' : undefined,
    projects: projectsCurrent,
    contact: contactMatch ? 'page' : undefined,
  } satisfies Record<string, Current>
}

export function SiteHeader({ isMenuOpen, onMenuOpenChange }: SiteHeaderProps) {
  const panelId = useId()
  const headerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const current = useCurrentLinks()

  useEffect(() => {
    if (!isMenuOpen) return

    firstLinkRef.current?.focus()

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const previousGutter = root.style.scrollbarGutter
    // Si hay barra de desplazamiento clásica, su hueco se reserva para que el contenido no salte al ocultarla
    if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = 'stable'
    root.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      onMenuOpenChange(false)
      buttonRef.current?.focus()
    }

    // composedPath y no contains: al abrir, el icono pulsado se sustituye y su nodo ya no está en el DOM
    function handleClick(event: MouseEvent) {
      if (headerRef.current && !event.composedPath().includes(headerRef.current)) onMenuOpenChange(false)
    }

    const xlQuery = window.matchMedia(XL_QUERY)
    function handleXlChange(event: MediaQueryListEvent) {
      if (event.matches) onMenuOpenChange(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClick)
    xlQuery.addEventListener('change', handleXlChange)

    return () => {
      root.style.overflow = previousOverflow
      root.style.scrollbarGutter = previousGutter
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClick)
      xlQuery.removeEventListener('change', handleXlChange)
    }
  }, [isMenuOpen, onMenuOpenChange])

  const closeMenu = () => onMenuOpenChange(false)

  const navLinks = [
    { label: 'Home', to: '/', current: current.home },
    { label: 'About Us', to: '/#about' },
    { label: 'Projects', to: '/projects', current: current.projects },
    { label: 'Services', to: '/#services' },
    { label: 'News', to: '/#news' },
  ]

  return (
    <>
      {isMenuOpen && <div className="fixed inset-0 z-backdrop bg-page/60" />}

      <header ref={headerRef} className="relative z-menu">
        {/* El fondo y el borde ocupan toda la ventana; el contenido se limita al ancho de página */}
        <div className="relative bg-page after:absolute after:inset-x-0 after:bottom-0 after:border-b after:border-default">
          <div className="mx-auto flex max-w-page items-center justify-between p-4 md:px-10 md:py-6 xl:px-16">
            <Link to="/" onClick={closeMenu} className="block shrink-0">
              <img src={logoUrl} alt="Pinnacle" width="138" height="29" className="block" />
            </Link>

            <nav aria-label="Main" className="xl:flex xl:flex-1 xl:items-center">
              <button
                ref={buttonRef}
                type="button"
                aria-label="Menu"
                aria-expanded={isMenuOpen}
                aria-controls={panelId}
                onClick={() => onMenuOpenChange(!isMenuOpen)}
                className="flex size-8 items-center justify-center text-default hover:text-gray-1 xl:hidden"
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>

              {/* A 1440 el panel es un elemento flex pegado al logo: sin fondo, para no pintar encima de su contorno de foco */}
              <div
                id={panelId}
                className={`${isMenuOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-4 border-b border-default bg-page p-4 md:px-10 md:py-6 xl:static xl:flex xl:flex-1 xl:flex-row xl:items-center xl:gap-0 xl:border-0 xl:bg-transparent xl:p-0`}
              >
                <ul className="flex flex-col gap-2 xl:mx-auto xl:flex-row xl:items-center xl:gap-7.5">
                  {navLinks.map((link, index) => (
                    <li key={link.label}>
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        to={link.to}
                        aria-current={link.current}
                        onClick={closeMenu}
                        className={LINK_CLASSES}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  aria-current={current.contact}
                  onClick={closeMenu}
                  className={CONTACT_CLASSES}
                >
                  Contact us
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
