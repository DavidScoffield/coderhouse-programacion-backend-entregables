import express from 'express'
import ProductManager from './managers/ProductManager.js'

// Constants
const PORT = 8080
const PATH_TO_SAVE_DATA = './products.json'

const app = express()
const pm = new ProductManager(PATH_TO_SAVE_DATA)

app.get('/products', async (req, res) => {
  const { limit } = req.query

  const products = await pm.getProducts()

  if (!limit) return res.send(products)

  const limitNumber = Number(limit)

  if (!limitNumber || limitNumber <= 0)
    return res.status(404).send(`"${limit}" no es un numero valido`)

  res.send(products.slice(0, limitNumber))
})

app.get('/products/:pid', async (req, res) => {
  const { pid } = req.params
  const id = Number(pid)

  const product = await pm.getProductsById(id)

  if (!product) {
    return res.send({ error: `Product with id "${id}" not exist in list` })
  }

  res.send(product)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
