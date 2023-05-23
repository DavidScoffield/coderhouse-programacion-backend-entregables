import { httpCodes } from '../utils/response.utils.js'

export default class CustomError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'CustomError'
    this.status = status || httpCodes.NOT_FOUND
  }
}
