import httpStatus from 'http-status'
import ErrorService from '../services/ErrorService.js'

const check = (req, res) => {
  const healthcheck = {
    message: 'OK',
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    timestamp: Date.now(),
  }
  try {
    res.sendSuccessWithPayload({ payload: healthcheck })
  } catch (error) {
    healthcheck.message = error.message || error.toString()

    ErrorService.createError({
      message: healthcheck,
      name: 'Healthcheck Error',
      status: httpStatus.SERVICE_UNAVAILABLE,
      metaData: { healthcheck },
    })
  }
}

export default { check }
