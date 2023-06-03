import { Router } from 'express'
import viewsController from '../controllers/views.controller.js'

const viewRouter = Router()

viewRouter.get('/', viewsController.home)

viewRouter.get('/realtimeproducts', viewsController.realTimeProducts)

viewRouter.get('/chat', viewsController.chat)

viewRouter.get('/products', viewsController.products)

viewRouter.get('/cart/:cid', viewsController.cart)

viewRouter.get('/register', viewsController.register)

viewRouter.get('/login', viewsController.login)

viewRouter.get('/restorePassword', viewsController.restorePassword)

viewRouter.get('/profile', viewsController.profile)

export default viewRouter
