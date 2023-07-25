import { tryCatchWrapperMongo } from '../../../errors/handlers/mongoError.handler.js'
import Message from '../models/Messages.js'

export default class MessageManager {
  getMessages = tryCatchWrapperMongo(async (params) => Message.find(params).lean())

  createMessage = tryCatchWrapperMongo(async (message) => Message.create(message))
}
