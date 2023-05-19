import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'

import cartRouter from './routes/carts.router.js'
import productRouter from './routes/products.router.js'
import viewRouter from './routes/views.router.js'
import socketIo from './socket.io.js'

import { errorHandler, unknownEndpoint } from './controllers/extrasHandlers.controller.js'
import config from './utils/config.js'
import __dirname from './utils/dirname.js'
import logger from './utils/logger.js'

// Connection at the DB
logger.info('🔎🔎 connecting to', config.MONGO_URI)
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info('✅️✅️ Connections to database succefully')
  })
  .catch((err) => {
    logger.info('❌ error connecting to MongoDB:', err.message)
  })

const app = express()
const httpServer = app.listen(config.PORT, () =>
  console.log(`Server running on port ${config.PORT} - Access http://localhost:${config.PORT}`)
)

// Socket.io
const io = socketIo(httpServer)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  req.io = io
  next()
})

// Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)

// Static folder
app.use(express.static(`${__dirname}/public`))

// Routes
app.use('/', viewRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

// Route unknown
app.use(unknownEndpoint)
// Error handler
app.use(errorHandler)
