import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// Ids cuyo elemento recibe el foco él mismo, en lugar de su primer encabezado
const SELF_FOCUS_IDS = new Set(['main-content', 'footer'])

function findHashTarget(hash: string) {
  if (!hash) return null
  return document.getElementById(decodeURIComponent(hash.slice(1)))
}

function focusWithoutScroll(element: HTMLElement | null) {
  element?.focus({ preventScroll: true })
}

// Desplazamiento y foco después de cada navegación. Los parámetros de búsqueda por sí solos nunca lo activan.
export function RouteFocus() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const isFirstRun = useRef(true)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const firstRun = isFirstRun.current
    const pathnameChanged = previousPathname.current !== pathname
    isFirstRun.current = false
    previousPathname.current = pathname

    const target = findHashTarget(hash)
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
      focusWithoutScroll(
        SELF_FOCUS_IDS.has(target.id)
          ? target
          : target.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6'),
      )
      return
    }

    // Un ancla cuyo id no existe se trata como un cambio de ruta
    if (!hash && (firstRun || !pathnameChanged)) return

    // Al ir atrás o adelante, el navegador restaura el desplazamiento
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    focusWithoutScroll(document.querySelector<HTMLElement>('h1'))
  }, [pathname, hash, navigationType])

  return null
}
