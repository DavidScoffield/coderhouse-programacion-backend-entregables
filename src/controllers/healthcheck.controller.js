import httpStatus from 'http-status'

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
    res.sendCustomError({ code: httpStatus.SERVICE_UNAVAILABLE, error: healthcheck })
  }
}

export default { check }
