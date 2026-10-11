import { useRef, useState } from 'react'
import { CtaSection } from '../components/CtaSection.tsx'
import { ProjectResults } from '../components/ProjectResults.tsx'
import { ProjectsHero } from '../components/ProjectsHero.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function ProjectsPage() {
  usePageTitle('Projects – Pinnacle')
  const resultsRef = useRef<HTMLElement>(null)
  const [announcedSearch, setAnnouncedSearch] = useState<string | null>(null)

  // Cada envío del formulario baja a los resultados sin mover el foco y deja que se anuncie su número
  function handleSearch(search: string) {
    setAnnouncedSearch(search)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resultsRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'instant' : 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      <ProjectsHero onSearch={handleSearch} />
      <ProjectResults ref={resultsRef} announcedSearch={announcedSearch} />
      <CtaSection />
    </>
  )
}

export default ProjectsPage
