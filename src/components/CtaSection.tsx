import { useId } from 'react'
import { Link } from 'react-router'
import meshLeftUrl from '../assets/cta-mesh-left.svg'
import meshLeftMobileUrl from '../assets/cta-mesh-left-mobile.svg'
import meshRightUrl from '../assets/cta-mesh-right.svg'
import meshRightMobileUrl from '../assets/cta-mesh-right-mobile.svg'
import titleShapeUrl from '../assets/cta-title-shape.svg'

// Mallas a su tamaño propio; posiciones calculadas aparte porque los archivos se reencuadraron
const MESH_CLASSES = 'pointer-events-none absolute max-w-none'

export function CtaSection() {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-page px-4 md:px-10 xl:px-16">
      {/* overflow-clip y no hidden: con hidden la caja se puede desplazar por dentro (foco, scrollIntoView) y mueve el título */}
      <div className="relative flex flex-col items-center gap-8 overflow-clip rounded-2xl bg-accent px-4 py-16 md:gap-10 md:px-10 md:pt-21 md:pb-15 xl:gap-14 xl:px-14">
        <img
          src={meshLeftMobileUrl}
          alt=""
          width="381"
          height="381"
          loading="lazy"
          className={`${MESH_CLASSES} -left-44.5 top-[calc(50%-446.5px)] md:hidden`}
        />
        <img
          src={meshRightMobileUrl}
          alt=""
          width="315"
          height="316"
          loading="lazy"
          className={`${MESH_CLASSES} -right-47.25 top-[calc(50%+40.5px)] md:hidden`}
        />
        <img
          src={meshLeftUrl}
          alt=""
          width="624"
          height="625"
          loading="lazy"
          className={`${MESH_CLASSES} hidden -left-80.5 top-[calc(50%-712px)] md:block xl:-left-83.5 xl:top-[calc(50%-525px)]`}
        />
        <img
          src={meshRightUrl}
          alt=""
          width="549"
          height="550"
          loading="lazy"
          className={`${MESH_CLASSES} hidden -right-72.5 top-[calc(50%+40px)] md:block xl:-right-63.75 xl:top-[calc(50%-121px)]`}
        />

        {/* word-spacing: hueco de Figma (5 / 9 / 9 px) menos el espacio natural de Clash Display (3,86 / 7,25 / 11,25 px) */}
        <h2
          id={headingId}
          className="relative w-full max-w-77 text-center font-heading text-extra-25 text-gray-1 [word-spacing:1.14px] md:max-w-153.5 md:text-h5 md:[word-spacing:1.75px] xl:max-w-228.75 xl:text-h3 xl:[word-spacing:-2.25px]"
        >
          Let’s Build{' '}
          {/* Alineada arriba y centrada en la línea con translate, para no aumentar su alto */}
          <img
            src={titleShapeUrl}
            alt=""
            width="90"
            height="50"
            className="hidden translate-y-[calc((1lh-100%)/2)] align-top md:inline md:h-10.5 md:w-19 xl:h-12.5 xl:w-22.5"
          />{' '}
          Something Extraordinary Together
        </h2>

        <Link
          to="/projects"
          className="relative rounded-lg border border-default bg-surface px-5.75 py-3.75 text-body-medium-16 text-default hover:bg-surface-raised"
        >
          View our projects
        </Link>
      </div>
    </section>
  )
}
