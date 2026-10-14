import { useParams } from 'react-router'
import { CtaSection } from '../components/CtaSection.tsx'
import { ProjectDetailsSection } from '../components/ProjectDetailsSection.tsx'
import { ProjectHero } from '../components/ProjectHero.tsx'
import { RelatedProjectsSection } from '../components/RelatedProjectsSection.tsx'
import projects from '../data/projects.json'
import { usePageTitle } from '../routing/usePageTitle.ts'
import NotFoundPage from './NotFoundPage.tsx'

type Project = (typeof projects)[number]

function ProjectDetailsPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  // Un slug desconocido pinta el 404 en su sitio, sin redirigir
  if (!project) return <NotFoundPage />

  // key: cada proyecto se monta de cero al pasar de un detalle a otro (sin avisos ni temporizadores del anterior)
  return <ProjectDetails key={project.slug} project={project} />
}

// Componente aparte para que el hook del título solo se ejecute con un proyecto que existe
function ProjectDetails({ project }: { project: Project }) {
  // La sección de detalle comparte este mismo título: el efecto de usePageTitle llega tarde a su pintado
  const pageTitle = `${project.name} – Pinnacle`
  usePageTitle(pageTitle)

  return (
    <>
      <ProjectHero
        name={project.name}
        summary={project.summary}
        type={project.type}
        address={project.address}
        image={project.image}
      />
      <ProjectDetailsSection slug={project.slug} article={project.article} title={pageTitle} />
      <RelatedProjectsSection slug={project.slug} />
      <CtaSection />
    </>
  )
}

export default ProjectDetailsPage
