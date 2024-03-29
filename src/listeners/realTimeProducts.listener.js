import LoggerService from '../services/logger.service.js'
import { productRepository } from '../services/repositories/index.js'
import { castToMongoId } from '../utils/casts.utils.js'

const registerRealTimeProductsHandler = async (io, socket) => {
  const saveProduct = async (product) => {
    await productRepository.addProduct(product)

    const products = await productRepository.getProducts()

    io.emit('realTimeProducts:storedProducts', products)

    LoggerService.info(`Product with id ${product.id} created through socket.io`)
  }

  const deleteProduct = async (pid) => {
    const id = castToMongoId(pid)

    await productRepository.deleteProduct(id)

    const products = await productRepository.getProducts()

    io.emit('realTimeProducts:storedProducts', products)

    LoggerService.info(`Product with id ${id} deleted through socket.io`)
  }

  socket.emit('realTimeProducts:storedProducts', await productRepository.getProducts())
  socket.on('realTimeProducts:newProduct', saveProduct)
  socket.on('realTimeProducts:deleteProduct', deleteProduct)
}

export default registerRealTimeProductsHandler
