import './config/env.config.js'
import './config/io.config.js'
import './config/mongodb.config.js'

import { app } from './config/express.config.js'

// Routers
import cartRouter from './routes/carts.router.js'
import productRouter from './routes/products.router.js'
import viewRouter from './routes/views.router.js'

import { errorHandler, unknownEndpoint } from './controllers/extrasHandlers.controller.js'
import ioMiddleware from './middlewares/io.middleware.js'

// Middlewares
app.use(ioMiddleware)

// Routes
app.use('/', viewRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

// Route unknown
app.use(unknownEndpoint)
// Error handler
app.use(errorHandler)
