const MARK = 'data-programmatic-focus'

// Foco programático en un contenedor sin tabindex en reposo: así, un clic en su contenido no enfocable
// no lo enfoca y Tab sigue desde el punto del clic
export function focusContainer(element: HTMLElement | null) {
  if (!element) return

  if (!element.hasAttribute(MARK)) {
    const target = element

    function release() {
      target.removeAttribute('tabindex')
      target.removeAttribute(MARK)
      target.removeEventListener('blur', handleBlur)
      target.removeEventListener('pointerdown', release, { capture: true })
    }

    // Si la ventana pierde el foco, el contenedor sigue siendo el activo y debe seguir enfocable al volver
    function handleBlur() {
      if (document.activeElement !== target) release()
    }

    target.setAttribute('tabindex', '-1')
    target.setAttribute(MARK, '')
    target.addEventListener('blur', handleBlur)
    // Un clic dentro del contenedor debe comportarse como si no fuera enfocable
    target.addEventListener('pointerdown', release, { capture: true })

    target.focus({ preventScroll: true })
    // Un contenedor que no admite el foco (p. ej., inert) no se queda con el atributo puesto
    if (document.activeElement !== target) release()
    return
  }

  element.focus({ preventScroll: true })
}
