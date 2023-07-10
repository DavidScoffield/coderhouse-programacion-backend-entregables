import { PRIVACY_TYPES, USER_ROLES } from '../constants/constants.js'
import viewsController from '../controllers/views.controller.js'
import BaseRouter from './BaseRouter.js'

export default class ViewRouter extends BaseRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PRIVATE_VIEW], viewsController.home)

    this.get('/realtimeproducts', [PRIVACY_TYPES.PUBLIC], viewsController.realTimeProducts)

    this.get('/chat', [USER_ROLES.USER], viewsController.chat)

    this.get('/products', [PRIVACY_TYPES.PRIVATE_VIEW], viewsController.products)

    this.get('/cart/:cid', [PRIVACY_TYPES.PUBLIC], viewsController.cart)

    this.get('/register', [PRIVACY_TYPES.NO_AUTH_VIEW], viewsController.register)

    this.get('/login', [PRIVACY_TYPES.NO_AUTH_VIEW], viewsController.login)

    this.get('/restorePassword', [PRIVACY_TYPES.NO_AUTH_VIEW], viewsController.restorePassword)

    this.get('/profile', [PRIVACY_TYPES.PRIVATE_VIEW], viewsController.profile)

    this.get('/myCart', [PRIVACY_TYPES.PRIVATE_VIEW], viewsController.myCart)
  }
}
