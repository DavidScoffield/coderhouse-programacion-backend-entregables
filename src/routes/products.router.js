import { Router } from 'express'
import { PATH_OF_PRODUCTS } from '../constants/constants.js'
import ProductManager from '../managers/ProductManager.js'

const productRouter = Router()

const pm = new ProductManager(PATH_OF_PRODUCTS)

productRouter.get('/', async (req, res) => {
  const { limit } = req.query

  const products = await pm.getProducts()

  if (!limit) return res.send(products)

  const limitNumber = Number(limit)

  if (!limitNumber || limitNumber <= 0)
    return res.status(404).send(`"${limit}" is not a valid limit number`)

  res.send(products.slice(0, limitNumber))
})

productRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params
  const id = Number(pid)

  try {
    const product = await pm.getProductsById(id)
    res.send(product)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

productRouter.post('/', async (req, res) => {
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

  if (!title || !price || !code || !stock || !category || !price) {
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
    res.send({ message: `New product with id "${product.id}" was added` })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

productRouter.put('/:pid', async (req, res) => {
  const { pid } = req.params
  const id = Number(pid)

  const { title, description, code, price, status, stock, category, thumbnail } = req.body

  try {
    const product = await pm.updateProduct(id, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    })
    res.send({ message: `Product "${id}" was successfully updated` })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

productRouter.delete('/:pid', async (req, res) => {
  const { pid } = req.params
  const id = Number(pid)

  if (!id || id <= 0) return res.status(400).send({ error: `Invalid id: ${pid}` })

  try {
    await pm.deleteProduct(id)
    res.send({ message: `Product "${id}" was successfully deleted` })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

export default productRouter
