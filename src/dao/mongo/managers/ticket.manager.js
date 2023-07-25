import { tryCatchWrapperMongo } from '../../../errors/handlers/mongoError.handler.js'
import Tickets from '../models/Tickets.js'

export default class TicketManager {
  addTicket = tryCatchWrapperMongo(async ({ code, amount, purchaser, purchaseDateTime }) => {
    const ticket = new Tickets({
      code,
      amount,
      purchaser,
      purchaseDateTime,
    })
    return ticket.save()
  })
}
