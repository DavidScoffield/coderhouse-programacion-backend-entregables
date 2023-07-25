import { tryCatchWrapperMongo } from '../../../errors/handlers/mongoError.handler.js'
import Carts from '../models/Carts.js'

export default class CartManager {
  getCartById = tryCatchWrapperMongo(async (id, { lean = false } = {}) => {
    return Carts.findById(id, null, { lean })
  })

  addCart = tryCatchWrapperMongo(async () => {
    return Carts.create({})
  })

  saveCart = tryCatchWrapperMongo(async (cart) => {
    return cart.save()
  })

  addProductToCart = tryCatchWrapperMongo(async ({ cart, productId, quantity }) => {
    cart.addProduct(productId, quantity)
    return this.saveCart(cart)
  })

  removeProductFromCart = tryCatchWrapperMongo(async ({ cart, productId }) => {
    cart.removeProduct(productId)
    return this.saveCart(cart)
  })

  removeAllProductFromCart = tryCatchWrapperMongo(async (cartId) => {
    return Carts.findByIdAndUpdate(cartId, { products: [] }, { new: true })
  })

  updateQuantityOfProductInCart = tryCatchWrapperMongo(async ({ cartId, productId, quantity }) => {
    return Carts.findOneAndUpdate(
      { _id: cartId, 'products._id': productId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    )
  })

  updateCartWithProducts = tryCatchWrapperMongo(async ({ cartId, products }) => {
    return Carts.findByIdAndUpdate(cartId, { products }, { new: true }).lean()
  })
}
