import { Server } from 'socket.io'
import { PM } from './constants/singletons.js'

export default function (httpServer) {
  const io = new Server(httpServer)

  io.on('connection', async (socket) => {
    console.log('New connection: ' + socket.id)

    socket.emit('storedProducts', await PM.getProducts())

    socket.on('new-product', async (product) => {
      await PM.addProduct(product)

      const products = await PM.getProducts()

      io.emit('storedProducts', products)

      console.log(`Product with id ${product.id} created through socket.io`)
    })

    socket.on('delete-product', async (id) => {
      const idNumber = Number(id)

      await PM.deleteProduct(idNumber)

      const products = await PM.getProducts()

      io.emit('storedProducts', products)

      console.log(`Product with id ${id} deleted through socket.io`)
    })
  })

  return io
}
