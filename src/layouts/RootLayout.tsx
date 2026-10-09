import { Link, Outlet } from 'react-router'
import { RouteFocus } from '../routing/RouteFocus.tsx'

// Temporal: enlaces de prueba hasta que se construya la navegación real
const TEST_LINKS = [
  '/',
  '/projects',
  '/projects/the-grand-estate',
  '/contact',
  '/case-study',
  '/#about',
  '/#faq',
  '/projects#search',
  '/contact#form',
  '/contact#office',
  '/projects?type=residential',
  '/projects/no-existe',
  '/no-existe',
]

// Estilo provisional de los enlaces de salto: se alinea con el botón del diseño en la tarea de navegación
const SKIP_LINK_CLASSES =
  'fixed top-4 inset-s-4 z-50 rounded-lg bg-accent px-4 py-2 text-body-medium-16 text-gray-13 not-focus:sr-only focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-4'

function RootLayout() {
  return (
    <>
      <RouteFocus />
      <a href="#main-content" className={SKIP_LINK_CLASSES}>
        Skip to main content
      </a>
      <a href="#footer" className={SKIP_LINK_CLASSES}>
        Skip to footer
      </a>

      {/* Cabecera temporal: la sustituye el menú real */}
      <header>
        <nav aria-label="Test links">
          <ul className="flex flex-wrap gap-4 p-4">
            {TEST_LINKS.map((to) => (
              <li key={to}>
                <Link to={to} className="underline">
                  {to}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="focus:outline-hidden">
        <Outlet />
      </main>

      {/* Pie temporal: lo sustituye el pie real */}
      <footer id="footer" tabIndex={-1} className="p-4 focus:outline-hidden">
        <p>Temporary footer.</p>
      </footer>
    </>
  )
}

export default RootLayout
