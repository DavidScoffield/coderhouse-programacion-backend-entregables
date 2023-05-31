import express from 'express'
import { create } from 'express-handlebars'
import session from 'express-session'
import { __src } from '../utils/dirname.utils.js'
import logger from '../utils/logger.utils.js'
import { sessionStore } from './mongodb.config.js'

const app = express()

const PORT = process.env.PORT || 8080
const SECRET_SESSION = process.env.SECRET_SESSION || 'secret'

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

// Listener
const httpServer = app.listen(PORT, () =>
  logger.info(`Server running on port ${PORT} - Access http://localhost:${PORT}`)
)

export { httpServer, app }
