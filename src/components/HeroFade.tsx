type HeroFadeProps = {
  /** Alto del degradado en cada ancho */
  className: string
}

// Sin z-index en el hero, -z-10 lo deja sobre el fondo del sitio y bajo todo el contenido en flujo,
// también el de la sección siguiente, en la que se adentra
export function HeroFade({ className }: HeroFadeProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 -z-10 bg-[linear-gradient(to_bottom,rgb(0_0_0/0)_74.4577%,#000_91.1695%)] forced-colors:hidden ${className}`}
    />
  )
}
