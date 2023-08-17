import './config/env.config.js'
import './config/io.config.js'
import './config/mongodb.config.js'

import { app } from './config/express.config.js'

// Routers
import {
  cartRouter,
  healthcheckRouter,
  loggerRouter,
  mockingProductsRouter,
  productRouter,
  sessionRouter,
  userRouter,
  viewRouter,
} from './routes/index.js'

import { errorHandler, unknownEndpoint } from './controllers/extrasHandlers.controller.js'
import ioMiddleware from './middlewares/io.middleware.js'

import swaggerUiExpress from 'swagger-ui-express'
import { swaggerOptions, swaggerSpecs, swaggerUiOptions } from './config/swagger.config.js'

// Middlewares
app.use(ioMiddleware)

// Routes
app.use('/', viewRouter)
app.use('/healthcheck', healthcheckRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/users', userRouter)
app.use('/mockingproducts', mockingProductsRouter)
app.use('/loggerTest', loggerRouter)
app.use(
  '/apiDocs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpecs, swaggerUiOptions, swaggerOptions)
)

// Route unknown
app.use(unknownEndpoint)
// Error handler
app.use(errorHandler)
