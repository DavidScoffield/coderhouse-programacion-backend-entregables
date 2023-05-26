import { CM, PM } from '../constants/singletons.js'
import { castToMongoId } from '../utils/casts.utils.js'
import { httpCodes, httpStatus } from '../utils/response.utils.js'
import { validateProductArray } from '../utils/validations/carts.validation.util.js'
import { isCommonParamsValid } from '../utils/validations/products.validations.util.js'

const createCart = async (req, res) => {
  const cart = await CM.addCart()
  res.status(201).json({ message: `Cart with id "${cart.id}" created`, payload: { cart } })
}

const getCartById = async (req, res) => {
  const { cid } = req.params
  try {
    const id = castToMongoId(cid)

    const cart = await CM.getCartById(id)

    if (!cart)
      return res.status(httpCodes.NOT_FOUND).send({ error: `Cart with id "${cid}" not exist` })

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

    const savedCart = await CM.addProductToCart({ cart: requiredCart, productId, quantity })

    res.json({
      message: `Product with id ${productId} was added to cart ${cartId}`,
      payload: { cart: savedCart },
    })
  } catch (error) {
    next(error)
  }
}

const deleteProductFromCart = async (req, res, next) => {
  const { cid, pid } = req.params

  if (!cid || !pid)
    return res.status(httpCodes.BAD_REQUEST).send({ error: `Missing cart or product id` })

  try {
    const cartId = castToMongoId(cid)
    const productId = castToMongoId(pid)

    // Validate if cart exist
    const requiredCart = await CM.getCartById(cartId)

    if (!requiredCart) return res.status(400).send({ error: `Cart with id "${cartId}" not exist` })

    const updatedCart = await CM.removeProductFromCart({ cart: requiredCart, productId })

    res.json({
      status: httpStatus.SUCCESS,
      message: `Product with id ${productId} was deleted from cart ${cartId}`,
      payload: { cart: updatedCart },
    })
  } catch (e) {
    next(e)
  }
}

const updateCartWithProducts = async (req, res, next) => {
  const { cid } = req.params
  const { products } = req.body

  try {
    // Validate if cart exist
    const cartId = castToMongoId(cid)
    const requiredCart = await CM.getCartById(cartId)

    if (!requiredCart)
      return res.status(httpCodes.BAD_REQUEST).send({ error: `Cart with id "${cartId}" not exist` })

    // Check if products array is valid, i.e. id's are valid (they are ObjectId) and quantity is valid
    const { valids: productsWithValidTypes, invalids: productsWithInvalidsTypes } =
      validateProductArray(products)

    // Check if the products exist in the database
    const { valids, invalids } = await productsWithValidTypes.reduce(
      async (accPromise, product) => {
        const acc = await accPromise
        const { id } = product
        const productExists = await PM.getProductById(id)

        if (!productExists) {
          product.reason = `Product with id "${id}" not exist`
          acc.invalids.push(product)
        } else {
          acc.valids.push(product)
        }
        return acc
      },
      { valids: [], invalids: [...productsWithInvalidsTypes] }
    )

    // Map the products to the required format
    const productsToSave = valids.map(({ id, quantity }) => ({ _id: id, quantity }))

    // Update cart with the complete array of products
    const updatedCart = await CM.updateCartWithProducts({ cartId, products: productsToSave })

    // Create response
    const response = {
      status: httpStatus.SUCCESS,
      message: `Cart with id ${cartId} was updated`,
      payload: { cart: updatedCart, invalidsProducts: invalids },
    }

    res.json(response)
  } catch (e) {
    next(e)
  }
}

const updateProductQuantityFromCart = async (req, res, next) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  if (!cid || !pid || quantity === undefined)
    return res
      .status(httpCodes.BAD_REQUEST)
      .send({ error: `Missing cart, product id or quantity to update` })

  try {
    const isValid = isCommonParamsValid({ quantity })

    const cartId = castToMongoId(cid)
    const productId = castToMongoId(pid)

    const updatedCart = await CM.updateQuantityOfProductInCart({ cartId, productId, quantity })

    if (!updatedCart)
      res.status(httpCodes.BAD_REQUEST).send({
        status: httpStatus.ERROR,
        error: `Product with id "${productId}" not exist in cart`,
      })

    res.json({
      status: httpStatus.SUCCESS,
      message: `Product with id ${productId} was updated in cart ${cartId}`,
      payload: { cart: updatedCart },
    })
  } catch (e) {
    next(e)
  }
}

const deleteAllProductsFromCart = async (req, res, next) => {
  const { cid } = req.params

  if (!cid) return res.status(httpCodes.BAD_REQUEST).send({ error: `Missing cart id` })

  try {
    const cartId = castToMongoId(cid)

    // Validate if cart exist
    const requiredCart = await CM.getCartById(cartId)

    if (!requiredCart) return res.status(400).send({ error: `Cart with id "${cartId}" not exist` })

    const updatedCart = await CM.removeAllProductFromCart(requiredCart)

    res.json({
      status: httpStatus.SUCCESS,
      message: `All products of cart ${cartId} was deleted`,
      payload: { cart: updatedCart },
    })
  } catch (e) {
    next(e)
  }
}

export default {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCartWithProducts,
  updateProductQuantityFromCart,
  deleteAllProductsFromCart,
}
