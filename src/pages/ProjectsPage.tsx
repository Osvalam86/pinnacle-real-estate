import { CtaSection } from '../components/CtaSection.tsx'
import { ProjectsHero } from '../components/ProjectsHero.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function ProjectsPage() {
  usePageTitle('Projects – Pinnacle')

  return (
    <>
      <ProjectsHero />

      {/* h1 provisional hasta el bloque 2 de Projects. Va después del buscador:
          al entrar en la página el foco va al inicio del contenido, no al título */}
      <h1 data-route-focus="main" tabIndex={-1} className="p-4 focus:outline-hidden">
        Our Exceptional Projects
      </h1>

      <CtaSection />
    </>
  )
}

export default ProjectsPage
