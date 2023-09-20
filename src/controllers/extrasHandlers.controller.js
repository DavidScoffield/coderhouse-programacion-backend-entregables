import httpStatus from 'http-status'
import LoggerService from '../services/logger.service.js'
import { httpStatusResponse } from '../utils/response.utils.js'

const unknownEndpoint = (req, res) => {
  LoggerService.error(`Unknown endpoint: ${req.method} ${req.originalUrl}`)

  if (req.isBrowser) {
    res.render('404', {
      title: '404',
      css: ['404'],
    })
  } else {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ status: httpStatusResponse.ERROR, error: 'unknown endpoint' })
  }
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
