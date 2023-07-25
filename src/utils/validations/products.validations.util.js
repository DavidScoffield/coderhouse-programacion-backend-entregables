import ErrorService from '../../services/ErrorService.js'
import { castToMongoId } from '../casts.utils.js'
import { isInvalidNumber, validateData } from './generic.validations.util.js'

const productValidations = {
  title: (value) => {
    if (typeof value !== 'string') {
      ErrorService.createValidationError({
        message: `Title must be a string`,
      })
    }
    return true
  },
  description: (value) => {
    if (typeof value !== 'string') {
      ErrorService.createValidationError({
        message: `Description must be a string`,
      })
    }
    return true
  },
  code: (value) => {
    if (typeof value !== 'string') {
      ErrorService.createValidationError({
        message: `Code must be a string`,
      })
    }
    return true
  },
  price: (value) => {
    const parsedPrice = Number(value)
    if (isNaN(parsedPrice)) {
      ErrorService.createValidationError({
        message: `Price must be a valid number`,
      })
    }
    return true
  },
  status: (value) => {
    if (typeof value !== 'boolean') {
      ErrorService.createValidationError({
        message: `Status must be a "true" or "false"`,
      })
    }

    return true
  },
  stock: (value) => {
    const parsedStock = Number(value)
    if (isNaN(parsedStock)) {
      ErrorService.createValidationError({
        message: `Stock must be a valid number`,
      })
    }
    return true
  },
  category: (value) => {
    if (typeof value !== 'string') {
      ErrorService.createValidationError({
        message: `Category must be a string`,
      })
    }
    return true
  },
  thumbnail: (value) => {
    if (!Array.isArray(value)) {
      ErrorService.createValidationError({
        message: `Thumbnail must be an array`,
      })
    }
    return true
  },
}

const commonParamsValidations = {
  quantity: (quantity) => {
    if (isInvalidNumber(quantity)) {
      ErrorService.createValidationError({
        message: `"${quantity}" is not a valid quantity number`,
      })
    }

    return true
  },
  id: (id) => {
    const objectId = castToMongoId(id)

    if (!objectId) {
      ErrorService.createValidationError({
        message: `"${id}" is not a valid id`,
      })
    }

    return true
  },
}

const isProductDataValid = (productData) => validateData(productData, productValidations)

const isCommonParamsValid = (params) => validateData(params, commonParamsValidations)

export { isProductDataValid, isCommonParamsValid }
