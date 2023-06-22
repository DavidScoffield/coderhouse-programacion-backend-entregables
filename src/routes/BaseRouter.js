import { Router } from 'express'
import { passportCall } from '../utils/passport.utils.js'
import { httpCodes, httpStatus } from '../utils/response.utils.js'
import { PRIVACY_TYPES } from '../constants/constants.js'

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

    res.sendCustomError = ({ code, error }) =>
      res.status(code).json({ status: httpStatus.ERROR, error })

    next()
  }

  handlePolicies = (policies) => {
    return (req, res, next) => {
      if (policies[0] === PRIVACY_TYPES.PUBLIC) return next()

      const { user } = req
      if (policies[0] === PRIVACY_TYPES.NO_AUTH && user) return res.sendUnauthorized('Unauthorized')
      if (policies[0] === PRIVACY_TYPES.NO_AUTH && !user) return next()

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
        // res.sendInternalError(error)
        // TODO: test errors
        next(error)
      }
    })
  }
}
