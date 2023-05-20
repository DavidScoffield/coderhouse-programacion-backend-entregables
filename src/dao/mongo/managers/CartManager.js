import Carts from '../models/Carts.js'

export default class CartManager {
  getCartById = async (id) => {
    return Carts.findById(id)
  }

  addCart = async () => {
    return Carts.create({})
  }

  save = async (cart) => (await cart.save()).populate('products._id')
}
