import { Router } from 'express'
import cartsController from '../controllers/carts.controller.js'

const cartRouter = Router()

cartRouter.post('/', cartsController.createCart)

cartRouter.get('/:cid', cartsController.getCartById)

cartRouter.post('/:cid/product/:pid', cartsController.addProductToCart)

export default cartRouter
