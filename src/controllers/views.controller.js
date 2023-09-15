import LoggerService from '../services/logger.service.js'
import {
  cartRepository,
  productRepository,
  userRepository,
} from '../services/repositories/index.js'
import { verifyToken } from '../utils/jwt.utils.js'
import { mappedStatus } from '../utils/mappedParams.util.js'
import { isPaginationParamsValid } from '../utils/validations/pagination.validations.util.js'
import { isProductDataValid } from '../utils/validations/products.validations.util.js'

const home = async (req, res) => {
  const products = await productRepository.getProducts()

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
  const { user } = req

  res.render('chat', {
    user,
    js: ['chat'],
  })
}

const products = async (req, res, next) => {
  const { user } = req
  const { page = 1, limit = 10, sort, category = '', status = undefined } = req.query

  const productDataToValidate = {}
  if (category) productDataToValidate.category = category
  if (status !== undefined && status !== '') productDataToValidate.status = mappedStatus[status]

  try {
    isPaginationParamsValid({ limit, page, sort })
    isProductDataValid(productDataToValidate)

    const listCategories = await productRepository.getCategories()

    const { docs, ...rest } = await productRepository.getProducts({
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

  const cart = await cartRepository.getCartById(cid, { lean: true })

  res.render('cart', {
    cart,
  })
}

const register = async (req, res) => {
  res.render('register', {
    js: ['register'],
  })
}
const login = async (req, res) => {
  res.render('login', {
    js: ['login'],
    css: ['login'],
  })
}

const profile = async (req, res) => {
  let userData
  try {
    userData = await userRepository.getCurrentUser(req.user.id)
  } catch (e) {
    console.log(e)
  }

  res.render('profile', {
    user: {
      ...userData,
    },
    css: ['profile'],
    js: ['profile'],
  })
}

const restorePassword = async (req, res) => {
  const { token } = req.query

  try {
    verifyToken(token)
    res.render('restorePassword', {
      js: ['restorePassword'],
    })
  } catch (e) {
    LoggerService.error(e)
    res.redirect(
      `/restoreRequest?e=${encodeURIComponent(
        'El token expiró o es inválido, por favor solicite uno nuevo'
      )}`
    )
  }
}

const restoreRequest = async (req, res) => {
  const { e } = req.query

  res.render('restoreRequest', {
    js: ['restoreRequest'],
    error: e,
  })
}

const myCart = async (req, res) => {
  const { user } = req

  const cart = await cartRepository.getCartById(user.cart, { lean: true })

  const totalAmount = cart.products.reduce((acc, product) => {
    return acc + product._id.price * product.quantity
  }, 0)

  res.render('myCart', {
    user,
    cart,
    totalAmount,
    css: ['myCart'],
    js: ['myCart'],
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
  restoreRequest,
  myCart,
}
