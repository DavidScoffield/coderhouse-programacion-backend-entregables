import CartManager from '../dao/mongo/managers/cart.manager.js'
import UserManager from '../dao/mongo/managers/user.manager.js'
import MessageManager from '../dao/mongo/managers/message.manager.js'
import ProductManager from '../dao/mongo/managers/product.manager.js'

import CartRepository from './cart.repository.js'
import UserRepository from './user.repository.js'
import ProductRepository from './product.repository.js'
import MessageRepository from './message.repository.js'

export const userRepository = new UserRepository(new UserManager())
export const cartRepository = new CartRepository(new CartManager())
export const messageRepository = new MessageRepository(new MessageManager())
export const productRepository = new ProductRepository(new ProductManager())
