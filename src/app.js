import express from 'express'
import { engine } from 'express-handlebars'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import { PORT } from './constants/constants.js'
import __dirname from './utils/dirname.js'
import viewRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import socketIo from './socket.io.js'

const app = express()
const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Middlewares
app.use(express.json())

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

// Socket.io
const io = socketIo(httpServer)

export { io }
