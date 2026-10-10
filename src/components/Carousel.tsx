import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowIcon } from './icons.tsx'

type CarouselProps<T> = {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  /** Ancho de cada elemento en cada breakpoint */
  itemClassName: string
  previousLabel: string
  nextLabel: string
  getStatusText: (position: number, total: number) => string
  className?: string
}

const ARROW_CLASSES =
  'flex size-11 items-center justify-center rounded-md border border-default bg-surface text-default not-aria-disabled:hover:bg-surface-raised aria-disabled:bg-transparent aria-disabled:text-subtle'

// Inicio del contenido visible: borde del carril más su scroll-padding
function getContentStart(list: HTMLElement) {
  return list.getBoundingClientRect().left + parseFloat(getComputedStyle(list).scrollPaddingLeft)
}

// Primera tarjeta cuyo inicio está alineado o a la derecha del inicio del contenido
function getCurrentIndex(list: HTMLElement) {
  const start = getContentStart(list)
  const items = Array.from(list.children)
  // 1 px de margen por los anchos fraccionarios (426,67 a 1440)
  const index = items.findIndex((item) => item.getBoundingClientRect().left >= start - 1)
  return index === -1 ? items.length - 1 : index
}

// Lleva el inicio de la tarjeta al inicio del contenido; el navegador limita al final del carril
function scrollToItem(list: HTMLElement, targetIndex: number) {
  const item = list.children[targetIndex]
  if (!item) return
  // Sin behavior: el suave lo pone motion-safe:scroll-smooth en el carril
  list.scrollTo({
    left: list.scrollLeft + item.getBoundingClientRect().left - getContentStart(list),
  })
}

function formatNumber(value: number) {
  return String(value).padStart(2, '0')
}

export function Carousel<T>({
  items,
  getKey,
  renderItem,
  itemClassName,
  previousLabel,
  nextLabel,
  getStatusText,
  className = '',
}: CarouselProps<T>) {
  const listRef = useRef<HTMLUListElement>(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(true)
  const [status, setStatus] = useState('')
  const total = items.length

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    let frame = 0

    function measure(announce: boolean) {
      if (!list) return
      const nextIndex = getCurrentIndex(list)
      const maxScroll = list.scrollWidth - list.clientWidth
      setIsAtStart(list.scrollLeft <= 1)
      setIsAtEnd(list.scrollLeft >= maxScroll - 1)
      setIndex(nextIndex)
      // El aviso solo cambia cuando cambia la posición, nunca en la carga
      if (announce && nextIndex !== indexRef.current) {
        setStatus(getStatusText(nextIndex + 1, total))
      }
      indexRef.current = nextIndex
    }

    function handleScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => measure(true))
    }

    // Foco por teclado en una tarjeta que no cabe entera: el navegador no desplaza si ya asoma
    function handleFocusIn(event: FocusEvent) {
      if (!list) return
      const target = event.target as Element
      if (!target.matches(':focus-visible')) return
      const items = Array.from(list.children)
      const targetIndex = items.findIndex((item) => item.contains(target))
      if (targetIndex === -1) return
      const listBox = list.getBoundingClientRect()
      const itemBox = items[targetIndex].getBoundingClientRect()
      // 1 px de margen por los anchos fraccionarios
      if (itemBox.left >= listBox.left - 1 && itemBox.right <= listBox.right + 1) return
      scrollToItem(list, targetIndex)
    }

    // El observador mide también al empezar, sin anunciar
    const observer = new ResizeObserver(() => measure(false))
    observer.observe(list)
    list.addEventListener('scroll', handleScroll, { passive: true })
    list.addEventListener('focusin', handleFocusIn)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      list.removeEventListener('scroll', handleScroll)
      list.removeEventListener('focusin', handleFocusIn)
    }
  }, [getStatusText, total])

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {/* El carril llega a los bordes de la ventana hasta xl: márgenes negativos iguales al relleno de la sección */}
      <ul
        ref={listRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 items-start gap-4 overflow-x-auto px-4 [scrollbar-width:none] motion-safe:scroll-smooth md:-mx-10 md:scroll-px-10 md:px-10 xl:mx-0 xl:scroll-px-0 xl:px-0"
      >
        {items.map((item) => (
          <li key={getKey(item)} className={`max-w-full shrink-0 snap-start ${itemClassName}`}>
            {renderItem(item)}
          </li>
        ))}
      </ul>

      <div className="flex h-11 items-center justify-between">
        <p aria-hidden="true" className="text-body-medium-16 text-default">
          {formatNumber(index + 1)}
          <span className="text-subtle">/{formatNumber(total)}</span>
        </p>
        <div role="status" className="sr-only">
          {status}
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            aria-label={previousLabel}
            aria-disabled={isAtStart}
            onClick={() => {
              if (!isAtStart && listRef.current) scrollToItem(listRef.current, Math.max(index - 1, 0))
            }}
            className={ARROW_CLASSES}
          >
            <ArrowIcon className="rotate-180" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            aria-disabled={isAtEnd}
            onClick={() => {
              if (!isAtEnd && listRef.current) scrollToItem(listRef.current, Math.min(index + 1, total - 1))
            }}
            className={ARROW_CLASSES}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
