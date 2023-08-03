import { ALL_USER_ROLES, USER_ROLES } from '../../constants/constants.js'
import ErrorService from '../../services/error.service.js'
import { isInvalidNumber, validateData } from './generic.validations.util.js'

const isEmail = (value) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
  return emailRegex.test(value)
}

const isValidRole = (role) => {
  return ALL_USER_ROLES.includes(role)
}

const userValidations = {
  firstName: (firstName) => {
    if (typeof firstName !== 'string') {
      ErrorService.createValidationError({
        message: `"${firstName}" is not a valid firstName string`,
      })
    }

    return true
  },
  lastName: (lastName) => {
    if (typeof lastName !== 'string') {
      ErrorService.createValidationError({
        message: `"${lastName}" is not a valid lastName string`,
      })
    }

    return true
  },
  email: (email) => {
    if (!isEmail(email)) {
      ErrorService.createValidationError({
        message: `"${email}" is not a valid email`,
      })
    }

    return true
  },
  age: (age) => {
    if (isInvalidNumber(age)) {
      ErrorService.createValidationError({
        message: `"${age}" is not a valid age number`,
      })
    }

    return true
  },
  password: (password) => {
    if (typeof password !== 'string') {
      ErrorService.createValidationError({
        message: `"${password}" is not a valid password string`,
      })
    }

    return true
  },
  role: (role) => {
    if (role) {
      if (typeof role !== 'string' || !isValidRole(role)) {
        ErrorService.createValidationError({
          message: `"${role}" is not a valid role`,
        })
      }
    }

    return true
  },
}

const isUsersDataValid = (userData) => validateData(userData, userValidations)

export { isUsersDataValid }
