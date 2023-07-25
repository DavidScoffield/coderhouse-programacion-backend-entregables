import { tryCatchWrapperMongo } from '../../../errors/handlers/mongoError.handler.js'
import Products from '../models/Products.js'

export default class ProductManager {
  getProducts = tryCatchWrapperMongo(async ({ limit, page, sort, query = {} } = {}) => {
    const options = {
      lean: true,
    }

    if (limit) options.limit = limit
    if (page) options.page = page
    if (sort) options.sort = { price: sort }

    return Products.paginate(query, options)
  })

  getProductById = tryCatchWrapperMongo(async (id) => Products.findById(id).lean())

  addProduct = tryCatchWrapperMongo(
    async ({ title, description, price, thumbnail, code, stock, category, status }) => {
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
  )

  updateProduct = tryCatchWrapperMongo(
    async (id, { title, description, price, thumbnail, code, stock, category, status }) => {
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
  )

  deleteProduct = tryCatchWrapperMongo(async (id) => Products.findByIdAndDelete(id))

  getCategories = tryCatchWrapperMongo(async () => {
    return Products.distinct('category')
  })
}
