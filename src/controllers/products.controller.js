import httpStatus from 'http-status'
import EErrors from '../errors/EErrors.js'
import {
  productErrorAtLeastOne,
  productErrorIncompleteValues,
} from '../errors/constants/productsErrors.js'
import ErrorService from '../services/ErrorService.js'
import { productRepository } from '../services/repositories/index.js'
import { castToMongoId } from '../utils/casts.utils.js'
import { mappedStatus } from '../utils/mappedParams.util.js'
import { isPaginationParamsValid } from '../utils/validations/pagination.validations.util.js'
import { isProductDataValid } from '../utils/validations/products.validations.util.js'

const getProducts = async (req, res, next) => {
  const { page = 1, limit = 10, sort, category = '', status = undefined } = req.query

  const productDataToValidate = {}
  if (category) productDataToValidate.category = category
  if (status !== undefined) productDataToValidate.status = mappedStatus[status]

  try {
    isPaginationParamsValid({ limit, page, sort })
    isProductDataValid(productDataToValidate)

    const { docs, ...rest } = await productRepository.getProducts({
      limit,
      page,
      sort,
      query: productDataToValidate,
    })

    const payload = {
      products: docs,
      totalPages: rest.totalPages,
      prevPage: rest.prevPage,
      nextPage: rest.nextPage,
      page: rest.page,
      hasNextPage: rest.hasNextPage,
      hasPrevPage: rest.hasPrevPage,
      prevLink: rest.prevLink,
      nextLink: rest.nextLink,
    }

    res.sendSuccessWithPayload({ message: 'Products found', payload })
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  const { pid } = req.params

  if (!pid) return res.status(400).send({ error: `Must to especify an id` })

  try {
    const id = castToMongoId(pid)

    const product = await productRepository.getProductById(id)
    if (!product) return res.sendNotFound({ error: `Product with id "${id}" not found` })

    res.sendSuccessWithPayload({ payload: product })
  } catch (error) {
    next(error)
  }
}

const createProduct = async (req, res, next) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail = [],
  } = req.body

  if (!title || !description || !code || !stock || !category || !price) {
    ErrorService.createError({
      name: 'CreateProductError',
      status: httpStatus.BAD_REQUEST,
      cause: productErrorIncompleteValues({ title, description, code, stock, category, price }),
      code: EErrors.INCOMPLETE_VALUES,
      message: 'Missing parameters',
    })
  }

  const product = await productRepository.addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  })
  res.sendSuccess(`New product with id "${product.id}" was added`)

  req.io.emit('realTimeProducts:storedProducts', await productRepository.getProducts())
}

const updateProduct = async (req, res, next) => {
  const { pid } = req.params
  const { body } = req
  const { title, description, code, price, status, stock, category, thumbnail } = body

  try {
    const id = castToMongoId(pid)

    if (
      !title &&
      !description &&
      !price &&
      !thumbnail &&
      !code &&
      !stock &&
      !category &&
      status === undefined
    ) {
      ErrorService.createValidationError({
        message: 'Must provide at least one field to update',
        status: httpStatus.BAD_REQUEST,
        cause: productErrorAtLeastOne(body),
        code: EErrors.INCOMPLETE_VALUES,
      })
    }

    isProductDataValid(body)

    const updatedProduct = await productRepository.updateProduct(id, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    })

    res.sendSuccessWithPayload({
      message: `Product "${updatedProduct._id}" was successfully updated`,
      payload: updatedProduct,
    })
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  const { pid } = req.params

  try {
    const id = castToMongoId(pid)

    const deletedProduct = await productRepository.deleteProduct(id)

    if (deletedProduct) {
      res.sendSuccess(`Product "${deletedProduct.id}" was successfully deleted`)
      req.io.emit('realTimeProducts:storedProducts', await productRepository.getProducts())
    } else {
      res.sendNotFound({ error: `Product with id "${id}" not found` })
    }
  } catch (error) {
    next(error)
  }
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
