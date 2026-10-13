import { useId } from 'react'
import starsFourHalfUrl from '../assets/review-stars-4-5.svg'
import starsFiveUrl from '../assets/review-stars-5.svg'
import { Button } from './Button.tsx'

// Cristal de las reseñas. Sin overflow-clip (clipsContent en Figma): recortaría el anillo del ::before. Borde real de 1 px transparente (visible en alto contraste) y relleno de
// Figma reducido en 1. El degradado del borde lo pinta ::before sobre la caja del borde, recortado
// con máscara a un anillo de 1 px: border-image pierde el radio. Ángulos y paradas calculados de
// gradientTransform con la medida de la tarjeta en cada ancho.
// bg-gray-13: capa opaca bajo el degradado para que el texto llegue a 4,5:1 sobre la torre (D48).
// w-max: Amanda se sale del escenario por la derecha, como en Figma; sin él, al ser absoluta, encogería
const GLASS_CLASSES =
  'grid w-max grid-cols-[auto_auto] gap-y-4 rounded-3xl border border-transparent bg-gray-13 bg-origin-border backdrop-blur-[7px] pointer-events-auto before:absolute before:-inset-px before:rounded-[inherit] before:border before:border-transparent before:bg-origin-border before:[mask:linear-gradient(#000_0_0)_padding-box_exclude,linear-gradient(#000_0_0)]'

const AMANDA_CLASSES =
  'absolute -top-6.5 left-19.75 gap-x-4 px-3.75 pt-3.75 pb-4.25 shadow-review-sm bg-[linear-gradient(74.421deg,rgb(223_223_223/0.5)_15.931%,rgb(172_168_168/0.5)_35.863%)] before:bg-[linear-gradient(79.358deg,rgb(227_227_227/0.8)_15.79%,rgb(102_102_102/0.8)_61.452%)] md:-top-4.25 md:left-97.25 xl:top-15.25 xl:left-96.5 xl:pb-3.75 xl:bg-[linear-gradient(74.168deg,rgb(223_223_223/0.5)_15.931%,rgb(172_168_168/0.5)_35.863%)] xl:before:bg-[linear-gradient(79.18deg,rgb(227_227_227/0.8)_15.79%,rgb(102_102_102/0.8)_61.452%)]'

const JAMES_CLASSES =
  'absolute top-68.25 left-4.5 gap-x-6.25 px-3 pt-4.25 pb-4.75 shadow-review-lg bg-[linear-gradient(249.213deg,rgb(228_228_228/0.5)_29.878%,rgb(102_102_102/0.5)_78.484%)] before:bg-[linear-gradient(244.056deg,rgb(228_228_228/0.8)_41.463%,rgb(102_102_102/0.8)_88.61%)] md:top-81.25 md:left-16.75 md:bg-[linear-gradient(246.308deg,rgb(228_228_228/0.5)_29.878%,rgb(102_102_102/0.5)_78.484%)] md:before:bg-[linear-gradient(240.648deg,rgb(228_228_228/0.8)_41.463%,rgb(102_102_102/0.8)_88.61%)] xl:top-149 xl:left-8 xl:pb-4.25 xl:bg-[linear-gradient(245.958deg,rgb(228_228_228/0.5)_29.878%,rgb(102_102_102/0.5)_78.484%)] xl:before:bg-[linear-gradient(240.241deg,rgb(228_228_228/0.8)_41.463%,rgb(102_102_102/0.8)_88.61%)]'

const QUOTE_CLASSES = 'text-body-medium-14 text-gray-2 [text-box:trim-both_cap_alphabetic]'

const SIGNATURE_CLASSES =
  'text-xs font-bold leading-5.5 text-gray-2 [text-box:trim-both_cap_alphabetic]'

export function HomeHero() {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      {/* mx-auto: centra la caja de 1440 */}
      <div className="mx-auto grid max-w-page grid-cols-1 gap-30 pt-18 md:pt-26 xl:items-center xl:px-16">
        <div className="flex flex-col gap-12 px-4 md:gap-18 md:px-10 xl:col-start-1 xl:row-start-1 xl:w-170 xl:justify-self-start xl:px-0">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Color gray-3 a 360: estilo «White» de Figma */}
            <h1
              id={headingId}
              tabIndex={-1}
              className="font-heading text-h6 text-gray-3 focus:outline-hidden md:text-h3 md:text-default"
            >
              Creating a Better Tomorrow, One Home at a Time
            </h1>
            <p className="text-body-regular-16 text-muted md:text-body-regular-18 xl:text-body-regular-20">
              We've built a reputation for delivering exceptional results and exceeding our clients'
              expectations. From luxurious residential homes to state-of-the-art commercial
              properties, our team of experts is dedicated to bringing your vision to life.
            </p>
          </div>
          <div className="flex gap-4 md:gap-8">
            {/* A 360 los dos botones se reparten el ancho; el texto que no cabe invade el relleno por igual.
                Con el foco suben por encima del escenario: la punta de la torre tapaba parte del contorno (A51) */}
            <Button
              variant="primary"
              to="/contact"
              className="relative flex min-w-0 flex-1 justify-center whitespace-nowrap text-body-medium-16 focus-visible:z-raised md:flex-initial xl:text-body-medium-18"
            >
              Schedule a Call
            </Button>
            <Button
              variant="secondary"
              to="/projects"
              className="relative flex min-w-0 flex-1 justify-center whitespace-nowrap text-body-medium-16 focus-visible:z-raised md:flex-initial xl:text-body-medium-18"
            >
              View Our Projects
            </Button>
          </div>
        </div>

        {/* Composición de medida fija de cada ancho (A50); la caja no recorta. mx-auto la centra por
            debajo de 1440. Sin eventos de puntero: la caja transparente de la torre tapa parte de los
            botones a 774 y la del escenario solapa el texto a 1440 */}
        <div className="pointer-events-none relative mx-auto h-107 w-90 md:h-125 md:w-193.5 xl:z-hero-art xl:col-start-1 xl:row-start-1 xl:mx-0 xl:h-207.5 xl:w-175.75 xl:justify-self-end">
          <img
            src="/images/home/hero-tower.png"
            alt=""
            width="950"
            height="1267"
            className="absolute -top-34.25 -left-7.75 h-201.75 w-126.75 max-w-none object-cover md:-top-34.75 md:-left-11.5 md:h-313 md:w-199 xl:-top-38.5 xl:h-316.75"
          />
          <figure className={`${GLASS_CLASSES} ${AMANDA_CLASSES}`}>
            <img
              src="/images/avatars/review-amanda.webp"
              alt=""
              width="200"
              height="200"
              className="row-span-2 size-11 self-center rounded-full object-cover"
            />
            <div className="flex w-59.5 flex-col gap-2">
              <img src={starsFiveUrl} alt="Rated 5 out of 5" width="105" height="21" />
              <blockquote>
                <p className={QUOTE_CLASSES}>
                  I highly recommend, My home exactly what I wanted
                </p>
              </blockquote>
            </div>
            <figcaption className={SIGNATURE_CLASSES}>Amanda | Actor</figcaption>
          </figure>
          <figure className={`${GLASS_CLASSES} ${JAMES_CLASSES}`}>
            <img
              src="/images/avatars/review-james.webp"
              alt=""
              width="200"
              height="200"
              className="row-span-2 h-12.75 w-13 self-center rounded-full object-cover"
            />
            {/* A 360 la columna mide 192 y la cita (226) sobresale dentro de la tarjeta, como en Figma */}
            <div className="flex w-48 flex-col gap-3.25 md:w-59.5">
              <img src={starsFourHalfUrl} alt="Rated 4.5 out of 5" width="73" height="15" />
              <blockquote>
                <p className={`w-56.5 ${QUOTE_CLASSES}`}>
                  Pinnacle is my GO-TO when it comes to real estate
                </p>
              </blockquote>
            </div>
            <figcaption className={SIGNATURE_CLASSES}>James | CEO of Crazy Bank</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
