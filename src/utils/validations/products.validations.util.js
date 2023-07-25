import ValidationError from '../../errors/classes/ValidationError.js'
import { castToMongoId } from '../casts.utils.js'
import { isInvalidNumber, validateData } from './generic.validations.util.js'

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
      throw new ValidationError('Status must be a "true" or "false"')
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

const commonParamsValidations = {
  quantity: (quantity) => {
    if (isInvalidNumber(quantity)) {
      throw new ValidationError(`"${quantity}" is not a valid quantity number`)
    }

    return true
  },
  id: (id) => {
    const objectId = castToMongoId(id)

    if (!objectId) {
      throw new ValidationError(`"${id}" is not a valid id`)
    }

    return true
  },
}

const isProductDataValid = (productData) => validateData(productData, productValidations)

const isCommonParamsValid = (params) => validateData(params, commonParamsValidations)

export { isProductDataValid, isCommonParamsValid }
