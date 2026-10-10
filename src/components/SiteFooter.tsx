import { useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import logoUrl from '../assets/logo.svg'
import {
  FacebookIcon,
  LinkedInIcon,
  MailIcon,
  SendIcon,
  TwitterIcon,
  YouTubeIcon,
} from './icons.tsx'

// En bloque para que la fila mida el interlineado del enlace y no el del <li>
const LINK_CLASSES =
  'block text-body-medium-14 text-default decoration-1 hover:underline md:text-body-medium-16 md:text-gray-1 xl:text-default'

// «Terms & Conditions» va a 14 px en los tres anchos
const SMALL_LINK_CLASSES =
  'block text-body-medium-14 text-default decoration-1 hover:underline md:text-gray-1 xl:text-default'

const NAV_GROUPS = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Projects', to: '/projects' },
      { label: 'Testimonials', to: '/#testimonials' },
      { label: 'FAQ’s', to: '/#faq' },
      { label: 'Terms & Conditions', to: '/case-study', small: true },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Our Story', to: '/case-study' },
      { label: 'Our Values', to: '/case-study' },
      { label: 'Our Team', to: '/case-study' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { label: 'Portfolio', to: '/projects' },
      { label: 'Categories', to: '/projects#search' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Residential Construction', to: '/#services' },
      { label: 'Commercial Construction', to: '/#services' },
      { label: 'Property Management', to: '/#services' },
      { label: 'Development Services', to: '/#services' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { label: 'Contact Form', to: '/contact#form' },
      { label: 'Our Office', to: '/contact#office' },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: 'Facebook (opens in a new tab)', href: 'https://www.facebook.com/', Icon: FacebookIcon },
  { label: 'LinkedIn (opens in a new tab)', href: 'https://www.linkedin.com/', Icon: LinkedInIcon },
  { label: 'X (opens in a new tab)', href: 'https://x.com/', Icon: TwitterIcon },
  { label: 'YouTube (opens in a new tab)', href: 'https://www.youtube.com/', Icon: YouTubeIcon },
]

type Feedback = { kind: 'error' | 'success'; text: string } | null

function NewsletterForm() {
  const inputId = useId()
  const messageId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = inputRef.current
    if (!input) return

    let error = ''
    if (email.trim() === '') error = 'Enter your email address.'
    // La comprobación de formato es la del propio navegador para type="email"
    else if (input.validity.typeMismatch) error = 'Enter a valid email address, like name@example.com.'

    if (error) {
      setFeedback({ kind: 'error', text: error })
      input.focus()
      return
    }

    // Envío simulado: no hay petición de red
    setEmail('')
    setFeedback({ kind: 'success', text: 'Thank you. You’re subscribed.' })
  }

  const hasError = feedback?.kind === 'error'

  return (
    <form noValidate onSubmit={handleSubmit} className="w-full max-w-76.25">
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      {/* El contorno de foco se pinta en la caja completa cuando el campo tiene el foco */}
      <div className="flex h-13.25 items-center gap-2 rounded-lg border border-control px-3.75 text-subtle has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus has-[input[aria-invalid=true]]:border-feedback-danger">
        <MailIcon />
        <input
          ref={inputRef}
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Enter Your Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent text-body-medium-14 text-default placeholder:text-subtle focus:outline-hidden autofill:shadow-[inset_0_0_0_1000px_var(--background-color-page)] autofill:[-webkit-text-fill-color:var(--text-color-default)]"
        />
        {/* Área de 24×24 con margen negativo para que el icono no se mueva de su sitio */}
        <button
          type="submit"
          aria-label="Subscribe to our newsletter"
          className="-m-0.5 flex size-6 shrink-0 items-center justify-center text-default hover:text-gray-1"
        >
          <SendIcon />
        </button>
      </div>
      <p
        id={messageId}
        role="status"
        className={`max-w-76.25 text-body-medium-14 not-empty:mt-2 ${hasError ? 'text-feedback-danger' : 'text-default'}`}
      >
        {feedback?.text}
      </p>
    </form>
  )
}

type SiteFooterProps = {
  inert: boolean
}

export function SiteFooter({ inert }: SiteFooterProps) {
  return (
    <footer id="footer" tabIndex={-1} inert={inert} className="focus:outline-hidden">
      <div className="bg-page">
        <div className="mx-auto flex max-w-page flex-col gap-20 px-4 py-24 md:px-10 md:py-22 xl:flex-row xl:px-16 xl:py-24">
          <div className="flex flex-col gap-6 xl:w-81.5 xl:shrink-0">
            <img src={logoUrl} alt="Pinnacle" width="138" height="29" className="block" />
            <NewsletterForm />
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-between gap-x-4 gap-y-8 whitespace-nowrap xl:flex-1"
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-6">
                <h2 className="text-body-medium-18 text-subtle md:text-body-medium-20">{group.title}</h2>
                <ul className="flex flex-col items-start gap-4">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className={link.small ? SMALL_LINK_CLASSES : LINK_CLASSES}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-surface-raised">
        {/* A 360 las redes van arriba: se invierte el orden visual, no el del DOM */}
        <div className="mx-auto flex max-w-page flex-col-reverse items-start gap-4 p-4 md:flex-row md:items-center md:justify-between md:px-10 xl:px-16">
          <div className="py-2.5">
            <p className="text-body-medium-12 text-subtle md:text-body-medium-14">@2024 Pinnacle. All Rights Reserved.</p>
          </div>

          <ul aria-label="Social media" className="flex gap-2">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex rounded-lg border border-default bg-surface px-3.75 pt-2 pb-1.75 text-default hover:bg-gray-10 md:text-gray-1 xl:text-default"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
