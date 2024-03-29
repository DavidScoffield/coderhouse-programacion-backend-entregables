import { __root } from '../utils/dirname.utils.js'
import { BASE_URL, MULTER_DEST } from './envVars.js'

// Server
export const PATH_OF_PRODUCTS = './productos.json'
export const PATH_OF_CARTS = './carrito.json'
export const MULTER_PATH_FOLDER = `${__root}/${MULTER_DEST}`

export const COOKIES_OPTIONS = {
  maxAge: 1000 * 60 * 60 * 24,
  httpOnly: true,
  sameSite: 'strict',
}

export const PRIVACY_TYPES = {
  PUBLIC: 'PUBLIC',
  NO_AUTH: 'NO_AUTH',
  PRIVATE_VIEW: 'PRIVATE_VIEW',
  NO_AUTH_VIEW: 'NO_AUTH_VIEW',
}

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PREMIUM: 'PREMIUM',
}

export const ALL_USER_ROLES = Object.values(USER_ROLES)

export const ALL_USER_ROLES_WITHOUT_ADMIN = ALL_USER_ROLES.filter(
  (role) => role !== USER_ROLES.ADMIN
)

export const DEFAULT_ADMIN_DATA = {
  id: 0,
  name: 'Admin',
  role: USER_ROLES.ADMIN,
  email: '...',
}

export const VALIDS_PERSISTENCE_TYPES = {
  MONGO: 'mongo',
  FS: 'fs',
}

export const COOKIE_AUTH = 'authToken'

export const MAILS_TEMPLATES = {
  WELCOME: ({ name }) => ({
    subject: 'Bienvenido a mi tienda',
    html: `<b>Gracias por registrarte ${name}</b>`,
  }),
  PURCHASED_CART: ({ name, ticket }) => {
    const date = new Date(ticket.purchaseDateTime)
    const stringDate = date.toLocaleString()

    return {
      subject: 'Compra realizada',
      html: `<p>Gracias por tu compra <b>${name}</b></p>
        <h2>Ticket de compra</h2>
        <p>Código de ticket: <b>${ticket.code}</b></p>
        <p>Fecha de compra: <b>${stringDate}</b></p>
        <p>Email: <b>${ticket.purchaser}</b></p>
        <p>Importe total: <b>$${ticket.amount}</b></p>
        `,
    }
  },

  RESTORE_PASSWORD: ({ token }) => {
    return {
      subject: 'Reestablece tu contraseña',
      html: `<b>Para resetear tu contraseña haz click <a href="${BASE_URL}/restorePassword?token=${token}">aquí</a></b>
    <p>Si el link no funciona, copia y pega la siguiente dirección en tu navegador: ${BASE_URL}/restorePassword?token=${token}</p>
    <b>Si no has solicitado el cambio de contraseña, ignora este email</b>
    `,
    }
  },
  DELETED_ACCOUNT: ({ name, reason }) => ({
    subject: 'Cuenta eliminada',
    html: `<p>
    <b>Hola ${name}</b>, queríamos informarte que tu <b>cuenta</b> ha sido <b>eliminada</b> por el siguiente motivo: <b>"${reason}"</b>
    </p>`,
  }),
  DELETED_PRODUCT: ({ name, productName }) => ({
    subject: 'Producto eliminado',
    html: `<p>
    <b>Hola ${name}</b>, queríamos informarte que tu producto <b>${productName}</b> ha sido <b>eliminado</b> 
    </p>`,
  }),

  // RESET_PASSWORD_SUCCESS: ({ name }) => ({
  //   subject: 'Contraseña reseteada',
  //   html: `<b>La contraseña de ${name} se ha reseteado correctamente</b>`,
  // }),
  // RESET_PASSWORD_ERROR: ({ name }) => ({
  //   subject: 'Error al resetear la contraseña',
  //   html: `<b>Ha ocurrido un error al resetear la contraseña de ${name}</b>`,
  // }),
}

export const INACTIVE_CONNECTION_PARAM = 1000 * 60 * 60 * 24 * 2 // 2 days
