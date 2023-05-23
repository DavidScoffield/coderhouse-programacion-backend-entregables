import express from 'express'
import { engine } from 'express-handlebars'
import { __src } from '../utils/dirname.js'
import logger from '../utils/logger.js'

const app = express()

const PORT = process.env.PORT || 8080

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__src}/public`))

// Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', `${__src}/views`)

// Listener
const httpServer = app.listen(PORT, () =>
  logger.info(`Server running on port ${PORT} - Access http://localhost:${PORT}`)
)

export { httpServer, app }
