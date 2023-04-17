import { Router } from 'express'
import { PATH_TO_SAVE_DATA } from '../constants/constants.js'
import ProductManager from '../managers/ProductManager.js'

const productRouter = Router()

const pm = new ProductManager(PATH_TO_SAVE_DATA)

productRouter.get('/', async (req, res) => {
  const { limit } = req.query

  const products = await pm.getProducts()

  if (!limit) return res.send(products)

  const limitNumber = Number(limit)

  if (!limitNumber || limitNumber <= 0)
    return res.status(404).send(`"${limit}" no es un numero valido`)

  res.send(products.slice(0, limitNumber))
})

productRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params
  const id = Number(pid)

  const product = await pm.getProductsById(id)

  if (!product) {
    return res.send({ error: `Product with id "${id}" not exist in list` })
  }

  res.send(product)
})

export default productRouter
