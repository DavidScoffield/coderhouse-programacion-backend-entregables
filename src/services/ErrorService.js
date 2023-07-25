import httpStatus from 'http-status'
import EErrors from '../errors/EErrors.js'

export default class ErrorService {
  static createError({
    name = 'DefaultError',
    status = httpStatus.INTERNAL_SERVER_ERROR,
    message = httpStatus[status],
    cause,
    code = EErrors.DEFAULT,
    metaData,
    stack,
  }) {
    const error = new Error(message, { cause })

    error.name = name
    error.code = code
    error.status = status
    error.meta = metaData
    error.stack = stack || error.stack

    throw error
  }

  static createMongoError({
    message,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    code = EErrors.MONGO_ERROR,
    cause,
    stack,
    metaData,
  }) {
    return ErrorService.createError({
      name: 'MongoError',
      cause,
      message,
      code,
      status,
      stack,
      metaData,
    })
  }

  static createValidationError({
    message,
    status = httpStatus.BAD_REQUEST,
    code = EErrors.INVALID_VALUES,
    cause,
    stack,
    metaData,
  }) {
    return ErrorService.createError({
      name: 'ValidationError',
      cause,
      message,
      code,
      status,
      stack,
      metaData,
    })
  }
}
