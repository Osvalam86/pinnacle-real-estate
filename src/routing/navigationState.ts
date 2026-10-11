// Marca de las navegaciones hechas por el buscador de Projects: RouteFocus no mueve foco ni desplazamiento
export const SEARCH_FORM_STATE = { fromSearchForm: true } as const

export function isSearchFormNavigation(state: unknown) {
  return (
    typeof state === 'object' &&
    state !== null &&
    (state as { fromSearchForm?: unknown }).fromSearchForm === true
  )
}
