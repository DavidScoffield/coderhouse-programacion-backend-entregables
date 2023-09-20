import { ALL_USER_ROLES_WITHOUT_ADMIN, PRIVACY_TYPES, USER_ROLES } from '../constants/constants.js'
import viewsController from '../controllers/views.controller.js'
import BaseViewRouter from './BaseViewRouter.js'

export default class ViewRouter extends BaseViewRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PRIVATE_VIEW], viewsController.home)

    this.get('/realtimeproducts', [PRIVACY_TYPES.PUBLIC], viewsController.realTimeProducts)

    this.get('/chat', [...ALL_USER_ROLES_WITHOUT_ADMIN], viewsController.chat)

    this.get('/products', [PRIVACY_TYPES.PRIVATE_VIEW], viewsController.products)

    this.get('/cart/:cid', [PRIVACY_TYPES.PUBLIC], viewsController.cart)

    this.get('/register', [PRIVACY_TYPES.NO_AUTH_VIEW], viewsController.register)

    this.get('/login', [PRIVACY_TYPES.NO_AUTH_VIEW], viewsController.login)

    this.get('/restorePassword', [PRIVACY_TYPES.NO_AUTH_VIEW], viewsController.restorePassword)

    this.get('/profile', [PRIVACY_TYPES.PRIVATE_VIEW], viewsController.profile)

    this.get('/myCart', [USER_ROLES.USER, USER_ROLES.PREMIUM], viewsController.myCart)

    this.get('/restoreRequest', [PRIVACY_TYPES.PUBLIC], viewsController.restoreRequest)

    this.get('/restorePassword', [PRIVACY_TYPES.NO_AUTH_VIEW], viewsController.restorePassword)

    this.get('/users', [USER_ROLES.ADMIN], viewsController.users)
  }
}
