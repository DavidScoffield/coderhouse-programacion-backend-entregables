import Tickets from '../models/Tickets.js'

export default class TicketManager {
  addTicket = ({ code, amount, purchaser, purchaseDateTime }) => {
    const ticket = new Tickets({
      code,
      amount,
      purchaser,
      purchaseDateTime,
    })
    return ticket.save()
  }
}
