import { PM } from '../constants/singletons.js'
import { httpCodes } from '../utils/response.utils.js'

const check = (req, res) => {
  const healthcheck = {
    message: 'OK',
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    timestamp: Date.now(),
  }
  try {
    res.send(healthcheck)
  } catch (error) {
    healthcheck.message = error
    res.status(httpCodes.SERVICE_UNAVAILABLE).send(healthcheck)
  }
}

export default { check }
