import linesUrl from '../assets/about-lines.svg'
import linesMobileUrl from '../assets/about-lines-mobile.svg'
import starsUrl from '../assets/about-stars-4-5.svg'
import titleShapeUrl from '../assets/about-title-shape.svg'
import titleShapeMobileUrl from '../assets/about-title-shape-mobile.svg'
import { Button } from './Button.tsx'

const CLIENT_AVATARS = ['client-1', 'client-2', 'client-3', 'client-4']

// Imágenes giradas sobre su esquina superior izquierda, como en Figma
const PHOTO_CLASSES =
  'pointer-events-none absolute hidden origin-top-left rounded-2xl object-cover xl:block'

export function AboutSection() {
  return (
    // overflow-clip también a 1440: en Figma las líneas que salen por abajo las tapa Featured, pero aquí
    // About está en z-hero-cover y las pintaría encima
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative mx-auto max-w-page overflow-clip px-4 py-16 md:px-10 md:py-30 xl:px-16"
    >
      {/* Restricción centrada de Figma: la caja del archivo se coloca respecto al centro de la sección.
          Ocultas en alto contraste, como el fondo del sitio (A53) */}
      <img
        src={linesMobileUrl}
        alt=""
        width="451"
        height="451"
        loading="lazy"
        className="pointer-events-none absolute top-[calc(50%+174.19px)] left-[calc(50%-221.36px)] max-w-none md:hidden forced-colors:hidden"
      />
      <img
        src={linesUrl}
        alt=""
        width="872"
        height="872"
        loading="lazy"
        className="pointer-events-none absolute hidden max-w-none md:top-[calc(50%+108.08px)] md:left-[calc(50%-435.56px)] md:block xl:top-[calc(50%+108.58px)] forced-colors:hidden"
      />

      <div className="relative flex flex-col items-center gap-10 md:gap-12">
        <div className="flex w-82 max-w-full flex-col items-center gap-6 md:w-163.5 md:gap-8 xl:w-197.25">
          <div className="flex flex-col gap-2">
            {/* Blanco y no gray-4 como en Figma: D49 */}
            <h2
              id="about-heading"
              tabIndex={-1}
              className="flex flex-col items-center font-heading text-h6 text-gray-1 focus:outline-hidden md:text-h3 xl:text-h2"
            >
              {/* Por debajo de 360 la línea parte en dos (A52) */}
              <span className="flex flex-wrap items-center justify-center gap-1 md:flex-nowrap md:gap-2">
                <span>We're</span>
                <img src={titleShapeMobileUrl} alt="" width="56" height="24" className="md:hidden" />
                <img src={titleShapeUrl} alt="" width="121" height="47" className="hidden md:block" />
                {/* El espacio inicial solo ocupa sitio desde 774, como en Figma; a 360 queda para el lector.
                    whitespace-pre: not-sr-only devuelve white-space: normal y el espacio se perdía */}
                <span>
                  <span className="sr-only md:not-sr-only md:whitespace-pre">{' '}</span>
                  building
                </span>
                {/* Separa las dos líneas en el nombre accesible sin depender de cómo se unen los bloques */}
                <span className="sr-only">{' '}</span>
              </span>
              {/* separación −3 de Figma a 774 */}
              <span className="md:-mt-0.75 xl:mt-0">communities.</span>
            </h2>
            {/* gray-13 y no blanco como en Figma: D50 */}
            <p className="text-center text-body-medium-16 text-inverse md:text-body-medium-18">
              With a commitment to excellence and a focus on innovation, we've established ourselves
              as a leader in the real estate and construction industry.
            </p>
          </div>
          <Button to="/case-study" variant="tertiary" className="text-body-medium-16">
            Learn More About Us...
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center">
          {/* separación −16 de Figma */}
          <div className="flex -space-x-4">
            {CLIENT_AVATARS.map((name) => (
              <img
                key={name}
                src={`/images/avatars/${name}.webp`}
                alt=""
                width="200"
                height="200"
                className="size-10.5 rounded-full"
              />
            ))}
          </div>
          <div className="flex flex-col items-center md:items-start">
            <img src={starsUrl} alt="" width="105" height="21" />
            {/* gray-13 y no blanco como en Figma: D50 */}
            <p className="text-body-regular-16 text-inverse">4.3/5 Rated by 300+ Professionals</p>
          </div>
        </div>
      </div>

      <img
        src="/images/home/about.webp"
        alt=""
        width="1716"
        height="1716"
        loading="lazy"
        className={`${PHOTO_CLASSES} top-[143.16px] left-[1169.55px] h-[261.255px] w-[187.795px] rotate-[-11.094deg] opacity-40`}
      />
      <img
        src="/images/home/about.webp"
        alt=""
        width="1716"
        height="1716"
        loading="lazy"
        className={`${PHOTO_CLASSES} top-[284.47px] left-[102.98px] h-[257.662px] w-[202.684px] rotate-[10.797deg] opacity-20`}
      />
    </section>
  )
}
