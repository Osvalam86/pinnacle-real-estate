import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { isSearchFormNavigation } from './navigationState.ts'

// Ids cuyo elemento recibe el foco él mismo, en lugar de su primer encabezado
const SELF_FOCUS_IDS = new Set(['main-content', 'footer', 'search'])

function findHashTarget(hash: string) {
  if (!hash) return null
  return document.getElementById(decodeURIComponent(hash.slice(1)))
}

function focusWithoutScroll(element: HTMLElement | null) {
  element?.focus({ preventScroll: true })
}

// Desplazamiento y foco después de cada navegación, salvo las del buscador y atrás/adelante entre parámetros
export function RouteFocus() {
  const { pathname, search, hash, key, state } = useLocation()
  const fromSearchForm = isSearchFormNavigation(state)
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

    // El buscador de Projects cambia la URL sin mover foco ni desplazamiento; la marca no cuenta
    // si cambia la ruta (por ejemplo, al volver con atrás desde un proyecto)
    if (fromSearchForm && !pathnameChanged) return

    // Atrás y adelante entre parámetros no mueven nada; un enlace que solo cambia parámetros
    // se trata como un enlace a la página actual
    if (
      !pathnameChanged &&
      previous.hash === hash &&
      previous.search !== search &&
      navigationType === 'POP'
    )
      return

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
    // Una página cuyo h1 no está al inicio lo declara con data-route-focus="main": el foco va al inicio del contenido
    const heading = document.querySelector<HTMLElement>('h1')
    focusWithoutScroll(
      heading?.dataset.routeFocus === 'main' ? document.getElementById('main-content') : heading,
    )
  }, [pathname, search, hash, key, navigationType, fromSearchForm])

  return null
}
