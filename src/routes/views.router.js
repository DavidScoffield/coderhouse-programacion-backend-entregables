import { Router } from 'express'
import viewsController from '../controllers/views.controller.js'
import { privacy, PRIVACY_TYPES } from '../middlewares/privacy.middleware.js'

const viewRouter = Router()

viewRouter.get('/', [privacy(PRIVACY_TYPES.PRIVATE)], viewsController.home)

viewRouter.get('/realtimeproducts', viewsController.realTimeProducts)

viewRouter.get('/chat', viewsController.chat)

viewRouter.get('/products', [privacy(PRIVACY_TYPES.PRIVATE)], viewsController.products)

viewRouter.get('/cart/:cid', viewsController.cart)

viewRouter.get('/register', [privacy(PRIVACY_TYPES.NO_AUTH)], viewsController.register)

viewRouter.get('/login', [privacy(PRIVACY_TYPES.NO_AUTH)], viewsController.login)

viewRouter.get(
  '/restorePassword',
  [privacy(PRIVACY_TYPES.NO_AUTH)],
  viewsController.restorePassword
)

viewRouter.get('/profile', [privacy(PRIVACY_TYPES.PRIVATE)], viewsController.profile)

export default viewRouter
