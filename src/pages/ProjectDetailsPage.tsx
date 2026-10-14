import { useParams } from 'react-router'
import { CtaSection } from '../components/CtaSection.tsx'
import { ProjectHero } from '../components/ProjectHero.tsx'
import projects from '../data/projects.json'
import { usePageTitle } from '../routing/usePageTitle.ts'
import NotFoundPage from './NotFoundPage.tsx'

type Project = (typeof projects)[number]

function ProjectDetailsPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  // Un slug desconocido pinta el 404 en su sitio, sin redirigir
  if (!project) return <NotFoundPage />

  return <ProjectDetails project={project} />
}

// Componente aparte para que el hook del título solo se ejecute con un proyecto que existe
function ProjectDetails({ project }: { project: Project }) {
  usePageTitle(`${project.name} – Pinnacle`)

  return (
    <>
      <ProjectHero
        name={project.name}
        summary={project.summary}
        type={project.type}
        address={project.address}
        image={project.image}
      />

      <CtaSection />
    </>
  )
}

export default ProjectDetailsPage
