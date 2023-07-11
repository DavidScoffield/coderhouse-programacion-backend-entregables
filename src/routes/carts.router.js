import { PRIVACY_TYPES, USER_ROLES } from '../constants/constants.js'
import cartsController from '../controllers/carts.controller.js'
import BaseRouter from './BaseRouter.js'

export default class CartRouter extends BaseRouter {
  init() {
    this.post('/', [PRIVACY_TYPES.PUBLIC], cartsController.createCart)

    this.get('/:cid', [PRIVACY_TYPES.PUBLIC], cartsController.getCartById)

    this.post('/:cid/products/:pid', [USER_ROLES.USER], cartsController.addProductToCart)

    this.delete(
      '/:cid/products/:pid',
      [PRIVACY_TYPES.PUBLIC],
      cartsController.deleteProductFromCart
    )

    this.put('/:cid', [PRIVACY_TYPES.PUBLIC], cartsController.updateCartWithProducts)

    this.put(
      '/:cid/products/:pid',
      [PRIVACY_TYPES.PUBLIC],
      cartsController.updateProductQuantityFromCart
    )

    this.delete('/:cid', [PRIVACY_TYPES.PUBLIC], cartsController.deleteAllProductsFromCart)

    this.put('/:cid/purchase', [USER_ROLES.USER], cartsController.purchaseCart)
  }
}
