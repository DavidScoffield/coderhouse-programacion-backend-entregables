import httpStatus from 'http-status'
import LoggerService from '../services/logger.service.js'
import { httpStatusResponse } from '../utils/response.utils.js'

const unknownEndpoint = (req, res) => {
  res.status(httpStatus.NOT_FOUND).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  LoggerService.error(
    `${err.name}, ${err.message}`,
    `StackTrace: ${err.stack}`,
    `Cause: ${err.cause}`
  )

  res.status(err.status).json({ status: httpStatusResponse.ERROR, error: err.message })
}

export { errorHandler, unknownEndpoint }
