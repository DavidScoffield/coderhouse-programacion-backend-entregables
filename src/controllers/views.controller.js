import { CM, PM, UM } from '../constants/singletons.js'
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
  const { user } = req.session
  const { page = 1, limit = 10, sort, category = '', status = undefined } = req.query

  const productDataToValidate = {}
  if (category) productDataToValidate.category = category
  if (status !== undefined && status !== '') productDataToValidate.status = mappedStatus[status]

  try {
    const isValidPaginationParams = isPaginationParamsValid({ limit, page, sort })
    const isValidSearchParams = isProductDataValid(productDataToValidate)

    const listCategories = await PM.getCategories()

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
      listCategories,
      limit,
      sort,
      category,
      status,
      user,
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

const register = async (req, res) => {
  if (req.session.user) return res.redirect('/products')

  res.render('register', {
    js: ['register'],
  })
}
const login = async (req, res) => {
  if (req.session.user) return res.redirect('/products')

  res.render('login', {
    js: ['login'],
  })
}

const profile = async (req, res) => {
  if (!req.session.user) return res.redirect('/login')

  let userData
  try {
    userData = await UM.getUserByEmail(req.session.user.email)
    userData = await userData.toJSON()
  } catch (e) {
    console.log(e)
  }

  res.render('profile', {
    user: {
      ...userData,
      name: req.session.user.name,
      email: req.session.user.email,
    },
  })
}

const restorePassword = async (req, res) => {
  if (req.session.user) return res.redirect('/products')

  res.render('restorePassword', {
    js: ['restorePassword'],
  })
}

export default {
  home,
  realTimeProducts,
  chat,
  products,
  cart,
  register,
  login,
  profile,
  restorePassword,
}
