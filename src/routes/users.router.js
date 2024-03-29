import { ALL_USER_ROLES_WITHOUT_ADMIN, USER_ROLES } from '../constants/constants.js'
import usersController from '../controllers/users.controller.js'
import { uploaders } from '../middlewares/multer.middleware.js'
import { validateUserId } from '../middlewares/users.middleware.js'
import BaseRouter from './BaseRouter.js'

export default class UserRouter extends BaseRouter {
  init() {
    this.get('/', [USER_ROLES.ADMIN], usersController.getAll)
    this.delete('/', [USER_ROLES.ADMIN], usersController.deleteInactiveUsers)
    this.delete('/:uid', [USER_ROLES.ADMIN], usersController.deleteUser)

    this.put('/premium/:uid', [USER_ROLES.ADMIN], usersController.switchPremiumRole)
    this.post(
      '/:uid/documents',
      [...ALL_USER_ROLES_WITHOUT_ADMIN],
      validateUserId,
      uploaders.fields([
        {
          name: 'profiles',
          maxCount: 1,
        },
        {
          name: 'documents',
        },
      ]),
      usersController.uploadFiles
    )
  }
}
