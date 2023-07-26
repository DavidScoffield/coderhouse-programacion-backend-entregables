import ErrorService from '../../services/error.service.js'
import { isInvalidNumber, validateData } from './generic.validations.util.js'

const paginationParamsValidations = {
  limit: (limit) => {
    if (isInvalidNumber(limit))
      ErrorService.createValidationError({
        message: `"${limit}" is not a valid limit number`,
      })

    return true
  },
  page: (page) => {
    if (isInvalidNumber(page))
      ErrorService.createValidationError({
        message: `"${page}" is not a valid page number`,
      })

    return true
  },
  sort: (sort) => {
    if (sort) {
      if (typeof sort !== 'string') {
        ErrorService.createValidationError({
          message: 'Sort must be a string',
        })
      }
      if (!['asc', 'desc'].includes(sort)) {
        ErrorService.createValidationError({
          message: 'Sort must be "asc" or "desc"',
        })
      }
    }
    return true
  },
}

const isPaginationParamsValid = (paginationParams) =>
  validateData(paginationParams, paginationParamsValidations)

export { isPaginationParamsValid }
