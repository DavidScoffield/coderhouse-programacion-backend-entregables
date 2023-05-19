import { pm } from '../constants/singletons.js'
import ValidationError from '../errors/ValidationError.js'
import { castToMongoId } from '../utils/casts.js'
import { isProductDataValid } from '../utils/validationTypes.js'

const getProducts = async (req, res, next) => {
  const { limit } = req.query

  const limitNumber = Number(limit)

  if (limit && (!limitNumber || limitNumber <= 0))
    return res.status(404).json({ error: `"${limit}" is not a valid limit number` })

  try {
    const products = await pm.getProducts({ limit: limitNumber })
    res.send(products)
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  const { pid } = req.params

  if (!pid) return res.status(400).send({ error: `Must to especify an id` })

  try {
    const id = castToMongoId(pid)

    const product = await pm.getProductById(id)
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
    const product = await pm.addProduct({
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

    req.io.emit('storedProducts', await pm.getProducts())
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

    const updatedProduct = await pm.updateProduct(id, {
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

    const deletedProduct = await pm.deleteProduct(id)

    if (deletedProduct) {
      res.json({ message: `Product "${deletedProduct.id}" was successfully deleted` })
      req.io.emit('storedProducts', await pm.getProducts())
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
