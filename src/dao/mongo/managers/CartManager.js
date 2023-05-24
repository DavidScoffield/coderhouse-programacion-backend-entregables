import Carts from '../models/Carts.js'

export default class CartManager {
  getCartById = async (id) => Carts.findById(id)

  addCart = async () => Carts.create({})

  save = (cart) => cart.save()

  addProductToCart = async ({ cart, productId, quantity }) => {
    cart.addProduct(productId, quantity)
    return this.save(cart)
  }

  removeProductFromCart = ({ cart, productId }) => {
    cart.removeProduct(productId)
    return this.save(cart)
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
}
