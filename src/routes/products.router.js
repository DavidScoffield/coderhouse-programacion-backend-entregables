import { PRIVACY_TYPES, USER_ROLES } from '../constants/constants.js'
import productsController from '../controllers/products.controller.js'

import BaseRouter from './BaseRouter.js'

export default class ProductRouter extends BaseRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PUBLIC], productsController.getProducts)

    this.get('/:pid', [PRIVACY_TYPES.PUBLIC], productsController.getProductById)

    this.post('/', [USER_ROLES.ADMIN, USER_ROLES.PREMIUM], productsController.createProduct)

    this.put('/:pid', [USER_ROLES.ADMIN], productsController.updateProduct)

    this.delete('/:pid', [USER_ROLES.ADMIN], productsController.deleteProduct)
  }
}
