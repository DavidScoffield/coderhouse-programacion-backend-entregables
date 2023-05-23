import { PM } from '../constants/singletons.js'

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
    res.status(503).send(healthcheck)
  }
}

export default { check }
