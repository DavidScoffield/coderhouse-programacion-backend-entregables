export default class TicketDTO {
  constructor({ code, amount, purchaser, purchaseDateTime, id }) {
    this.id = id
    this.code = code
    this.amount = amount
    this.purchaser = purchaser
    this.purchaseDateTime = purchaseDateTime
  }
}
