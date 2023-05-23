import ValidationError from '../errors/ValidationError.js'
import logger from './logger.utils.js'

const validations = {
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

/**
 * @param {Object} productData
 
 * @returns {boolean}
 * @throws {ValidationError}

  @description Check if values in productData are valid according to validations object
 */
const isProductDataValid = (productData) => {
  const keysProductData = Object.keys(productData)
  const availableValidations = Object.keys(validations)

  const { matches, nonMatches } = keysProductData.reduce(
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

  if (nonMatches.length > 0)
    logger.error(`❓Las keys |${nonMatches.join(',')}| no tienen validador`)

  const validatedValues = matches.reduce((acc, property) => {
    return { ...acc, [property]: validations[property](productData[property]) }
  }, {})

  // Check if all values in validatedValues are true
  return Object.values(validatedValues).every(Boolean)
}

export { isProductDataValid }
