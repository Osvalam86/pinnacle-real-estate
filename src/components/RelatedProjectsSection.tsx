import { useId } from 'react'
import titleIconUrl from '../assets/featured-title-icon.svg'
import projects from '../data/projects.json'
import { GRID_CARD_SIZES } from '../data/projectImages.ts'
import { BackToProjectsLink } from './BackToProjectsLink.tsx'
import { ProjectCard } from './ProjectCard.tsx'
import { SectionTitle } from './SectionTitle.tsx'

// Los 3 proyectos siguientes al actual en el orden de projects.json, dando la vuelta al final
function getRelatedProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  return [1, 2, 3].map((offset) => projects[(index + offset) % projects.length])
}

export function RelatedProjectsSection({ slug }: { slug: string }) {
  const headingId = useId()
  const related = getRelatedProjects(slug)

  return (
    <>
      {/* mx-auto: centra la caja de 1440 */}
      <div className="mx-auto max-w-page px-4 py-16 md:px-10 md:pt-22 md:pb-20 xl:px-16 xl:pt-26 xl:pb-22">
        {/* Borde y no fondo: así la línea se ve también en alto contraste */}
        <div aria-hidden="true" className="border-t-2 border-default" />
      </div>

      <div className="bg-page">
        {/* mx-auto: centra la caja de 1440 */}
        <section
          aria-labelledby={headingId}
          className="mx-auto flex max-w-page flex-col gap-10.5 px-4 pb-22 md:px-10 md:pb-26 xl:px-16 xl:pb-32"
        >
          {/* El enlace va primero en el DOM, como se ve a 774 y 360; a 1440 pasa a la derecha */}
          <div className="flex flex-col gap-12 xl:flex-row-reverse xl:items-end xl:justify-between xl:gap-2">
            <BackToProjectsLink className="self-start xl:self-auto" />
            <div className="flex flex-col gap-6 xl:w-199 xl:gap-8">
              <SectionTitle as="h2" id={headingId} iconSrc={titleIconUrl} className="gap-2 md:gap-6">
                You may also like
              </SectionTitle>
              <p className="text-body-regular-16 text-muted md:text-body-regular-18">
                You may also want to check the following projects we worked on.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {related.map((project, index) => (
              // Por debajo de 1440 solo se ven las 2 primeras
              <li key={project.slug} className={index === 2 ? 'hidden xl:block' : undefined}>
                <ProjectCard
                  name={project.name}
                  description={project.description}
                  location={project.location}
                  tag={project.tag}
                  image={project.image}
                  slug={project.slug}
                  imageSizes={GRID_CARD_SIZES}
                  headingLevel="h3"
                  gapClassName="gap-6 md:gap-8"
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
