import { Router } from 'express'
import viewsController from '../controllers/views.controller.js'

const viewRouter = Router()

viewRouter.get('/', viewsController.home)

viewRouter.get('/realtimeproducts', viewsController.realTimeProducts)

export default viewRouter
