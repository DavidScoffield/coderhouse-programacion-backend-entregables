import { MM } from '../constants/singletons.js'

const registerChatHandler = (io, socket) => {
  const saveMessage = async (message) => {
    await MM.createMessage(message)
    const messageLogs = await MM.getMessages()
    io.emit('chat:messageLogs', messageLogs)
  }

  const newParticipant = async (user) => {
    socket.broadcast.emit('chat:newConnection', user)
    socket.emit('chat:messageLogs', await MM.getMessages())
  }

  socket.on('chat:message', saveMessage)
  socket.on('chat:newParticipant', newParticipant)
}

export default registerChatHandler
