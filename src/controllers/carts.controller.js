import { cm } from '../constants/singletons.js'
import { castToMongoId } from '../utils/casts.js'

const createCart = async (req, res) => {
  const cart = await cm.addCart()
  res.status(201).json({ message: `Cart with id "${cart.id}" created`, payload: { cart } })
}

const getCartById = async (req, res) => {
  const { cid } = req.params
  try {
    const id = castToMongoId(cid)

    const cart = await cm.getCartById(id)

    if (!cart) return res.status(404).send({ error: `Cart with id "${cid}" not exist` })

    res.json(cart)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const addProductToCart = async (req, res) => {
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
}

export default {
  createCart,
  getCartById,
  addProductToCart,
}
