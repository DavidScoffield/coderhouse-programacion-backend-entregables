import { Router } from 'express'
import EErrors from '../errors/EErrors.js'
import ErrorService from '../services/error.service.js'
import LoggerService from '../services/logger.service.js'
import { passportCall } from '../utils/passport.utils.js'
import { POLICY_STRATEGIES } from '../utils/policiesStrategies.util.js'

export default class BaseViewRouter {
  constructor() {
    this.router = Router()
    this.init()
  }

  init() {
    ErrorService.createInternalError({
      message: 'You have to implement the method init!',
      name: 'BaseRouter Error',
      code: EErrors.METHOD_NOT_IMPLEMENTED,
    })
  }

  getRouter() {
    return this.router
  }

  #handleRoute(method, path, policies, ...callbacks) {
    this.router[method](
      path,
      this.logRequest,
      this.generateCustomResponses,
      passportCall('jwt', { strategyType: 'jwt' }),
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    )
  }

  get(path, policies, ...callbacks) {
    this.#handleRoute('get', path, policies, ...callbacks)
  }

  generateCustomResponses = (req, res, next) => {
    res.render404 = () => res.render('404', { title: '404', css: ['404'] })
    res.renderLogin = () => res.redirect('/login')

    next()
  }

  handlePolicies = (policies) => {
    return (req, res, next) => {
      const { user } = req

      const strategyFn = POLICY_STRATEGIES[policies[0]]

      if (strategyFn !== undefined) {
        return strategyFn(user, res, next)
      }

      if (!user) return res.renderLogin()

      if (!policies.includes(user.role.toUpperCase())) return res.render404()

      next()
    }
  }

  logRequest = (req, res, next) => {
    LoggerService.http(
      `|VIEW| [${req.method}] - ${req.originalUrl} - ${req.ip} - ${req.headers['user-agent']}`
    )
    next()
  }

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params)
      } catch (error) {
        // eslint-disable-next-line no-unused-vars
        const [req, res, next] = params
        // TODO: test errors
        next(error)
      }
    })
  }
}
