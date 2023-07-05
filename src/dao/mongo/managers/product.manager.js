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

  getProductById = (id) => Products.findById(id).lean()

  addProduct = ({ title, description, price, thumbnail, code, stock, category, status }) => {
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

  updateProduct = (id, { title, description, price, thumbnail, code, stock, category, status }) => {
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

  deleteProduct = (id) => Products.findByIdAndDelete(id)

  getCategories = () => {
    return Products.distinct('category')
  }
}
