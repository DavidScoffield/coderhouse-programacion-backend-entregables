import { PRIVACY_TYPES } from '../constants/constants.js'
import healthcheckController from '../controllers/healthcheck.controller.js'
import BaseRouter from './BaseRouter.js'

export default class HealthcheckRouter extends BaseRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PUBLIC], healthcheckController.check)
  }
}
