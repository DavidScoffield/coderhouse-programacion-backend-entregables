import { Router } from 'express'
import sessionController from '../controllers/session.controller.js'
import checkAdminLogin from '../middlewares/checkAdminLogin.middleware.js'
import passport from 'passport'

const sessionRouter = Router()

sessionRouter.post(
  '/register',
  [
    passport.authenticate('register', {
      failureRedirect: '/api/sessions/registerFail',
      failureMessage: true,
    }),
  ],
  sessionController.register
)

sessionRouter.get('/registerFail', sessionController.authenticationFail)

sessionRouter.post(
  '/login',
  [
    checkAdminLogin,
    passport.authenticate('login', {
      failureRedirect: '/api/sessions/loginFail',
      failureMessage: true,
    }),
  ],
  sessionController.login
)

sessionRouter.get('/loginFail', sessionController.authenticationFail)

sessionRouter.get('/github', [passport.authenticate('github')], () => {})

sessionRouter.get(
  '/githubcallback',
  [
    passport.authenticate('github', {
      failureRedirect: '/login',
      failureMessage: true,
    }),
  ],
  sessionController.githubCallback
)

sessionRouter.get('/logout', sessionController.logout)

sessionRouter.put('/restorePassword', sessionController.restorePassword)

export default sessionRouter
