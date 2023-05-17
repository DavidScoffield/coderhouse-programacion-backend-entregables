import { Router } from 'express'
import managers from '../utils/persistenceType.js'

const { cm, pm } = managers

const cartRouter = Router()

cartRouter.post('/', async (req, res) => {
  const cart = await cm.addCart()
  res.status(201).json({ message: `Cart with id "${cart.id}" created` })
})

cartRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params
  const id = Number(cid)

  if (!id || id <= 0) return res.status(400).send({ error: `Invalid id: ${cid}` })

  try {
    const cart = await cm.getCartById(id)
    res.send(cart)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const cartId = Number(cid)
  const productId = Number(pid)

  const { quantity = 1 } = req.body

  if (!cartId || cartId <= 0) return res.status(400).send({ error: `Invalid cart id: ${cid}` })

  if (!productId || productId <= 0)
    return res.status(400).send({ error: `Invalid product id: ${pid}` })

  try {
    const requiredProduct = await pm.getProductById(productId)

    if (!requiredProduct)
      return res.status(400).send({ error: `Product with id "${productId}" not exist` })

    // if (requiredProduct.stock < quantity)
    //   return res.status(400).send({ error: `Not enough stock for product with id "${productId}"` })

    const cart = await cm.addProductToCart({ cartId, productId, quantity })

    res.json({ message: `Product with id ${productId} was added to cart ${cartId}` })
  } catch (error) {
    return res.status(400).send({ error: error.message })
  }
})

export default cartRouter
