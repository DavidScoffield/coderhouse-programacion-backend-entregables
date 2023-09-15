import CartDTO from '../dto/CartDTO.js'
import { mailService } from '../services/index.js'
import { cartRepository, productRepository } from '../services/repositories/index.js'
import { castToMongoId } from '../utils/casts.utils.js'
import { validateProductArray } from '../utils/validations/carts.validation.util.js'
import { isCommonParamsValid } from '../utils/validations/products.validations.util.js'
import { isEmail } from '../utils/validations/users.validation.util.js'

const createCart = async (req, res) => {
  const cart = await cartRepository.addCart()

  const cartDTO = new CartDTO(cart)
  res.sendSuccessWithPayload({
    message: `Cart with id "${cartDTO.id}" created`,
    payload: { cart: cartDTO },
  })
}

const getCartById = async (req, res, next) => {
  const { cid } = req.params
  const id = castToMongoId(cid)

  const cart = await cartRepository.getCartById(id)

  if (!cart) return res.sendNotFound({ error: `Cart with id "${cid}" not exist` })

  const cartDTO = new CartDTO(cart)

  res.sendSuccessWithPayload({
    message: `Cart with id "${cid}" found`,
    payload: { cart: cartDTO },
  })
}

const addProductToCart = async (req, res, next) => {
  const { cid, pid } = req.params
  const { quantity = 1 } = req.body

  if (!cid || !pid) return res.sendBadRequest({ error: `Missing cart or product id` })

  try {
    const cartId = castToMongoId(cid)
    const productId = castToMongoId(pid)

    // Validate if product exist
    const requiredProduct = await productRepository.getProductById(productId)

    if (!requiredProduct)
      return res.sendBadRequest({ error: `Product with id "${productId}" not exist` })

    // Validate if cart exist
    const requiredCart = await cartRepository.getCartById(cartId)

    if (!requiredCart) return res.sendBadRequest({ error: `Cart with id "${cartId}" not exist` })

    const savedCart = await cartRepository.addProductToCart({
      cart: requiredCart,
      productId,
      quantity,
    })

    res.sendSuccessWithPayload({
      message: `Product with id ${productId} was added to cart ${cartId}`,
      payload: { cart: savedCart },
    })
  } catch (error) {
    next(error)
  }
}

const deleteProductFromCart = async (req, res, next) => {
  const { cid, pid } = req.params

  if (!cid || !pid) return res.sendBadRequest({ error: `Missing cart or product id` })

  try {
    const cartId = castToMongoId(cid)
    const productId = castToMongoId(pid)

    // Validate if cart exist
    const requiredCart = await cartRepository.getCartById(cartId)

    if (!requiredCart) return res.sendBadRequest({ error: `Cart with id "${cartId}" not exist` })

    const updatedCart = await cartRepository.removeProductFromCart({
      cart: requiredCart,
      productId,
    })

    res.sendSuccessWithPayload({
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
    const requiredCart = await cartRepository.getCartById(cartId)

    if (!requiredCart) return res.sendBadRequest({ error: `Cart with id "${cartId}" not exist` })

    // Check if products array is valid, i.e. id's are valid (they are ObjectId) and quantity is valid
    const { valids: productsWithValidTypes, invalids: productsWithInvalidsTypes } =
      validateProductArray(products)

    // Check if the products exist in the database
    const { valids, invalids } = await productsWithValidTypes.reduce(
      async (accPromise, product) => {
        const acc = await accPromise
        const { id } = product
        const productExists = await productRepository.getProductById(id)

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
    const updatedCart = await cartRepository.updateCartWithProducts({
      cartId,
      products: productsToSave,
    })

    res.sendSuccessWithPayload({
      message: `Cart with id ${cartId} was updated`,
      payload: { cart: updatedCart, invalidsProducts: invalids },
    })
  } catch (e) {
    next(e)
  }
}

const updateProductQuantityFromCart = async (req, res, next) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  if (!cid || !pid || quantity === undefined)
    return res.sendBadRequest({ error: `Missing cart, product id or quantity to update` })

  try {
    isCommonParamsValid({ quantity })

    const cartId = castToMongoId(cid)
    const productId = castToMongoId(pid)

    const updatedCart = await cartRepository.updateQuantityOfProductInCart({
      cartId,
      productId,
      quantity,
    })

    if (!updatedCart)
      res.sendBadRequest({
        error: `Product with id "${productId}" not exist in cart`,
      })

    res.sendSuccessWithPayload({
      message: `Product with id ${productId} was updated in cart ${cartId}`,
      payload: { cart: updatedCart },
    })
  } catch (e) {
    next(e)
  }
}

const deleteAllProductsFromCart = async (req, res, next) => {
  const { cid } = req.params

  if (!cid) return res.sendBadRequest({ error: `Missing cart id` })

  try {
    const cartId = castToMongoId(cid)

    // Validate if cart exist
    const requiredCart = await cartRepository.getCartById(cartId)

    if (!requiredCart) return res.sendBadRequest({ error: `Cart with id "${cartId}" not exist` })

    const updatedCart = await cartRepository.removeAllProductFromCart(requiredCart)

    res.sendSuccessWithPayload({
      message: `All products of cart ${cartId} was deleted`,
      payload: { cart: updatedCart },
    })
  } catch (e) {
    next(e)
  }
}

const purchaseCart = async (req, res, next) => {
  const { cid } = req.params
  const { user } = req

  if (!cid) return res.sendBadRequest({ error: `Missing cart id` })

  const cartId = castToMongoId(cid)

  // Validate if cart exist
  const requiredCart = await cartRepository.getCartById(cartId)

  if (!requiredCart) return res.sendBadRequest({ error: `Cart with id "${cartId}" not exist` })

  // Validate if cart has products
  if (requiredCart.products.length === 0) {
    return res.sendBadRequest({ error: `Cart with id "${cartId}" has no products` })
  }

  if (!isEmail(user.email))
    return res.sendBadRequest({
      error: `Your loaded email is not valid. Please update your profile`,
    })

  const { ticket, productIdsWithInvalidStock } = await cartRepository.purchaseCart({
    cartId,
    purchaserEmail: user.email,
  })

  if (!ticket)
    return res.sendBadRequest({
      error: `Cart with id "${cartId}" has no products with valid stock`,
      payload: { productIdsWithInvalidStock },
    })

  mailService.sendPurchasedCartMail({ to: user.email, name: user.name, ticket })

  res.sendSuccessWithPayload({
    message: `Cart with id ${cartId} was purchased`,
    payload: { ticket, productIdsWithInvalidStock },
  })
}

export default {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCartWithProducts,
  updateProductQuantityFromCart,
  deleteAllProductsFromCart,
  purchaseCart,
}
