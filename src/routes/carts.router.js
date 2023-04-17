import { Router } from 'express'

const cartRouter = Router()

cartRouter.get('/', (req, res) => {
  res.json({ message: 'Hello from cart' })
})

export default cartRouter
