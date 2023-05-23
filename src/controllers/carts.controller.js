import { CM, PM } from '../constants/singletons.js'
import { castToMongoId } from '../utils/casts.utils.js'

const createCart = async (req, res) => {
  const cart = await CM.addCart()
  res.status(201).json({ message: `Cart with id "${cart.id}" created`, payload: { cart } })
}

const getCartById = async (req, res) => {
  const { cid } = req.params
  try {
    const id = castToMongoId(cid)

    const cart = await CM.getCartById(id)

    if (!cart) return res.status(404).send({ error: `Cart with id "${cid}" not exist` })

    res.json(cart)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const addProductToCart = async (req, res, next) => {
  const { cid, pid } = req.params
  const { quantity = 1 } = req.body

  if (!cid || !pid) return res.status(400).send({ error: `Missing cart or product id` })

  try {
    const cartId = castToMongoId(cid)
    const productId = castToMongoId(pid)

    // Validate if product exist
    const requiredProduct = await PM.getProductById(productId)

    if (!requiredProduct)
      return res.status(400).send({ error: `Product with id "${productId}" not exist` })

    // Validate if cart exist
    const requiredCart = await CM.getCartById(cartId)

    if (!requiredCart) return res.status(400).send({ error: `Cart with id "${cartId}" not exist` })

    // if (requiredProduct.stock < quantity)
    //   return res.status(400).send({ error: `Not enough stock for product with id "${productId}"` })

    const existingProductIndex = requiredCart.products.findIndex(
      (product) => product._id.toString() === productId.toString()
    )

    if (existingProductIndex !== -1) {
      requiredCart.products[existingProductIndex].quantity += quantity
    } else {
      requiredCart.products.push({ _id: productId, quantity })
    }

    const savedCart = await CM.save(requiredCart)

    res.json({
      message: `Product with id ${productId} was added to cart ${cartId}`,
      payload: { cart: savedCart },
    })
  } catch (error) {
    next(error)
  }
}

export default {
  createCart,
  getCartById,
  addProductToCart,
}
