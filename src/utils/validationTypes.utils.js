import ValidationError from '../errors/ValidationError.js'
import logger from './logger.utils.js'

const productValidations = {
  title: (value) => {
    if (typeof value !== 'string') {
      throw new ValidationError('Title must be a string')
    }
    return true
  },
  description: (value) => {
    if (typeof value !== 'string') {
      throw new ValidationError('Description must be a string')
    }
    return true
  },
  code: (value) => {
    if (typeof value !== 'string') {
      throw new ValidationError('Code must be a string')
    }
    return true
  },
  price: (value) => {
    const parsedPrice = Number(value)
    if (isNaN(parsedPrice)) {
      throw new ValidationError('Price must be a valid number')
    }
    return true
  },
  status: (value) => {
    if (typeof value !== 'boolean') {
      throw new ValidationError('Status must be a boolean')
    }
    return true
  },
  stock: (value) => {
    const parsedStock = Number(value)
    if (isNaN(parsedStock)) {
      throw new ValidationError('Stock must be a valid number')
    }
    return true
  },
  category: (value) => {
    if (typeof value !== 'string') {
      throw new ValidationError('Category must be a string')
    }
    return true
  },
  thumbnail: (value) => {
    if (!Array.isArray(value)) {
      throw new ValidationError('Thumbnail must be an array')
    }
    return true
  },
}

const isInvalidNumber = (value) => {
  const parsedValue = Number(value)
  return value && (isNaN(parsedValue) || parsedValue <= 0)
}

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

/**
 * @param {Object} data
 * @param {Object} validations
 
 * @returns {boolean}
 * @throws {ValidationError}

  @description Check if values in data are valid according to validations object
 */
const validateData = (data, validations) => {
  const keysData = Object.keys(data)
  const availableValidations = Object.keys(validations)

  const { matches, nonMatches } = keysData.reduce(
    (result, key) => {
      if (availableValidations.includes(key)) {
        result.matches.push(key)
      } else {
        result.nonMatches.push(key)
      }
      return result
    },
    { matches: [], nonMatches: [] }
  )

  if (nonMatches.length > 0) {
    logger.error(`❓Las keys |${nonMatches.join(',')}| no tienen validador`)
  }

  const validatedValues = matches.reduce((acc, property) => {
    return { ...acc, [property]: validations[property](data[property]) }
  }, {})

  // Check if all values in validatedValues are true
  return Object.values(validatedValues).every(Boolean)
}

const isProductDataValid = (productData) => validateData(productData, productValidations)

const isPaginationParamsValid = (paginationParams) =>
  validateData(paginationParams, paginationParamsValidations)

export { isProductDataValid, isPaginationParamsValid }
