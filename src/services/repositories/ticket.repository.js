import { generateCodeString } from '../../utils/random.js'

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTicket = ({ amount, purchaser }) => {
    const code = generateCodeString()

    const purchaseDateTime = new Date()

    return this.dao.addTicket({ code, amount, purchaser, purchaseDateTime })
  }
}
