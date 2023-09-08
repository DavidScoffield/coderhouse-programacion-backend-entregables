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
    async ({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
      owner,
      images,
    }) => {
      return Products.create({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
        owner,
        images,
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

  addImages = tryCatchWrapperMongo(async (productId, images) => {
    return Products.findByIdAndUpdate(productId, { $push: { images } }, { new: true, lean: true })
  })

  removeImage = tryCatchWrapperMongo(async (productId, imageId) => {
    return Products.findByIdAndUpdate(
      productId,
      { $pull: { images: { _id: imageId } } },
      { new: true, lean: true }
    )
  })
}
