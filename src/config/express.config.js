import express from 'express'
import { create } from 'express-handlebars'
import passport from 'passport'
import { PORT } from '../constants/envVars.js'
import { __src } from '../utils/dirname.utils.js'
import logger from '../utils/logger.utils.js'
import initializePassportStrategies from './passport.config.js'
import cookieParser from 'cookie-parser'

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__src}/public`))
app.use(cookieParser())

// Handlebars
const hbs = create({
  helpers: {
    equal: (a, b) => a === b,
  },
})

app.engine('handlebars', hbs.engine)

app.set('view engine', 'handlebars')
app.set('views', `${__src}/views`)

// Passport
initializePassportStrategies()
app.use(passport.initialize())

// Listener
const httpServer = app.listen(PORT, () =>
  logger.info(`Server running on port ${PORT} - Access http://localhost:${PORT}`)
)

export { app, httpServer }
