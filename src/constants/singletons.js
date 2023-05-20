import ProductManager from '../dao/mongo/managers/ProductManager.js'
import CartManager from '../dao/mongo/managers/CartManager.js'
import MessageManager from '../dao/mongo/Managers/message.manager.js'
// import ProductManager from '../dao/fileSystem/managers/ProductManager.js'
// import CartManager from '../dao/fileSystem/managers/CartManager.js'
// import { PATH_OF_CARTS, PATH_OF_PRODUCTS } from './constants.js'

// const pm = new ProductManager(PATH_OF_PRODUCTS)
// const cm = new CartManager(PATH_OF_CARTS)

const PM = new ProductManager()
const CM = new CartManager()
const MM = new MessageManager()

export { PM, CM, MM }
