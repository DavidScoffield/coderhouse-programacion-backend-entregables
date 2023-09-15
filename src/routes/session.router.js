import {
  ALL_USER_ROLES,
  ALL_USER_ROLES_WITHOUT_ADMIN,
  PRIVACY_TYPES,
  USER_ROLES,
} from '../constants/constants.js'
import sessionController from '../controllers/session.controller.js'
import checkAdminLogin from '../middlewares/checkAdminLogin.middleware.js'
import protectRoleRegistration from '../middlewares/session.middleware.js'
import { passportCall } from '../utils/passport.utils.js'
import BaseRouter from './BaseRouter.js'

export default class SessionRouter extends BaseRouter {
  init() {
    this.post(
      '/register',
      [PRIVACY_TYPES.NO_AUTH],
      protectRoleRegistration,
      passportCall('register', { strategyType: 'locals' }),
      sessionController.register
    )

    this.post(
      '/registerUsers',
      [USER_ROLES.ADMIN],
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

    this.get('/logout', [...ALL_USER_ROLES], sessionController.logout)

    this.post('/restoreRequest', [PRIVACY_TYPES.NO_AUTH], sessionController.restoreRequest)

    this.put('/restorePassword', [PRIVACY_TYPES.PUBLIC], sessionController.restorePassword)

    this.get('/current', [...ALL_USER_ROLES], sessionController.current)

    this.put('/updateProfile', [...ALL_USER_ROLES_WITHOUT_ADMIN], sessionController.updateProfile)
  }
}
