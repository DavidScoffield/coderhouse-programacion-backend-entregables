import CartManager from '../managers/CartManager.js'
import ProductManager from '../managers/ProductManager.js'
import { PATH_OF_CARTS, PATH_OF_PRODUCTS } from './constants.js'

const pm = new ProductManager(PATH_OF_PRODUCTS)
const cm = new CartManager(PATH_OF_CARTS)

export { pm, cm }
