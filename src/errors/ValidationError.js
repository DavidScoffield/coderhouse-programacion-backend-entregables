import { httpCodes } from '../utils/response.utils.js'

export default class ValidationError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ValidationError'
    this.status = status || httpCodes.BAD_REQUEST
  }
}
