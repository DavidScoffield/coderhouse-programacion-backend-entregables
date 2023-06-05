import { Router } from 'express'
import sessionController from '../controllers/session.controller.js'
import checkAdminLogin from '../middlewares/checkAdminLogin.middleware.js'

const sessionRouter = Router()

sessionRouter.post('/register', sessionController.register)

sessionRouter.post('/login', [checkAdminLogin], sessionController.login)

sessionRouter.get('/logout', sessionController.logout)

sessionRouter.put('/restorePassword', sessionController.restorePassword)

export default sessionRouter
