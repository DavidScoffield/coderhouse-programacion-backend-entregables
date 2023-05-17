import { Server } from 'socket.io'
import managers from './utils/persistenceType.js'

const { pm } = managers

export default function (httpServer) {
  const io = new Server(httpServer)

  io.on('connection', async (socket) => {
    console.log('New connection: ' + socket.id)

    socket.emit('storedProducts', await pm.getProducts())

    socket.on('new-product', async (product) => {
      await pm.addProduct(product)

      const products = await pm.getProducts()

      io.emit('storedProducts', products)

      console.log(`Product with id ${product.id} created through socket.io`)
    })

    socket.on('delete-product', async (id) => {
      const idNumber = Number(id)

      await pm.deleteProduct(idNumber)

      const products = await pm.getProducts()

      io.emit('storedProducts', products)

      console.log(`Product with id ${id} deleted through socket.io`)
    })
  })

  return io
}
