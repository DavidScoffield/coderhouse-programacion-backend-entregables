import { messageRepository } from '../services/repositories/index.js'

const registerChatHandler = (io, socket) => {
  const saveMessage = async (message) => {
    await messageRepository.createMessage(message)
    const messageLogs = await messageRepository.getMessages()
    io.emit('chat:messageLogs', messageLogs)
  }

  const newParticipant = async (user) => {
    socket.broadcast.emit('chat:newConnection', user)
    socket.emit('chat:messageLogs', await messageRepository.getMessages())
  }

  socket.on('chat:message', saveMessage)
  socket.on('chat:newParticipant', newParticipant)
}

export default registerChatHandler
