import Products from '../models/Products.js'

export default class ProductManager {
  getProducts = (params) => {
    const limit = params?.limit

    if (limit) {
      return Products.find().limit(limit).lean()
    }

    return Products.find().lean()
  }

  getProductById = async (id) => {
    return Products.findById(id).lean()
  }

  addProduct = async ({ title, description, price, thumbnail, code, stock, category, status }) => {
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
    }

    return Products.create(product)
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
