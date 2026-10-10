import { CtaSection } from '../components/CtaSection.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function ProjectsPage() {
  usePageTitle('Projects – Pinnacle')

  return (
    <>
      <h1 tabIndex={-1} className="p-4 focus:outline-hidden">
        Our Exceptional Projects
      </h1>

      {/* Sección temporal para probar las anclas: la sustituye la búsqueda real */}
      <section id="search" aria-labelledby="search-heading" className="min-h-dvh p-4">
        <h2 id="search-heading" tabIndex={-1} className="focus:outline-hidden">
          Search
        </h2>
      </section>

      <CtaSection />
    </>
  )
}

export default ProjectsPage
