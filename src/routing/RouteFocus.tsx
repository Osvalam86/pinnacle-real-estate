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
  const { pathname, search, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const isFirstRun = useRef(true)
  const previousLocation = useRef({ pathname, search, hash })

  // key va en las dependencias porque un enlace a la URL actual navega con replace
  // y solo cambia key: así cada activación repite el desplazamiento y el foco
  useEffect(() => {
    const firstRun = isFirstRun.current
    const previous = previousLocation.current
    const pathnameChanged = previous.pathname !== pathname
    isFirstRun.current = false
    previousLocation.current = { pathname, search, hash }

    if (!pathnameChanged && previous.hash === hash && previous.search !== search) return

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

    // Un ancla cuyo id no existe, o un enlace a la ruta actual sin ancla, se trata como un cambio de ruta
    if (!hash && (firstRun || (!pathnameChanged && navigationType === 'POP'))) return

    // Al ir atrás o adelante, el navegador restaura el desplazamiento
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    focusWithoutScroll(document.querySelector<HTMLElement>('h1'))
  }, [pathname, search, hash, key, navigationType])

  return null
}
