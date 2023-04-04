import ProductManager from './managers/ProductManager.js'

const PATH_TO_SAVE_DATA = './products.json'

const pm = new ProductManager(PATH_TO_SAVE_DATA)

// getProducts
console.log(await pm.getProducts())

// addProduct
await pm.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
})

console.log(await pm.getProducts())

// getProductsById
console.log(await pm.getProductsById(1))
console.log(await pm.getProductsById(2))

// updateProduct
await pm.updateProduct(1, {
  title: 'producto actualizado',
  description: 'Este es un producto de prueba actualizado',
  price: 565,
  stock: 100,
})

// deleteProduct
await pm.deleteProduct(2)
await pm.deleteProduct(1)
