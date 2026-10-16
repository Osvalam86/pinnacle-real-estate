// Prefijos del campo de teléfono de Contact. El valor es el código de país de dos letras.
import caFlag from '../assets/flags/ca.svg'
import cmFlag from '../assets/flags/cm.svg'
import deFlag from '../assets/flags/de.svg'
import esFlag from '../assets/flags/es.svg'
import frFlag from '../assets/flags/fr.svg'
import gbFlag from '../assets/flags/gb.svg'
import mxFlag from '../assets/flags/mx.svg'
import usFlag from '../assets/flags/us.svg'

type CountryCode = {
  value: string
  name: string
  dialCode: string
  flag: string
}

export const countryCodes: CountryCode[] = [
  { value: 'cm', name: 'Cameroon', dialCode: '+237', flag: cmFlag },
  { value: 'ca', name: 'Canada', dialCode: '+1', flag: caFlag },
  { value: 'fr', name: 'France', dialCode: '+33', flag: frFlag },
  { value: 'de', name: 'Germany', dialCode: '+49', flag: deFlag },
  { value: 'mx', name: 'Mexico', dialCode: '+52', flag: mxFlag },
  { value: 'es', name: 'Spain', dialCode: '+34', flag: esFlag },
  { value: 'gb', name: 'United Kingdom', dialCode: '+44', flag: gbFlag },
  { value: 'us', name: 'United States', dialCode: '+1', flag: usFlag },
]
