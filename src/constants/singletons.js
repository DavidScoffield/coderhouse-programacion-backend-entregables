import ProductManager from '../dao/mongo/managers/ProductManager.js'
import CartManager from '../dao/mongo/managers/CartManager.js'
import MessageManager from '../dao/mongo/managers/message.manager.js'
import UserManager from '../dao/mongo/managers/user.manager.js'

const PM = new ProductManager()
const CM = new CartManager()
const MM = new MessageManager()
const UM = new UserManager()

export { PM, CM, MM, UM }
