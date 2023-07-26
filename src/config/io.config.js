import { Server } from 'socket.io'
import { httpServer } from './express.config.js'

import registerChatHandler from '../listeners/chatHandler.listener.js'
import registerRealTimeProductsHandler from '../listeners/realTimeProducts.listener.js'
import LoggerService from '../services/logger.service.js'

// Socket.io
const io = new Server(httpServer)

io.on('connection', (socket) => {
  LoggerService.info('New connection: ' + socket.id)

  registerRealTimeProductsHandler(io, socket)
  registerChatHandler(io, socket)
})

export { io }
