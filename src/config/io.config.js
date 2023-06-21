import { Server } from 'socket.io'
import { httpServer } from './express.config.js'

import registerChatHandler from '../listeners/chatHandler.listener.js'
import registerRealTimeProductsHandler from '../listeners/realTimeProducts.listener.js'
import logger from '../utils/logger.utils.js'

// Socket.io
const io = new Server(httpServer)

io.on('connection', (socket) => {
  logger.info('New connection: ' + socket.id)

  registerRealTimeProductsHandler(io, socket)
  registerChatHandler(io, socket)
})

export { io }
