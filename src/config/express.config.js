import express from 'express'
import { create } from 'express-handlebars'
import session from 'express-session'
import { __src } from '../utils/dirname.utils.js'
import logger from '../utils/logger.utils.js'
import { sessionStore } from './mongodb.config.js'
import { PORT, SECRET_SESSION } from '../constants/envVars.js'
import initializePassportStrategies from './passport.config.js'
import passport from 'passport'

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__src}/public`))

// Session
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
)

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
app.use(passport.session())

// Listener
const httpServer = app.listen(PORT, () =>
  logger.info(`Server running on port ${PORT} - Access http://localhost:${PORT}`)
)

export { httpServer, app }
