import ProductManagerMongo from '../dao/mongo/managers/ProductManager.js'
// import CartManagerMongo from '../dao/mongo/managers/CartManager.js'
import ProductManagerFS from '../dao/fileSystem/managers/ProductManager.js'
import CartManagerFS from '../dao/fileSystem/managers/CartManager.js'

import { PATH_OF_CARTS, PATH_OF_PRODUCTS } from '../constants/constants.js'
import { PERSISTENCE_TYPE } from './config.js'

const mongodbManagers = {
  pm: new ProductManagerMongo(),
  // cm: new CartManagerMongo(),
}

const fileSystemManagers = {
  pm: new ProductManagerFS(PATH_OF_PRODUCTS),
  cm: new CartManagerFS(PATH_OF_CARTS),
}

const managers = {
  mongodb: mongodbManagers,
  fileSystem: fileSystemManagers,
}

export default managers[PERSISTENCE_TYPE]
