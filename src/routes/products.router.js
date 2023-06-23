import { PRIVACY_TYPES } from '../constants/constants.js'
import productsController from '../controllers/products.controller.js'

import BaseRouter from './BaseRouter.js'

export default class ProductRouter extends BaseRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PUBLIC], productsController.getProducts)

    this.get('/:pid', [PRIVACY_TYPES.PUBLIC], productsController.getProductById)

    this.post('/', [PRIVACY_TYPES.PUBLIC], productsController.createProduct)

    this.put('/:pid', [PRIVACY_TYPES.PUBLIC], productsController.updateProduct)

    this.delete('/:pid', [PRIVACY_TYPES.PUBLIC], productsController.deleteProduct)
  }
}
