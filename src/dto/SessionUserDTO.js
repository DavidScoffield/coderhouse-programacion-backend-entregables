import EErrors from '../errors/EErrors.js'
import ErrorService from '../services/ErrorService.js'

export default class SessionUserDTO {
  id
  name
  role
  email
  cart

  constructor({ name, firstName, lastName, id, role, email, cart }) {
    if (!id && id !== 0)
      ErrorService.createValidationError({
        message: 'SessionUserDTO: id is required',
        name: 'SessionUserDTO Error',
        code: EErrors.INCOMPLETE_VALUES,
      })

    if (!role)
      ErrorService.createValidationError({
        message: 'SessionUserDTO: role is required',
        name: 'SessionUserDTO Error',
        code: EErrors.INCOMPLETE_VALUES,
      })

    if (!email)
      ErrorService.createValidationError({
        message: 'SessionUserDTO: email is required',
        name: 'SessionUserDTO Error',
        code: EErrors.INCOMPLETE_VALUES,
      })

    if (!name && !firstName && !lastName)
      ErrorService.createValidationError({
        message: 'SessionUserDTO: Name, firstName or lastName are required',
        name: 'SessionUserDTO Error',
        code: EErrors.INCOMPLETE_VALUES,
      })

    this.id = id
    this.role = role
    this.email = email
    this.cart = cart
    this.name = name || `${firstName || ''} ${lastName || ''}`
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      email: this.email,
      cart: this.cart,
    }
  }
}
