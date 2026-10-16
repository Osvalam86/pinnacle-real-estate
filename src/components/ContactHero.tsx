import { useId } from 'react'
import { getSrcSet } from '../data/responsiveImages.ts'
import { HeroFade } from './HeroFade.tsx'
import { revealOnLoad } from './revealOnLoad.ts'

export function ContactHero() {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="relative">
      {/* Capa de Figma solo a 1440: empieza en el borde superior de la página, así que sube los 104 de la cabecera */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-26 -z-10 hidden h-291.25 bg-[linear-gradient(to_bottom,rgb(0_0_0/0)_74.4577%,#000_100%)] forced-colors:hidden xl:block"
      />
      <HeroFade className="h-146 md:h-228.25 xl:h-243.75" />
      {/* mx-auto: centra la caja de 1440 */}
      <div className="relative mx-auto flex max-w-page flex-col gap-8 px-4 pt-24 md:gap-12.5 md:px-10 md:pt-28 xl:px-16 xl:pt-40">
        <div className="flex flex-col gap-4 md:gap-8 xl:w-191.25">
          <h1
            id={headingId}
            tabIndex={-1}
            className="font-heading text-h6 text-gray-3 focus:outline-hidden md:text-h4 md:text-default xl:text-h3"
          >
            Contact Us
          </h1>
          <p className="text-body-regular-16 text-muted md:text-body-regular-18">
            We value your feedback and would love to hear from you. Whether you have a question, a comment, or a
            suggestion, we're here to listen and help in any way we can.
          </p>
        </div>

        <img
          src="/images/contact/hero.webp"
          srcSet={getSrcSet('/images/contact/hero.webp', 2752)}
          sizes="(min-width: 90rem) 1312px, (min-width: 72.4375rem) calc(100vw - 80px), (min-width: 48.375rem) 1079px, (min-width: 29.4375rem) calc(100vw - 32px), 439px"
          alt=""
          width={2752}
          height={1536}
          fetchPriority="high"
          ref={revealOnLoad}
          className="h-61.25 w-full rounded-2xl object-cover md:h-150.5"
        />
      </div>
    </section>
  )
}
