import './config/env.config.js'
import './config/io.config.js'
import './config/mongodb.config.js'

import { app } from './config/express.config.js'

// Routers
import {
  cartRouter,
  healthcheckRouter,
  productRouter,
  sessionRouter,
  viewRouter,
  mockingProductsRouter,
  loggerRouter,
} from './routes/index.js'

import { errorHandler, unknownEndpoint } from './controllers/extrasHandlers.controller.js'
import ioMiddleware from './middlewares/io.middleware.js'

// Middlewares
app.use(ioMiddleware)

// Routes
app.use('/', viewRouter)
app.use('/healthcheck', healthcheckRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionRouter)
app.use('/mockingproducts', mockingProductsRouter)
app.use('/loggerTest', loggerRouter)

// Route unknown
app.use(unknownEndpoint)
// Error handler
app.use(errorHandler)
