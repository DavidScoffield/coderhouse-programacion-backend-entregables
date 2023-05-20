import Carts from '../models/Carts.js'

export default class CartManager {
  getCartById = async (id) => Carts.findById(id)

  addCart = async () => Carts.create({})

  save = (cart) => cart.save()

  saveAndPopulate = async (cart) => (await cart.save()).populate('products._id')
}
