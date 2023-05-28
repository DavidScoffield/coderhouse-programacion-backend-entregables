import Products from '../models/Products.js'

export default class ProductManager {
  getProducts = ({ limit, page, sort, query = {} } = {}) => {
    const options = {
      lean: true,
    }

    if (limit) options.limit = limit
    if (page) options.page = page
    if (sort) options.sort = { price: sort }

    return Products.paginate(query, options)
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

  getCategories = async () => {
    return Products.distinct('category')
  }
}
