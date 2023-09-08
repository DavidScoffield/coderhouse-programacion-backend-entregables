import { PRIVACY_TYPES, USER_ROLES } from '../constants/constants.js'
import productsController from '../controllers/products.controller.js'
import { uploaders } from '../middlewares/multer.middleware.js'
import { validateProductOwnership } from '../middlewares/products.middleware.js'

import BaseRouter from './BaseRouter.js'

export default class ProductRouter extends BaseRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PUBLIC], productsController.getProducts)

    this.get('/:pid', [PRIVACY_TYPES.PUBLIC], productsController.getProductById)

    this.post(
      '/',
      [USER_ROLES.ADMIN, USER_ROLES.PREMIUM],
      uploaders.array('products'),
      productsController.createProduct
    )

    this.put(
      '/:pid',
      [USER_ROLES.ADMIN, USER_ROLES.PREMIUM],
      validateProductOwnership,
      productsController.updateProduct
    )

    this.post(
      '/:pid/images',
      [USER_ROLES.ADMIN, USER_ROLES.PREMIUM],
      validateProductOwnership,
      uploaders.array('products'),
      productsController.addProductImages
    )

    this.delete(
      '/:pid/images/:iid',
      [USER_ROLES.ADMIN, USER_ROLES.PREMIUM],
      validateProductOwnership,
      productsController.removeImage
    )

    this.delete(
      '/:pid',
      [USER_ROLES.ADMIN, USER_ROLES.PREMIUM],
      validateProductOwnership,
      productsController.deleteProduct
    )
  }
}
