import { CM, PM } from '../constants/singletons.js'
import { isPaginationParamsValid } from '../utils/validations/pagination.validations.util.js'
import { isProductDataValid } from '../utils/validations/products.validations.util.js'
import { mappedStatus } from '../utils/mappedParams.util.js'

const home = async (req, res) => {
  const products = await PM.getProducts()

  res.render('home', {
    products: products.docs,
  })
}

const realTimeProducts = async (req, res) => {
  res.render('realtimeproducts', {
    css: ['realTimeProducts'],
  })
}

const chat = async (req, res) => {
  res.render('chat')
}

const products = async (req, res, next) => {
  const { page = 1, limit = 10, sort, category = '', status = undefined } = req.query

  const productDataToValidate = {}
  if (category) productDataToValidate.category = category
  if (status !== undefined && status !== '') productDataToValidate.status = mappedStatus[status]

  try {
    const isValidPaginationParams = isPaginationParamsValid({ limit, page, sort })
    const isValidSearchParams = isProductDataValid(productDataToValidate)

    const { docs, ...rest } = await PM.getProducts({
      limit,
      page,
      sort,
      query: productDataToValidate,
    })

    const response = {
      products: docs,
      totalPages: rest.totalPages,
      prevPage: rest.prevPage,
      nextPage: rest.nextPage,
      page: rest.page,
      hasNextPage: rest.hasNextPage,
      hasPrevPage: rest.hasPrevPage,
      prevLink: rest.prevLink,
      nextLink: rest.nextLink,
    }

    res.render('products', {
      ...response,
      css: ['pagination', 'filterProducts'],
      js: ['products', 'filterProducts', 'pagination'],
      limit,
      sort,
      category,
      status,
    })
  } catch (e) {
    next(e)
  }
}

const cart = async (req, res) => {
  const { cid } = req.params

  const cart = await CM.getCartById(cid, { lean: true })

  res.render('cart', {
    cart,
  })
}

export default { home, realTimeProducts, chat, products, cart }
