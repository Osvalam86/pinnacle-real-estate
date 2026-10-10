import { useState } from 'react'
import { Outlet } from 'react-router'
import { SiteFooter } from '../components/SiteFooter.tsx'
import { SiteHeader } from '../components/SiteHeader.tsx'
import { RouteFocus } from '../routing/RouteFocus.tsx'

const SKIP_LINK_CLASSES =
  'fixed top-4 inset-s-4 z-skip-link rounded-lg bg-accent px-6 py-4 text-body-medium-16 text-inverse inset-shadow-button-accent not-focus:sr-only'

function RootLayout() {
  // Con el menú abierto, todo lo que no es la barra y su panel queda inerte
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <RouteFocus />
      <a href="#main-content" inert={isMenuOpen} className={SKIP_LINK_CLASSES}>
        Skip to main content
      </a>
      <a href="#footer" inert={isMenuOpen} className={SKIP_LINK_CLASSES}>
        Skip to footer
      </a>

      <SiteHeader isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />

      <main id="main-content" tabIndex={-1} inert={isMenuOpen} className="focus:outline-hidden">
        <Outlet />
      </main>

      <SiteFooter inert={isMenuOpen} />
    </>
  )
}

export default RootLayout
