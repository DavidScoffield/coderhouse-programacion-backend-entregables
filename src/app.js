import express from 'express'
import { engine } from 'express-handlebars'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import { PORT } from './constants/constants.js'
import __dirname from './utils/dirname.js'
import viewRouter from './routes/views.router.js'

const app = express()

app.use(express.json())

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)

app.use('/', viewRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
