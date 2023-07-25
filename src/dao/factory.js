import { PERSISTENCE_TYPE } from '../constants/envVars.js'
import { VALIDS_PERSISTENCE_TYPES } from '../constants/constants.js'
import CustomError from '../errors/classes/CustomError.js'
import { httpCodes } from '../utils/response.utils.js'

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
    throw new CustomError(
      `Invalid persistence type: ${PERSISTENCE_TYPE}. The valids keys are: ${Object.keys(
        VALIDS_PERSISTENCE_TYPES
      )}`,
      httpCodes.INTERNAL_SERVER_ERROR
    )
  },
}

const getPersistences = async () => {
  const persistenceFn = PersistenceFactory[PERSISTENCE_TYPE] || PersistenceFactory.default

  const managers = await persistenceFn()

  // Validate if all managers are defined (not null) or throw an error
  Object.keys(managers).forEach((managerKey) => {
    if (!managers[managerKey]) {
      throw new CustomError(
        `The manager ${managerKey} is not defined. Please check the persistence type "${PERSISTENCE_TYPE}" or define it`,
        httpCodes.INTERNAL_SERVER_ERROR
      )
    }
  })

  return managers
}

export default getPersistences
