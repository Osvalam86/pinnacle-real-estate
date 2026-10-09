import { useEffect } from 'react'

// Actualiza el texto del único elemento title, el de index.html
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
