import logger from '../../../utils/logger.utils.js'
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

  getProductById = async (id) => {
    const products = await this.getProducts()

    const product = products.find((product) => product.id === id)

    if (!product) {
      logger.info(`Product with id "${id}" not exist in list`)
      throw new Error(`Product with id "${id}" not exist in list`)
    }

    return product
  }

  addProduct = async ({ title, description, price, thumbnail, code, stock, category, status }) => {
    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category ||
      status === undefined
    ) {
      throw new Error('Missing data to create product')
    }

    // Get products
    const products = await this.getProducts()

    // Validate unique code field
    const productWithSameCode = products.find((product) => product.code === code)

    if (productWithSameCode) {
      throw new Error(`Code: "${code}" already exists`)
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
      category,
      status,
      id,
    }

    const arrayWithNewProduct = [...products, product]

    await this.fsp.writeFile(arrayWithNewProduct)
    return product
  }

  updateProduct = async (
    id,
    { title, description, price, thumbnail, code, stock, category, status }
  ) => {
    // Validate required fields
    if (
      !title &&
      !description &&
      !price &&
      !thumbnail &&
      !code &&
      !stock &&
      !category &&
      status === undefined
    ) {
      throw new Error('Must provide at least one field to update')
    }

    // Get products
    const products = await this.getProducts()

    // Validate unique code field
    const productWithSameCode = products.find(
      (product) => product.code === code && product.id !== id
    )

    if (productWithSameCode) {
      throw new Error(`Code: "${code}" already exists`)
    }

    // Validate product id
    const product = products.find((product) => product.id === id)

    if (!product) {
      throw new Error(`Product with id "${id}" not found in list for update`)
    }

    // Create product
    const updatedProduct = {
      title: title || product.title,
      description: description || product.description,
      price: price || product.price,
      thumbnail: thumbnail || product.thumbnail,
      code: code || product.code,
      stock: stock || product.stock,
      category: category || product.category,
      status: status !== undefined ? status : product.status,
      id,
    }

    const arrayWithUpdatedProduct = products.map((product) =>
      product.id === id ? updatedProduct : product
    )

    await this.fsp.writeFile(arrayWithUpdatedProduct)
    return product
  }

  deleteProduct = async (id) => {
    // Get products
    const products = await this.getProducts()

    // Validate product id
    const product = products.find((product) => product.id === id)

    if (!product) {
      throw new Error(`Product with id "${id}" not found in list for deletion`)
    }

    const arrayWithDeletedProduct = products.filter((product) => product.id !== id)

    await this.fsp.writeFile(arrayWithDeletedProduct)
  }
}
