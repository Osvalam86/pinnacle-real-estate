// Pinta la foto de una vez al terminar de cargar en lugar de por franjas mientras llega. El rAF descubre la
// imagen que se completa entre el montaje y el primer fotograma (caché de disco)
export function revealOnLoad(img: HTMLImageElement | null) {
  if (!img || img.complete) return

  const reveal = () => {
    img.style.removeProperty('opacity')
    cleanup()
  }
  const cleanup = () => {
    img.removeEventListener('load', reveal)
    img.removeEventListener('error', reveal)
    cancelAnimationFrame(frame)
  }
  img.style.opacity = '0'
  img.addEventListener('load', reveal)
  img.addEventListener('error', reveal)
  const frame = requestAnimationFrame(() => {
    if (img.complete) reveal()
  })

  return cleanup
}
