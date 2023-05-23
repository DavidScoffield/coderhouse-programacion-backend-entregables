import { io } from '../config/io.config.js'

const middleware = (req, res, next) => {
  req.io = io
  next()
}

export default middleware
