import { useId } from 'react'
import titleIconUrl from '../assets/featured-title-icon.svg'
import projects from '../data/projects.json'
import { Button } from './Button.tsx'
import { Carousel } from './Carousel.tsx'
import { ProjectCard } from './ProjectCard.tsx'

type Project = (typeof projects)[number]

const featuredProjects = projects.slice(0, 3)

function getProjectKey(project: Project) {
  return project.slug
}

function renderProject(project: Project) {
  return (
    <ProjectCard
      name={project.name}
      description={project.description}
      location={project.location}
      tag={project.tag}
      image={project.image}
      slug={project.slug}
      headingLevel="h3"
    />
  )
}

function getStatusText(position: number, total: number) {
  return `Project ${position} of ${total}`
}

export function FeaturedProjectsSection() {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto flex max-w-page flex-col gap-16 px-4 pt-20 pb-16 md:px-10 md:pt-26 md:pb-20 xl:gap-18 xl:px-16 xl:pt-32 xl:pb-22"
    >
      <div className="flex flex-col items-start gap-6 md:gap-10 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-col gap-4 xl:w-199 xl:gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <img
              src={titleIconUrl}
              alt=""
              width="38"
              height="38"
              className="size-6 shrink-0 md:size-9.5"
            />
            <h2 id={headingId} className="font-heading text-extra-30 text-default md:text-h5 xl:text-h4">
              Featured Projects
            </h2>
          </div>
          <p className="text-body-regular-16 text-muted md:text-body-regular-18">
            We've built a reputation for delivering exceptional results and exceeding our clients'
            expectations. From luxurious residential homes to state-of-the-art commercial properties,
            our team of experts is dedicated to bringing your vision to life.
          </p>
        </div>
        <Button to="/projects" variant="tertiary" className="relative text-body-medium-16">
          View all Projects
        </Button>
      </div>

      {/* Figma fija el contenedor en 704 con contenido de 716: el margen negativo da el mismo alto de sección */}
      <Carousel
        items={featuredProjects}
        getKey={getProjectKey}
        renderItem={renderProject}
        itemClassName="w-82 md:w-123.75 xl:w-[calc((100%-2rem)/3)]"
        previousLabel="Previous project"
        nextLabel="Next project"
        getStatusText={getStatusText}
        className="md:-mb-3"
      />
    </section>
  )
}
