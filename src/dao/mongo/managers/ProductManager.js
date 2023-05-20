import Products from '../models/Products.js'

export default class ProductManager {
  getProducts = (params) => {
    const limit = params?.limit

    if (limit) {
      return Products.find().limit(limit).lean()
    }

    return Products.find().lean()
  }

  getProductById = async (id) => Products.findById(id).lean()

  addProduct = async ({ title, description, price, thumbnail, code, stock, category, status }) => {
    return Products.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    })
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

  deleteProduct = async (id) => Products.findByIdAndDelete(id)
}
