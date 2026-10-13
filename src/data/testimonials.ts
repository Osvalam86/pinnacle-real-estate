export type Testimonial = {
  quote: string
  name: string
  /** Resto de la firma, tras «, » */
  role: string
  image: string
  /** Solo se ve desde 1440 (D32) */
  wideOnly?: boolean
}

export const testimonials: Testimonial[] = [
  {
    quote:
      '"Pinnacle\'s attention to detail and commitment to excellence is unparalleled. Their team is professional, courteous, and always willing to go the extra mile."',
    name: 'Emily J. Smith',
    role: 'Owner, Smith & Co.',
    image: '/images/avatars/testimonial-1.webp',
  },
  {
    quote:
      '"I was blown away by the quality of work and the level of service provided by Pinnacle. They truly understand the importance of delivering exceptional results."',
    name: 'David L. Lee',
    role: 'CEO, Lee Enterprises',
    image: '/images/avatars/testimonial-2.webp',
  },
  {
    quote:
      '"From the first meeting to the final walkthrough, Pinnacle kept us informed and on schedule. The finished building is exactly what we had envisioned."',
    name: 'Michael R. Torres',
    role: 'Director, Torres Group',
    image: '/images/avatars/testimonial-3.webp',
    wideOnly: true,
  },
  {
    quote:
      '"Pinnacle\'s ability to balance budget, schedule, and quality is impressive. They\'re a true partner in the construction process."',
    name: 'Sarah K. Johnson',
    role: 'Project Manager, Johnson Construction',
    image: '/images/avatars/testimonial-4.webp',
  },
]
