import { Router } from 'express'
import cartsController from '../controllers/carts.controller.js'

const cartRouter = Router()

cartRouter.post('/', cartsController.createCart)

cartRouter.get('/:cid', cartsController.getCartById)

cartRouter.post('/:cid/products/:pid', cartsController.addProductToCart)

cartRouter.delete('/:cid/products/:pid', cartsController.deleteProductFromCart)

cartRouter.put('/:cid', cartsController.updateCartWithProducts)

cartRouter.put('/:cid/products/:pid', cartsController.updateProductQuantityFromCart)

cartRouter.delete('/:cid', cartsController.deleteAllProductsFromCart)

export default cartRouter
