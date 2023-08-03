import { ALL_USER_ROLES_WITHOUT_ADMIN, PRIVACY_TYPES, USER_ROLES } from '../constants/constants.js'
import cartsController from '../controllers/carts.controller.js'
import BaseRouter from './BaseRouter.js'

export default class CartRouter extends BaseRouter {
  init() {
    this.post('/', [PRIVACY_TYPES.PUBLIC], cartsController.createCart)

    this.get('/:cid', [PRIVACY_TYPES.PUBLIC], cartsController.getCartById)

    this.post(
      '/:cid/products/:pid',
      [ALL_USER_ROLES_WITHOUT_ADMIN],
      cartsController.addProductToCart
    )

    this.delete(
      '/:cid/products/:pid',
      [ALL_USER_ROLES_WITHOUT_ADMIN],
      cartsController.deleteProductFromCart
    )

    this.put('/:cid', [ALL_USER_ROLES_WITHOUT_ADMIN], cartsController.updateCartWithProducts)

    this.put(
      '/:cid/products/:pid',
      [ALL_USER_ROLES_WITHOUT_ADMIN],
      cartsController.updateProductQuantityFromCart
    )

    this.delete('/:cid', [ALL_USER_ROLES_WITHOUT_ADMIN], cartsController.deleteAllProductsFromCart)

    this.put('/:cid/purchase', [ALL_USER_ROLES_WITHOUT_ADMIN], cartsController.purchaseCart)
  }
}
