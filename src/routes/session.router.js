import { Router } from 'express'
import sessionController from '../controllers/session.controller.js'
import checkAdminLogin from '../middlewares/checkAdminLogin.middleware.js'
import { passportCall } from '../utils/passport.utils.js'

const sessionRouter = Router()

sessionRouter.post('/register', [passportCall('register')], sessionController.register)

sessionRouter.post('/login', [checkAdminLogin, passportCall('login')], sessionController.login)

sessionRouter.get('/github', [passportCall('github')], () => {})

sessionRouter.get('/githubcallback', [passportCall('github')], sessionController.githubCallback)

sessionRouter.get('/logout', sessionController.logout)

sessionRouter.put('/restorePassword', sessionController.restorePassword)

export default sessionRouter
