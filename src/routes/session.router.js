import { PRIVACY_TYPES, USER_ROLES } from '../constants/constants.js'
import sessionController from '../controllers/session.controller.js'
import checkAdminLogin from '../middlewares/checkAdminLogin.middleware.js'
import { passportCall } from '../utils/passport.utils.js'
import BaseRouter from './BaseRouter.js'

export default class SessionRouter extends BaseRouter {
  init() {
    this.post(
      '/register',
      [PRIVACY_TYPES.NO_AUTH],
      passportCall('register', { strategyType: 'locals' }),
      sessionController.register
    )

    this.post(
      '/login',
      [PRIVACY_TYPES.NO_AUTH],
      checkAdminLogin,
      passportCall('login', { strategyType: 'locals' }),
      sessionController.login
    )

    this.get(
      '/github',
      [PRIVACY_TYPES.NO_AUTH],
      passportCall('github', { strategyType: 'locals' }),
      () => {}
    )

    this.get(
      '/githubcallback',
      [PRIVACY_TYPES.NO_AUTH],
      passportCall('github', { strategyType: 'locals' }),
      sessionController.githubCallback
    )

    this.get('/logout', [...Object.values(USER_ROLES)], sessionController.logout)
  }
}
