import { Router } from 'express'
import CartManager from '../managers/CartManager.js'

const cartRouter = Router()
const cm = new CartManager()

cartRouter.post('/', async (req, res) => {
  const cart = await cm.addCart()
  res.status(201).json({ message: `Cart with id "${cart.id}" created`, cart })
})

cartRouter.get('/:cid', (req, res) => {})

cartRouter.post('/:cid/product/:pid', (req, res) => {})

export default cartRouter
