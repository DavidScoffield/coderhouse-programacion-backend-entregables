import logger from '../utils/logger.utils.js'

const MONGO_SERVER_ERROR_HANDLER = {
  DuplicateKey: (res, error) =>
    res.status(409).json({ error: `Duplicate key error: ${JSON.stringify(error.keyValue)}` }),
  defaultError: (res) => res.status(400).json({ error: error.menssage }),
}

const ERROR_HANDLERS = {
  CastError: (res, error) => res.status(400).json({ error: 'Malformatted ID' }),
  ValidationError: (res, error) => res.status(409).json({ error: error.message }),
  MongoError: (res, error) => res.status(400).json({ error: `Mongo error: ${error.message}` }),
  MongoServerError: (res, error) =>
    MONGO_SERVER_ERROR_HANDLER[error.codeName](res, error) ||
    MONGO_SERVER_ERROR_HANDLER.defaultError(res, error),
  CustomError: (res, error) => res.status(error.status).json({ error: error.message }),
  ValidationError: (res, error) => res.status(error.status).json({ error: error.message }),
  defaultError: (res) => res.status(500).end(),
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
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
