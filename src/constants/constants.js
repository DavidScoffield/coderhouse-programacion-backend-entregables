// Server
export const PATH_OF_PRODUCTS = './productos.json'
export const PATH_OF_CARTS = './carrito.json'

export const COOKIES_OPTIONS = {
  maxAge: 1000 * 60 * 60 * 24,
  httpOnly: true,
  sameSite: 'strict',
}

export const PRIVACY_TYPES = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  NO_AUTH: 'NO_AUTH',
}

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

export const DEFAULT_ADMIN_DATA = {
  id: 0,
  name: 'Admin',
  role: USER_ROLES.ADMIN,
  email: '...',
}

export const COOKIE_AUTH = 'authToken'
