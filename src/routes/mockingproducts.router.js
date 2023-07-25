import { PRIVACY_TYPES } from '../constants/constants.js'
import mockingProductsController from '../controllers/mockingproducts.controller.js'
import BaseRouter from './BaseRouter.js'

export default class MockingProductsRouter extends BaseRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PUBLIC], mockingProductsController.mockProducts)
  }
}
