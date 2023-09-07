import cookieParser from 'cookie-parser'
import express from 'express'
import { create } from 'express-handlebars'
import passport from 'passport'
import serveFavicon from 'serve-favicon'
import { MULTER_PATH_FOLDER, USER_ROLES } from '../constants/constants.js'
import { HOST, PORT } from '../constants/envVars.js'
import LoggerService from '../services/logger.service.js'
import { __src } from '../utils/dirname.utils.js'
import initializePassportStrategies from './passport.config.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__src}/public`))
app.use('/uploads', express.static(MULTER_PATH_FOLDER))
app.use(cookieParser())
app.use(serveFavicon(`${__src}/public/assets/favicon.ico`))

// Handlebars
const hbs = create({
  helpers: {
    equal: (a, b) => a === b,
    notEqual: (a, b) => a !== b,
    json: (n) => JSON.stringify(n),
    isAdmin: (role) => role === USER_ROLES.ADMIN,
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
  LoggerService.info(`Server running on port ${PORT} - Access ${HOST}:${PORT}`)
)

export { app, httpServer }
