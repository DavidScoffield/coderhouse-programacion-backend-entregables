import { PM } from '../constants/singletons.js'
import { castToMongoId } from '../utils/casts.js'

const registerRealTimeProductsHandler = async (io, socket) => {
  const saveProduct = async (product) => {
    await PM.addProduct(product)

    const products = await PM.getProducts()

    io.emit('realTimeProducts:storedProducts', products)

    console.log(`Product with id ${product.id} created through socket.io`)
  }

  const deleteProduct = async (pid) => {
    const id = castToMongoId(pid)

    await PM.deleteProduct(id)

    const products = await PM.getProducts()

    io.emit('realTimeProducts:storedProducts', products)

    console.log(`Product with id ${id} deleted through socket.io`)
  }

  socket.emit('realTimeProducts:storedProducts', await PM.getProducts())
  socket.on('realTimeProducts:newProduct', saveProduct)
  socket.on('realTimeProducts:deleteProduct', deleteProduct)
}

export default registerRealTimeProductsHandler