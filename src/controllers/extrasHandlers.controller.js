import httpStatus from 'http-status'
import { httpStatusResponse } from '../utils/response.utils.js'
import logger from '../utils/logger.utils.js'

const MONGO_SERVER_ERROR_HANDLER = {
  DuplicateKey: (res, error) =>
    res.sendCustomError({
      code: httpStatus.CONFLICT,
      error: `Duplicate key error: ${JSON.stringify(error.keyValue)}`,
    }),

  defaultError: (res, error) =>
    res.sendCustomError({ code: httpStatus.BAD_REQUEST, error: error.message }),
}

const ERROR_HANDLERS = {
  CastError: (res, error) =>
    res.sendCustomError({ code: httpStatus.BAD_REQUEST, error: 'Malformatted ID' }),
  MongoError: (res, error) =>
    res.sendCustomError({ code: httpStatus.BAD_REQUEST, error: `Mongo error: ${error.message}` }),
  MongoServerError: (res, error) =>
    MONGO_SERVER_ERROR_HANDLER[error.codeName](res, error) ||
    MONGO_SERVER_ERROR_HANDLER.defaultError(res, error),
  CustomError: (res, error) => res.sendCustomError({ code: error.status, error: error.message }),
  ValidationError: (res, error) =>
    res.sendCustomError({ code: error.status || httpStatus.CONFLICT, error: error.message }),
  defaultError: (res) => res.sendInternalError({ error: "We're sorry, something went wrong" }),
}

const unknownEndpoint = (req, res) => {
  res.status(httpStatus.NOT_FOUND).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  logger.error(`${err.name}, ${err.message}`, `StackTrace: ${err.stack}`, `Cause: ${err.cause}`)

  // const handleError = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError

  // return handleError(res, err)
  // try {
  //   return res.sendCustomError({ code: err.status, error: err.message })
  // } catch (err) {
  //   console.log(err)
  //   return res.send({ error: "We're sorry, something went wrong" })
  // }
  res.status(err.status).json({ status: httpStatusResponse.ERROR, error: err.message })
}

export { unknownEndpoint, errorHandler }
