import { Router } from 'express'
import CartManager from '../managers/CartManager.js'
import { PATH_OF_CARTS } from '../constants/constants.js'

const cartRouter = Router()
const cm = new CartManager(PATH_OF_CARTS)

cartRouter.post('/', async (req, res) => {
  const cart = await cm.addCart()
  res.status(201).json({ message: `Cart with id "${cart.id}" created` })
})

cartRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params
  const id = Number(cid)

  if (!id || id <= 0) return res.status(400).send({ error: `Invalid id: ${cid}` })

  try {
    const cart = await cm.getCartById(id)
    res.send(cart)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {})

export default cartRouter
