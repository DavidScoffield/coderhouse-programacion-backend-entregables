import logger from '../utils/logger.utils.js'
import { httpCodes } from '../utils/response.utils.js'

const MONGO_SERVER_ERROR_HANDLER = {
  DuplicateKey: (res, error) =>
    res.sendCustomError({
      code: httpCodes.CONFLICT,
      error: `Duplicate key error: ${JSON.stringify(error.keyValue)}`,
    }),

  defaultError: (res, error) =>
    res.sendCustomError({ code: httpCodes.BAD_REQUEST, error: error.message }),
}

const ERROR_HANDLERS = {
  CastError: (res, error) =>
    res.sendCustomError({ code: httpCodes.BAD_REQUEST, error: 'Malformatted ID' }),
  MongoError: (res, error) =>
    res.sendCustomError({ code: httpCodes.BAD_REQUEST, error: `Mongo error: ${error.message}` }),
  MongoServerError: (res, error) =>
    MONGO_SERVER_ERROR_HANDLER[error.codeName](res, error) ||
    MONGO_SERVER_ERROR_HANDLER.defaultError(res, error),
  CustomError: (res, error) => res.sendCustomError({ code: error.status, error: error.message }),
  ValidationError: (res, error) =>
    res.sendCustomError({ code: error.status || httpCodes.CONFLICT, error: error.message }),
  defaultError: (res) => res.sendInternalError("We're sorry, something went wrong"),
}

const unknownEndpoint = (req, res) => {
  res.status(httpCodes.NOT_FOUND).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  logger.error(`❌ ${err.name}, ${err.message}`)

  const handleError = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError

  return handleError(res, err)
}

export { unknownEndpoint, errorHandler }
