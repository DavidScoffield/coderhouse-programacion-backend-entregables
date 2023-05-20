import Message from '../models/Messages.js'

export default class MessageManager {
  getMessages = (params) => Message.find(params).lean()

  createMessage = (message) => Message.create(message)
}
