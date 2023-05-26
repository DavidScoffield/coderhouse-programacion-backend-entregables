import { Router } from 'express'
import viewsController from '../controllers/views.controller.js'

const viewRouter = Router()

viewRouter.get('/', viewsController.home)

viewRouter.get('/realtimeproducts', viewsController.realTimeProducts)

viewRouter.get('/chat', viewsController.chat)

viewRouter.get('/cart/:cid', viewsController.cart)

export default viewRouter
