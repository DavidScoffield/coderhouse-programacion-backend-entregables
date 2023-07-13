import getPersistences from '../../dao/factory.js'

import CartRepository from './cart.repository.js'
import UserRepository from './user.repository.js'
import ProductRepository from './product.repository.js'
import MessageRepository from './message.repository.js'
import TicketRepository from './ticket.repository.js'
import TicketManager from '../../dao/mongo/managers/ticket.manager.js'

const { CartManager, ProductManager, MessageManager, UserManager } = await getPersistences()

export const userRepository = new UserRepository(new UserManager())
export const cartRepository = new CartRepository(new CartManager())
export const messageRepository = new MessageRepository(new MessageManager())
export const productRepository = new ProductRepository(new ProductManager())
export const ticketRepository = new TicketRepository(new TicketManager())
