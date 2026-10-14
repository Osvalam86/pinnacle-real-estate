import { AboutSection } from '../components/AboutSection.tsx'
import { CtaSection } from '../components/CtaSection.tsx'
import { FaqSection } from '../components/FaqSection.tsx'
import { FeaturedProjectsSection } from '../components/FeaturedProjectsSection.tsx'
import { HomeHero } from '../components/HomeHero.tsx'
import { LatestNewsSection } from '../components/LatestNewsSection.tsx'
import { ServicesSection } from '../components/ServicesSection.tsx'
import { TestimonialsSection } from '../components/TestimonialsSection.tsx'
import { usePageTitle } from '../routing/usePageTitle.ts'

function HomePage() {
  usePageTitle('Pinnacle Real Estate')

  return (
    <>
      <HomeHero />

      {/* Caja exterior de About: tapa la parte de la torre que sale por debajo del hero. Desde 1440
          se pone encima del escenario; por debajo no lleva z-index para que el panel del menú quede encima */}
      <div className="relative bg-accent xl:z-hero-cover">
        <AboutSection />
      </div>
      <FeaturedProjectsSection />
      <ServicesSection />
      <TestimonialsSection />
      <LatestNewsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}

export default HomePage
