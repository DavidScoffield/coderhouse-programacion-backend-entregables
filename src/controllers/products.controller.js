import { PM } from '../constants/singletons.js'
import ValidationError from '../errors/ValidationError.js'
import { castToMongoId } from '../utils/casts.utils.js'
import { httpStatus } from '../utils/response.utils.js'
import { isPaginationParamsValid, isProductDataValid } from '../utils/validationTypes.utils.js'

const getProducts = async (req, res, next) => {
  // TODO: work and filter "query" param
  const { page = 1, limit = 10, sort } = req.query

  try {
    const isValid = isPaginationParamsValid({ limit, page, sort })

    const { docs, ...rest } = await PM.getProducts({ limit, page, sort })

    const response = {
      status: httpStatus.SUCCESS,
      payload: docs,
      totalPages: rest.totalPages,
      prevPage: rest.prevPage,
      nextPage: rest.nextPage,
      page: rest.page,
      hasNextPage: rest.hasNextPage,
      hasPrevPage: rest.hasPrevPage,
      prevLink: rest.prevLink,
      nextLink: rest.nextLink,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  const { pid } = req.params

  if (!pid) return res.status(400).send({ error: `Must to especify an id` })

  try {
    const id = castToMongoId(pid)

    const product = await PM.getProductById(id)
    if (!product) return res.status(404).send({ error: `Product with id "${id}" not found` })
    res.send(product)
  } catch (error) {
    next(error)
  }
}

const createProduct = async (req, res) => {
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
    return res.status(400).send({ error: 'Missing parameters' })
  }

  try {
    const product = await PM.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    })
    res.status(201).json({ message: `New product with id "${product.id}" was added` })

    req.io.emit('realTimeProducts:storedProducts', await PM.getProducts())
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
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
      throw new ValidationError('Must provide at least one field to update', 400)
    }

    const isValid = isProductDataValid(body)

    const updatedProduct = await PM.updateProduct(id, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    })

    res.json({
      message: `Product "${updatedProduct.id}" was successfully updated`,
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

    const deletedProduct = await PM.deleteProduct(id)

    if (deletedProduct) {
      res.json({ message: `Product "${deletedProduct.id}" was successfully deleted` })
      req.io.emit('realTimeProducts:storedProducts', await PM.getProducts())
    } else res.status(404).json({ error: `Product with id "${id}" not found` })
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
