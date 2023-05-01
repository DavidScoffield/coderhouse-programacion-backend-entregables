import express from 'express'
import { engine } from 'express-handlebars'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import { PORT } from './constants/constants.js'
import __dirname from './utils/dirname.js'
import viewRouter from './routes/views.router.js'
import socketIo from './socket.io.js'

const app = express()
const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} - Access http://localhost:${PORT}`)
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
