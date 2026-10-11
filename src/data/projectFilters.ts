// Opciones del buscador de Projects. Cada valor de la URL apunta al texto exacto de projects.json.

export type FilterOption = {
  /** Valor en la URL */
  value: string
  label: string
  /** Valor del campo correspondiente en projects.json */
  match: string
}

export type ProjectFilter = {
  /** Nombre del parámetro en la URL y del <select> */
  name: 'location' | 'type' | 'cost'
  label: string
  /** Campo de projects.json con el que se compara */
  field: 'location' | 'type' | 'costRange'
  options: FilterOption[]
}

export const projectFilters: ProjectFilter[] = [
  {
    name: 'location',
    label: 'Location',
    field: 'location',
    options: [
      { value: 'allentown', label: 'Allentown, PA', match: 'Allentown, PA' },
      { value: 'bethlehem', label: 'Bethlehem, PA', match: 'Bethlehem, PA' },
      {
        value: 'upper-macungie-township',
        label: 'Upper Macungie Township, PA',
        match: 'Upper Macungie Township, PA',
      },
    ],
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    options: [
      { value: 'residential', label: 'Residential', match: 'Residential' },
      { value: 'commercial', label: 'Commercial', match: 'Commercial' },
      { value: 'mixed-use', label: 'Mixed-use', match: 'Mixed-use' },
    ],
  },
  {
    name: 'cost',
    label: 'Project Cost',
    field: 'costRange',
    options: [
      { value: 'under-5m', label: 'Under $5M', match: 'under-5m' },
      { value: '5m-20m', label: '$5M to $20M', match: '5m-20m' },
      { value: 'over-20m', label: 'Over $20M', match: 'over-20m' },
    ],
  },
]
