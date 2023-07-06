import Carts from '../models/Carts.js'

export default class CartManager {
  getCartById = (id, { lean = false } = {}) => Carts.findById(id, null, { lean })

  addCart = () => Carts.create({})

  saveCart = (cart) => cart.save()

  addProductToCart = ({ cart, productId, quantity }) => {
    cart.addProduct(productId, quantity)
    return this.saveCart(cart)
  }

  removeProductFromCart = ({ cart, productId }) => {
    cart.removeProduct(productId)
    return this.saveCart(cart)
  }

  removeAllProductFromCart = (cartId) => {
    return Carts.findByIdAndUpdate(cartId, { products: [] }, { new: true })
  }

  updateQuantityOfProductInCart = ({ cartId, productId, quantity }) => {
    return Carts.findOneAndUpdate(
      { _id: cartId, 'products._id': productId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    )
  }

  updateCartWithProducts = ({ cartId, products }) => {
    return Carts.findByIdAndUpdate(cartId, { products }, { new: true }).lean()
  }
}
