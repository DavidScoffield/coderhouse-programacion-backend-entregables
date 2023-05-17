import { Router } from 'express'
import { cm, pm } from '../constants/singletons.js'
import cartsController from '../controllers/carts.controller.js'

const cartRouter = Router()

cartRouter.post('/', cartsController.getCarts)

cartRouter.get('/:cid', cartsController.getCartById)

cartRouter.post('/:cid/product/:pid', cartsController.addProductToCart)

export default cartRouter
