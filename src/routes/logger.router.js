import { PRIVACY_TYPES } from '../constants/constants.js'
import loggerController from '../controllers/logger.controller.js'
import BaseRouter from './BaseRouter.js'

export default class LoggerRouter extends BaseRouter {
  init() {
    this.get('/', [PRIVACY_TYPES.PUBLIC], loggerController.log)
  }
}
