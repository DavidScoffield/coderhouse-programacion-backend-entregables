import httpStatus from 'http-status'
import { VALIDS_PERSISTENCE_TYPES } from '../constants/constants.js'
import { PERSISTENCE_TYPE } from '../constants/envVars.js'
import EErrors from '../errors/EErrors.js'
import ErrorService from '../services/error.service.js'

const PersistenceFactory = {
  [VALIDS_PERSISTENCE_TYPES.FS]: async () => {
    const { default: CartManager } = await import('./fileSystem/managers/cart.manager.js')
    const { default: ProductManager } = await import('./fileSystem/managers/product.manager.js')

    return { CartManager, ProductManager, MessageManager: null, UserManager: null }
  },

  [VALIDS_PERSISTENCE_TYPES.MONGO]: async () => {
    const { default: CartManager } = await import('./mongo/managers/cart.manager.js')
    const { default: ProductManager } = await import('./mongo/managers/product.manager.js')
    const { default: MessageManager } = await import('./mongo/managers/message.manager.js')
    const { default: UserManager } = await import('./mongo/managers/user.manager.js')

    return { CartManager, ProductManager, MessageManager, UserManager }
  },

  default: async () => {
    ErrorService.createError({
      message: 'Invalid persistence type',
      status: httpStatus.INTERNAL_SERVER_ERROR,
      cause: `Invalid persistence type: ${PERSISTENCE_TYPE}. The valids keys are: ${Object.keys(
        VALIDS_PERSISTENCE_TYPES
      )}`,
      name: 'InvalidPersistenceType',
      code: EErrors.INVALID_TYPES,
    })
  },
}

const getPersistences = async () => {
  const persistenceFn = PersistenceFactory[PERSISTENCE_TYPE] || PersistenceFactory.default

  const managers = await persistenceFn()

  // Validate if all managers are defined (not null) or throw an error
  Object.keys(managers).forEach((managerKey) => {
    if (!managers[managerKey]) {
      ErrorService.createError({
        message: 'Manager not defined',
        status: httpStatus.INTERNAL_SERVER_ERROR,
        name: 'ManagerNotDefined',
        cause: `The manager ${managerKey} is not defined. Please check the persistence type "${PERSISTENCE_TYPE}" or define it`,
      })
    }
  })

  return managers
}

export default getPersistences
