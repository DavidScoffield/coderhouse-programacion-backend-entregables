import httpStatus from 'http-status'
import ErrorService from '../../services/ErrorService.js'

const MONGO_SERVER_ERROR_HANDLER = {
  DuplicateKey: (error) => {
    return {
      status: httpStatus.CONFLICT,
      message: `Duplicate key error: ${JSON.stringify(error.keyValue)}`,
    }
  },
  defaultError: (error) => {
    return {
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }
  },
}

const MONGO_ERROR_HANDLERS = {
  CastError: () => {
    return {
      status: httpStatus.BAD_REQUEST,
      message: 'Malformatted ID',
    }
  },
  MongoError: (error) => {
    return {
      status: httpStatus.BAD_REQUEST,
      message: `Mongo error: ${error.message}`,
    }
  },
  MongoServerError: (error) => {
    const fn =
      MONGO_SERVER_ERROR_HANDLER[error.codeName](error) ||
      MONGO_SERVER_ERROR_HANDLER.defaultError(error)

    return fn()
  },
  ValidationError: (error) => {
    const errors = Object.keys({ ...error }.errors)
    const metaData = { errors }

    return {
      status: httpStatus.CONFLICT,
      message: error.message,
      metaData,
    }
  },
  defaultError: (res) => {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "We're sorry, something went wrong",
    }
  },
}

export const mongoErrorHandler = (err) => {
  const handleError = MONGO_ERROR_HANDLERS[err.name] || MONGO_ERROR_HANDLERS.defaultError

  const { status, message, metaData } = handleError(err)

  ErrorService.createMongoError({
    message,
    status,
    metaData,
    // stack: err.stack,
  })
}

// Función de utilidad para envolver un método en un bloque try-catch
export function tryCatchWrapperMongo(method) {
  return async function (...args) {
    try {
      return await method.apply(this, args)
    } catch (error) {
      mongoErrorHandler(error)
    }
  }
}
