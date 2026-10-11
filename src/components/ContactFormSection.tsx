import { useId, useState, type ChangeEvent, type ComponentType, type FormEvent } from 'react'
import { Link } from 'react-router'
import contactTitleIconUrl from '../assets/contact-title-icon.svg'
import { countryCodes } from '../data/countryCodes.ts'
import { projectFilters } from '../data/projectFilters.ts'
import { serviceCategories } from '../data/services.ts'
import {
  BillIcon,
  BuildingIcon,
  ChatIcon,
  ChevronIcon,
  MailIcon,
  PhoneIcon,
  SendIcon,
  UserIcon,
} from './icons.tsx'

type Option = { value: string; label: string }

const budgetOptions: Option[] =
  projectFilters.find((filter) => filter.name === 'cost')?.options ?? []

const serviceOptions: Option[] = serviceCategories.map((category) => ({
  value: category.id,
  label: category.label,
}))

// Caja común a campos y desplegables: 15 de relleno más 1 de borde
const BOX_CLASSES = 'relative rounded-lg border border-control bg-page p-3.75'

// La caja pinta el contorno de foco del control que contiene
const BOX_FOCUS_CLASSES =
  'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus'

// Etiqueta en reposo: el sitio del texto de Figma (x = 44, y = 16 desde el borde exterior).
// overflow-x-clip corta en horizontal con puntos suspensivos sin recortar la tinta por arriba ni por abajo
const LABEL_CLASSES =
  'absolute top-3.75 left-10.75 overflow-x-clip text-ellipsis whitespace-nowrap text-body-medium-16 text-muted'

// Sube al relleno superior (a 5 del borde exterior) con valor; en los campos de texto también con foco o autocompletado
const FLOAT_FILLED_CLASSES = 'group-data-filled:top-1 group-data-filled:text-body-medium-12/none'
const FLOAT_ACTIVE_CLASSES =
  'group-focus-within:top-1 group-focus-within:text-body-medium-12/none group-has-autofill:top-1 group-has-autofill:text-body-medium-12/none'

// text-ellipsis: sin foco, el valor que no cabe se corta con puntos suspensivos
const INPUT_CLASSES =
  'h-6 min-w-0 flex-1 bg-transparent text-ellipsis text-body-medium-16 text-default focus:outline-hidden autofill:shadow-[inset_0_0_0_1000px_var(--background-color-page)] autofill:[-webkit-text-fill-color:var(--text-color-default)]'

const CHEVRON_CLASSES = 'size-5 shrink-0 text-muted'

// <select> invisible sobre la cara: fondo, color y texto para que la lista del sistema se lea
const SELECT_CLASSES =
  'absolute inset-0 size-full cursor-pointer bg-page text-body-medium-16 text-muted opacity-0'

// Mismo fondo y color que el <select>, puestos en cada opción para que la lista
// no herede los colores que el navegador da al <select> autocompletado
const OPTION_CLASSES = 'bg-page text-muted'

type FormValues = {
  name: string
  countryCode: string
  phone: string
  email: string
  budget: string
  service: string
  message: string
}

const INITIAL_VALUES: FormValues = {
  name: '',
  countryCode: 'cm',
  phone: '',
  email: '',
  budget: '',
  service: '',
  message: '',
}

function RequiredMark() {
  return <span aria-hidden="true"> *</span>
}

type TextFieldProps = {
  label: string
  required?: boolean
  Icon: ComponentType<{ className?: string }>
  type: 'text' | 'tel' | 'email'
  name: string
  autoComplete: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
}

function TextField({ label, required, Icon, value, onChange, className = '', ...inputProps }: TextFieldProps) {
  const inputId = useId()

  // La caja entera es el <label>: un clic en cualquier punto enfoca el campo
  return (
    <label
      htmlFor={inputId}
      data-filled={value !== '' ? '' : undefined}
      className={`group flex h-14 cursor-text items-center gap-2 text-subtle ${BOX_CLASSES} ${BOX_FOCUS_CLASSES} ${className}`}
    >
      <Icon className="shrink-0" />
      <span className={`right-3.75 ${LABEL_CLASSES} ${FLOAT_FILLED_CLASSES} ${FLOAT_ACTIVE_CLASSES}`}>
        {label}
        {required && <RequiredMark />}
      </span>
      <input
        id={inputId}
        required={required}
        value={value}
        onChange={onChange}
        className={INPUT_CLASSES}
        {...inputProps}
      />
    </label>
  )
}

type SelectFieldProps = {
  label: string
  Icon: ComponentType<{ className?: string }>
  name: string
  options: Option[]
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  className?: string
}

// Patrón de FilterSelect: <select> nativo invisible sobre una cara propia
function SelectField({ label, Icon, name, options, value, onChange, className = '' }: SelectFieldProps) {
  const selectId = useId()
  const selected = options.find((option) => option.value === value)

  return (
    <div
      data-filled={selected ? '' : undefined}
      className={`group h-14 hover:bg-surface ${BOX_CLASSES} ${BOX_FOCUS_CLASSES} ${className}`}
    >
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <span aria-hidden="true" className="flex h-6 items-center gap-2 text-subtle">
        <Icon className="shrink-0" />
        {/* Termina antes de la flecha: 44 desde el borde exterior derecho */}
        <span className={`right-10.75 ${LABEL_CLASSES} ${FLOAT_FILLED_CLASSES}`}>{label}</span>
        <span className="min-w-0 flex-1 truncate text-body-medium-16 text-default">{selected?.label}</span>
        <ChevronIcon className={CHEVRON_CLASSES} strokeWidth={1.5} />
      </span>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        className={SELECT_CLASSES}
      >
        <option value="" className={OPTION_CLASSES}>
          {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className={OPTION_CLASSES}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

type CountryCodeSelectProps = {
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  const selectId = useId()
  const selected = countryCodes.find((country) => country.value === value) ?? countryCodes[0]

  return (
    <div className={`h-14 w-20 shrink-0 hover:bg-surface ${BOX_CLASSES} ${BOX_FOCUS_CLASSES}`}>
      <label htmlFor={selectId} className="sr-only">
        Country code
      </label>
      <span aria-hidden="true" className="flex h-6 items-center gap-2">
        {/* La sombra interior va en una capa encima de la imagen, común a las 8 banderas */}
        <span className="relative size-5 shrink-0 rounded-full after:absolute after:inset-0 after:rounded-full after:inset-shadow-flag">
          <img src={selected.flag} alt="" width="20" height="20" className="block size-5 rounded-full" />
        </span>
        <ChevronIcon className={CHEVRON_CLASSES} strokeWidth={1.5} />
      </span>
      <select
        id={selectId}
        name="countryCode"
        value={value}
        onChange={onChange}
        className={SELECT_CLASSES}
      >
        {countryCodes.map((country) => (
          <option key={country.value} value={country.value} className={OPTION_CLASSES}>
            {`${country.name} (${country.dialCode})`}
          </option>
        ))}
      </select>
    </div>
  )
}

type MessageFieldProps = {
  value: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

function MessageField({ value, onChange }: MessageFieldProps) {
  const textareaId = useId()

  // La caja entera es el <label>: un clic en cualquier punto enfoca el campo
  return (
    <label
      htmlFor={textareaId}
      data-filled={value !== '' ? '' : undefined}
      className={`group col-span-full flex min-h-42.5 cursor-text items-start gap-2 text-subtle ${BOX_CLASSES} ${BOX_FOCUS_CLASSES}`}
    >
      <ChatIcon className="shrink-0" />
      <span className={`right-3.75 ${LABEL_CLASSES} ${FLOAT_FILLED_CLASSES} ${FLOAT_ACTIVE_CLASSES}`}>
        Message
        <RequiredMark />
      </span>
      {/* 138 = 170 de la caja menos relleno y borde: al redimensionar, la caja no baja de 170 */}
      <textarea
        id={textareaId}
        name="message"
        required
        value={value}
        onChange={onChange}
        className="min-h-34.5 min-w-0 flex-1 resize-y bg-transparent text-body-medium-16 text-default focus:outline-hidden"
      />
    </label>
  )
}

export function ContactFormSection() {
  const headingId = useId()
  const termsId = useId()
  const [values, setValues] = useState(INITIAL_VALUES)

  function update(name: keyof FormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [name]: event.target.value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // La validación y el envío llegan en el bloque 2
    event.preventDefault()
  }

  return (
    <section id="form" aria-labelledby={headingId} className="flex flex-col gap-10 xl:min-w-0 xl:flex-1">
      <div className="flex items-center gap-6">
        <img src={contactTitleIconUrl} alt="" width="38" height="38" className="size-9.5 shrink-0" />
        <h2
          id={headingId}
          tabIndex={-1}
          className="font-heading text-extra-30 text-default focus:outline-hidden md:text-h5"
        >
          Have a project in mind?
        </h2>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-default bg-page p-3.75 md:grid-cols-2 md:gap-y-6 md:p-5.75 xl:grid-cols-6"
      >
        <TextField
          label="Name"
          required
          Icon={UserIcon}
          type="text"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={update('name')}
          className="xl:col-span-2"
        />

        <div className="flex gap-2 xl:col-span-2">
          <CountryCodeSelect value={values.countryCode} onChange={update('countryCode')} />
          <TextField
            label="Phone Number"
            Icon={PhoneIcon}
            type="tel"
            name="phone"
            autoComplete="tel"
            value={values.phone}
            onChange={update('phone')}
            className="min-w-0 flex-1"
          />
        </div>

        <TextField
          label="Business Email"
          required
          Icon={MailIcon}
          type="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={update('email')}
          className="md:col-span-2"
        />

        <SelectField
          label="Select budget"
          Icon={BillIcon}
          name="budget"
          options={budgetOptions}
          value={values.budget}
          onChange={update('budget')}
          className="xl:col-span-3"
        />

        <SelectField
          label="Service you are interested in"
          Icon={BuildingIcon}
          name="service"
          options={serviceOptions}
          value={values.service}
          onChange={update('service')}
          className="xl:col-span-3"
        />

        <MessageField value={values.message} onChange={update('message')} />

        <div className="col-span-full flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-2.5 md:items-center">
            <span className="relative flex size-7 shrink-0">
              <input
                id={termsId}
                type="checkbox"
                name="terms"
                required
                className="peer size-7 cursor-pointer appearance-none rounded-sm border border-control bg-surface not-checked:hover:bg-surface-raised checked:border-accent checked:bg-accent"
              />
              {/* Marca propia: el diseño no tiene estado marcado */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
                focusable="false"
                className="pointer-events-none absolute inset-0 hidden text-inverse peer-checked:block"
              >
                <path
                  d="M8 14.5 L12.5 19 L20.5 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <label htmlFor={termsId} className="text-body-medium-16 text-subtle">
              I agree with{' '}
              <Link to="/case-study" className="underline [text-decoration-skip-ink:none] hover:text-gray-1">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link to="/case-study" className="underline [text-decoration-skip-ink:none] hover:text-gray-1">
                Privacy Policy
              </Link>
              <RequiredMark />
            </label>
          </div>

          <button
            type="submit"
            className="flex h-14.5 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 pt-5.5 pb-6 text-body-medium-18 text-inverse inset-shadow-button-accent md:w-39"
          >
            Send
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}
