import { USER_ROLES } from '../constants/constants.js'
import ErrorService from '../services/error.service.js'
import { productRepository } from '../services/repositories/index.js'
import { castToMongoId } from '../utils/casts.utils.js'

export async function validateThatProductIsNotOfUser(req, res, next) {
  const { user } = req
  const { pid } = req.params

  if (user.role !== USER_ROLES.PREMIUM) return next()

  const id = castToMongoId(pid)

  const product = await productRepository.getProductById(id)
  if (!product)
    return ErrorService.createError({
      name: 'ProductNotFound',
      message: `Product with id "${id}" not found`,
      status: 404,
    })

  if (product.owner === user.email)
    return ErrorService.createError({
      name: 'Unauthorized',
      message: `You are not authorized to perform this action. "${id}" is your product`,
      status: 401,
      cause: `The product with id "${id}" is owned by the logged user "${product.owner}"`,
    })

  next()
}

export function validateCartOwnership(req, res, next) {
  const { user } = req
  const { cid } = req.params

  if (user.cart !== cid)
    return ErrorService.createError({
      name: 'Unauthorized',
      message: `You are not authorized to perform this action`,
      status: 401,
      cause: `The cart with id "${cid}" is not of the logged user "${user.email}"`,
    })

  next()
}
