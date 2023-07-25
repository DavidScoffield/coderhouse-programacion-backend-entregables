import httpStatus from 'http-status'
import { httpStatusResponse } from '../utils/response.utils.js'
import logger from '../utils/logger.utils.js'

const unknownEndpoint = (req, res) => {
  res.status(httpStatus.NOT_FOUND).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  logger.error(`${err.name}, ${err.message}`, `StackTrace: ${err.stack}`, `Cause: ${err.cause}`)

  res.status(err.status).json({ status: httpStatusResponse.ERROR, error: err.message })
}

export { unknownEndpoint, errorHandler }
