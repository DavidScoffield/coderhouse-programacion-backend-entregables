import express from 'express'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import { PORT } from './constants/constants.js'

const app = express()

app.use(express.json())

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
