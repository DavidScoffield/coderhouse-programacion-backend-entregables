import FileSystemPromises from '../utils/FileSystemPromises.js'

export default class ProductManager {
  #path

  constructor(path) {
    this.#path = path
    this.fsp = new FileSystemPromises(path)
  }

  #nextId = (products) => (products.length === 0 ? 1 : products[products.length - 1].id + 1)

  getProducts = async () => {
    if (this.fsp.exists()) {
      return await this.fsp.readFile()
    } else {
      return []
    }
  }

  getProductsById = async (id) => {
    const products = await this.getProducts()

    const product = products.find((product) => product.id === id)

    if (!product) {
      console.log(`Product with id "${id}" not exist in list`)
    }

    return product
  }

  addProduct = async ({ title, description, price, thumbnail, code, stock }) => {
    // Validate required fields
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log('Missing data to create product')
      return
    }

    // Get products
    const products = await this.getProducts()

    // Validate unique code field
    const productWithSameCode = products.find((product) => product.code === code)

    if (productWithSameCode) {
      console.log(`Code: "${code}" already exists`)
      return
    }

    // Create product id
    const id = this.#nextId(products)

    // Create product
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id,
    }

    const arrayWithNewProduct = [...products, product]

    await this.fsp.writeFile(arrayWithNewProduct)
  }

  updateProduct = async (id, { title, description, price, thumbnail, code, stock }) => {
    // Validate required fields
    if (!title && !description && !price && !thumbnail && !code && !stock) {
      console.log('Must provide at least one field to update')
      return
    }

    // Get products
    const products = await this.getProducts()

    // Validate unique code field
    const productWithSameCode = products.find(
      (product) => product.code === code && product.id !== id
    )

    if (productWithSameCode) {
      console.log(`Code: "${code}" already exists`)
      return
    }

    // Validate product id
    const product = products.find((product) => product.id === id)

    if (!product) {
      console.log(`Product with id "${id}" not found in list for update`)
      return
    }

    // Create product
    const updatedProduct = {
      title: title || product.title,
      description: description || product.description,
      price: price || product.price,
      thumbnail: thumbnail || product.thumbnail,
      code: code || product.code,
      stock: stock || product.stock,
      id,
    }

    const arrayWithUpdatedProduct = products.map((product) =>
      product.id === id ? updatedProduct : product
    )

    await this.fsp.writeFile(arrayWithUpdatedProduct)
  }

  deleteProduct = async (id) => {
    // Get products
    const products = await this.getProducts()

    // Validate product id
    const product = products.find((product) => product.id === id)

    if (!product) {
      console.log(`Product with id "${id}" not found in list for deletion`)
      return
    }

    const arrayWithDeletedProduct = products.filter((product) => product.id !== id)

    await this.fsp.writeFile(arrayWithDeletedProduct)
  }
}
