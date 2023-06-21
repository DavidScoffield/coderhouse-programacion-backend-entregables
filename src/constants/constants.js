// Server
export const PATH_OF_PRODUCTS = './productos.json'
export const PATH_OF_CARTS = './carrito.json'

export const DEFAULT_ADMIN_DATA = {
  id: 0,
  name: 'Admin',
  role: 'admin',
  email: '...',
}

export const COOKIES_OPTIONS = {
  maxAge: 1000 * 60 * 60 * 24,
  httpOnly: true,
  sameSite: 'strict',
}

export const COOKIE_AUTH = 'authToken'
