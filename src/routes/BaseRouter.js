import { Router } from 'express'
import { passportCall } from '../utils/passport.utils.js'
import { POLICIES_STRATEGIES } from '../utils/policiesStrategies.util.js'
import { httpCodes, httpStatus } from '../utils/response.utils.js'

export default class BaseRouter {
  constructor() {
    this.router = Router()
    this.init()
  }

  init() {
    throw new Error('You have to implement the method init!')
  }

  getRouter() {
    return this.router
  }

  #handleRoute(method, path, policies, ...callbacks) {
    this.router[method](
      path,
      this.generateCustomResponses,
      passportCall('jwt', { strategyType: 'jwt' }),
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    )
  }

  get(path, policies, ...callbacks) {
    this.#handleRoute('get', path, policies, ...callbacks)
  }

  post(path, policies, ...callbacks) {
    this.#handleRoute('post', path, policies, ...callbacks)
  }

  put(path, policies, ...callbacks) {
    this.#handleRoute('put', path, policies, ...callbacks)
  }

  delete(path, policies, ...callbacks) {
    this.#handleRoute('delete', path, policies, ...callbacks)
  }

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (message) => res.json({ status: httpStatus.SUCCESS, message })

    res.sendSuccessWithPayload = ({ message, payload }) =>
      res.json({ status: httpStatus.SUCCESS, payload, message })

    res.sendInternalError = (error) =>
      res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ status: httpStatus.ERROR, error })

    res.sendUnauthorized = (error) =>
      res.status(httpCodes.UNAUTHORIZED).json({ status: httpStatus.ERROR, error })

    res.sendForbidden = (error) =>
      res.status(httpCodes.FORBIDDEN).json({ status: httpStatus.ERROR, error })

    res.sendNotFound = ({ error }) =>
      res.status(httpCodes.NOT_FOUND).json({ status: httpStatus.ERROR, error })

    res.sendBadRequest = ({ error }) =>
      res.status(httpCodes.BAD_REQUEST).json({ status: httpStatus.ERROR, error })

    res.sendCustomError = ({ code, error }) =>
      res.status(code).json({ status: httpStatus.ERROR, error })

    next()
  }

  handlePolicies = (policies) => {
    return (req, res, next) => {
      const { user } = req

      const strategyFn = POLICIES_STRATEGIES[policies[0]]

      if (strategyFn !== undefined) {
        return strategyFn(user, res, next)
      }

      if (!user) return res.sendUnauthorized(req.error)

      if (!policies.includes(user.role.toUpperCase())) return res.sendForbidden('Forbidden')

      next()
    }
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