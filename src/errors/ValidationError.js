export default class ValidationError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ValidationError'
    this.status = status || 422
  }
}
