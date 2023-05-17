const ERROR_HANDLERS = {
  CastError: (res, error) => res.status(400).json({ error: 'malformatted id' }),
  ValidationError: (res, error) => res.status(409).json({ error: error.message }),
  // TokenExpiredError: (res, error) => res.status(400).json({ error: error.message }),
  // JsonWebTokenError: (res, error) => res.status(400).json({ error: `JWT error: ${error.message}` }),
  MongoError: (res, error) => res.status(400).json({ error: `Mongo error: ${error.message}` }),
  defaultError: (res) => res.status(500).end(),
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  console.log(`❌ ${err.name}, ${err.message}`)

  const handleError = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError

  return handleError(res, err)
}

export { unknownEndpoint, errorHandler }
