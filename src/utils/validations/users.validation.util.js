import { isInvalidNumber, validateData } from './generic.validations.util.js'
import ValidationError from '../../errors/ValidationError.js'

const isEmail = (value) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
  return emailRegex.test(value)
}

const userValidations = {
  firstName: (firstName) => {
    if (typeof firstName !== 'string') {
      throw new ValidationError(`"${firstName}" is not a valid firstName string`)
    }

    return true
  },
  lastName: (lastName) => {
    if (typeof lastName !== 'string') {
      throw new ValidationError(`"${lastName}" is not a valid lastName string`)
    }

    return true
  },
  email: (email) => {
    if (!isEmail(email)) {
      throw new ValidationError(`"${email}" is not a valid email`)
    }

    return true
  },
  age: (age) => {
    if (isInvalidNumber(age)) {
      throw new ValidationError(`"${age}" is not a valid age number`)
    }

    return true
  },
  password: (password) => {
    if (typeof password !== 'string') {
      throw new ValidationError(`"${password}" is not a valid password string`)
    }

    return true
  },
}

const isUsersDataValid = (userData) => validateData(userData, userValidations)

export { isUsersDataValid }
