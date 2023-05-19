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
    return Products.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
      },
      { new: true, lean: true }
    )
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
