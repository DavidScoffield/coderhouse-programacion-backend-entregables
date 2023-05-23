import Carts from '../models/Carts.js'

export default class CartManager {
  getCartById = async (id) => Carts.findById(id)

  addCart = async () => Carts.create({})

  save = (cart) => cart.save()
}
