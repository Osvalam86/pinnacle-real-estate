import { useId } from 'react'
import starsUrl from '../assets/about-stars-4-5.svg'
import titleIconUrl from '../assets/testimonials-title-icon.svg'
import { testimonials, type Testimonial } from '../data/testimonials.ts'

const CLIENT_AVATARS = ['client-1', 'client-2', 'client-3', 'client-4']

function TestimonialCard({ quote, name, role, image, wideOnly }: Testimonial) {
  return (
    <li className={wideOnly ? 'hidden xl:flex' : 'flex'}>
      {/* Rejilla y no flex: el figcaption tiene que ser hijo directo del figure.
          content-start evita que el alto sobrante de la fila de 1440 se reparta entre las filas.
          A 1440 sin relleno, como en Figma */}
      <figure className="grid w-full content-start gap-6 overflow-clip rounded-2xl border border-default bg-page px-3.75 pt-3.75 pb-5.75 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8 md:p-5.75 xl:bg-transparent xl:pb-7.75">
        <img
          src={image}
          alt=""
          width="200"
          height="200"
          loading="lazy"
          className="size-16 shrink-0 rounded-lg object-cover md:row-span-2 md:size-20 md:rounded-2xl xl:size-25"
        />
        <blockquote className="text-body-bold-20 text-default md:text-body-bold-24">
          <p>{quote}</p>
        </blockquote>
        {/* Sin line-clamp desde md: en Edge, junto con el recorte, corta las letras bajo la línea base */}
        <figcaption className="line-clamp-2 text-body-medium-14 text-muted md:line-clamp-none md:text-body-regular-18 md:[text-box:trim-both_cap_alphabetic]">
          - <span className="text-default">{name}</span>, {role}
        </figcaption>
      </figure>
    </li>
  )
}

export function TestimonialsSection() {
  const headingId = useId()

  return (
    // mx-auto: centra la caja de 1440 en ventanas más anchas
    <section
      id="testimonials"
      aria-labelledby={headingId}
      className="mx-auto flex max-w-page flex-col gap-16 px-4 py-16 md:px-10 md:py-20 xl:gap-18 xl:px-16 xl:py-22"
    >
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 xl:gap-6">
          {/* Alineado arriba a 1440, como en Figma */}
          <div className="flex items-center justify-center gap-2 md:gap-6 xl:items-start">
            <h2
              id={headingId}
              tabIndex={-1}
              className="w-67.5 text-center font-heading text-extra-30 text-default focus:outline-hidden md:w-auto md:text-h5 xl:text-h4"
            >
              What Our Clients Say
            </h2>
            <img
              src={titleIconUrl}
              alt=""
              width="38"
              height="62"
              className="w-6.5 shrink-0 md:w-7.5 xl:w-9.5"
            />
          </div>
          <p className="text-center text-body-regular-18 text-muted [text-box:trim-both_cap_alphabetic] xl:w-169 xl:[text-box:normal]">
            At Pinnacle, we're not just building structures - we're building relationships. Here's
            what some of our satisfied clients have to say about their experience with us.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center">
          {/* separación −16 de Figma */}
          <div className="flex -space-x-4">
            {CLIENT_AVATARS.map((avatar) => (
              // Outline y no border: el border encogería la foto; el outline va encima, como el trazo interior de Figma
              <img
                key={avatar}
                src={`/images/avatars/${avatar}.webp`}
                alt=""
                width="200"
                height="200"
                loading="lazy"
                className="size-10.5 rounded-full outline-1 -outline-offset-1 outline-gray-10"
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 md:items-start xl:gap-0">
            <img src={starsUrl} alt="" width="105" height="21" />
            <p className="text-body-regular-18 text-muted [text-box:trim-both_cap_alphabetic] xl:text-body-regular-16 xl:text-subtle xl:[text-box:normal]">
              4.3/5 Rated by 300+ Professionals
            </p>
          </div>
        </div>
      </div>

      <ul className="grid gap-4 xl:grid-cols-2">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </ul>
    </section>
  )
}
