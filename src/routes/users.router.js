import { USER_ROLES } from '../constants/constants.js'
import usersController from '../controllers/users.controller.js'
import BaseRouter from './BaseRouter.js'

export default class UserRouter extends BaseRouter {
  init() {
    this.put('/premium/:uid', [USER_ROLES.ADMIN], usersController.switchPremiumRole)
  }
}
