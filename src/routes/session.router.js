import { Router } from 'express'
import sessionController from '../controllers/session.controller.js'

const sessionRouter = Router()

sessionRouter.post('/register', sessionController.register)

sessionRouter.post('/login', sessionController.login)

export default sessionRouter
