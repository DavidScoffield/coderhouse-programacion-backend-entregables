import { USER_ROLES } from '../constants/constants.js'
import ErrorService from '../services/error.service.js'
import { productRepository } from '../services/repositories/index.js'
import { castToMongoId } from '../utils/casts.utils.js'

export async function validateProductOwnership(req, res, next) {
  const { user } = req
  const { pid } = req.params

  if (user.role === USER_ROLES.ADMIN) return next()

  const id = castToMongoId(pid)

  const product = await productRepository.getProductById(id)
  if (!product)
    return ErrorService.createError({
      name: 'ProductNotFound',
      message: `Product with id "${id}" not found`,
      status: 404,
    })

  if (product.owner !== user.email)
    return ErrorService.createError({
      name: 'Unauthorized',
      message: `You are not authorized to perform this action`,
      status: 401,
      cause: `Product with id "${id}" is owned by "${product.owner}"`,
    })

  next()
}
