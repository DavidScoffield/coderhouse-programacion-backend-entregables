import ValidationError from '../../errors/classes/ValidationError.js'
import { isInvalidNumber, validateData } from './generic.validations.util.js'

const paginationParamsValidations = {
  limit: (limit) => {
    if (isInvalidNumber(limit)) throw new ValidationError(`"${limit}" is not a valid limit number`)

    return true
  },
  page: (page) => {
    if (isInvalidNumber(page)) throw new ValidationError(`"${page}" is not a valid page number`)

    return true
  },
  sort: (sort) => {
    if (sort) {
      if (typeof sort !== 'string') {
        throw new ValidationError('Sort must be a string')
      }
      if (!['asc', 'desc'].includes(sort)) {
        throw new ValidationError('Sort must be "asc" or "desc"')
      }
    }
    return true
  },
}

const isPaginationParamsValid = (paginationParams) =>
  validateData(paginationParams, paginationParamsValidations)

export { isPaginationParamsValid }
