import passport from 'passport'
import { httpCodes, httpStatus } from './response.utils.js'

export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error)
      if (!user) {
        if (options.redirect) return res.redirect(options.redirect)
        return res
          .status(httpCodes.UNAUTHORIZED)
          .send({ status: httpStatus.ERROR, error: info.message || info.toString() })
      }
      req.user = user
      next()
    })(req, res, next)
  }
}
