export type Service = {
  title: string
  description: string
}

export type ServiceCategory = {
  id: string
  label: string
  services: Service[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'residential',
    label: 'Residential',
    services: [
      {
        title: 'Custom Homes',
        description:
          'We design and build custom homes that reflect your personal style and meet your specific needs.',
      },
      {
        title: 'Community Dev',
        description:
          'We develop and manage community projects, including single-family homes, townhomes, and condominiums.',
      },
      {
        title: 'Renovations',
        description:
          'We specialize in residential renovations, from minor updates to major overhauls.',
      },
    ],
  },
  {
    id: 'property-management',
    label: 'Property Management',
    services: [
      {
        title: 'Leasing',
        description:
          'We market your property, screen applicants, and manage leases from signing to renewal.',
      },
      {
        title: 'Maintenance',
        description:
          'We handle routine upkeep and urgent repairs to keep every property in top condition.',
      },
      {
        title: 'Tenant Relations',
        description:
          'We respond to tenant requests quickly and keep communication clear and consistent.',
      },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    services: [
      {
        title: 'Office Spaces',
        description: 'We build modern offices designed around the way your team works.',
      },
      {
        title: 'Retail Centers',
        description:
          "We deliver retail spaces that attract visitors and support your tenants' business.",
      },
      {
        title: 'Interior Fit-Outs',
        description:
          'We tailor interiors to your brand, from layout planning to final finishes.',
      },
    ],
  },
  {
    id: 'development',
    label: 'Development',
    services: [
      {
        title: 'Site Selection',
        description:
          'We identify and evaluate land with the right location, zoning, and potential.',
      },
      {
        title: 'Feasibility',
        description:
          'We analyze costs, market demand, and risks before a project breaks ground.',
      },
      {
        title: 'Project Planning',
        description:
          'We coordinate permits, design, and schedules to move your project forward.',
      },
    ],
  },
]
