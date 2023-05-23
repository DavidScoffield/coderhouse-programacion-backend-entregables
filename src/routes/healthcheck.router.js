import { Router } from 'express'
import healthcheckController from '../controllers/healthcheck.controller.js'

const healthcheckRouter = Router()

healthcheckRouter.get('/', healthcheckController.check)

export default healthcheckRouter
