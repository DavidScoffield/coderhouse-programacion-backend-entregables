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
  NO_AUTH: 'NO_AUTH',
  PRIVATE_VIEW: 'PRIVATE_VIEW',
  NO_AUTH_VIEW: 'NO_AUTH_VIEW',
}

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

export const ALL_USER_ROLES = Object.values(USER_ROLES)

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

  // RESET_PASSWORD: ({ name, token }) => ({
  //   subject: 'Resetea tu contraseña',
  //   html: `<b>Para resetear tu contraseña haz click <a href="http://localhost:8080/reset-password/${token}">aquí</a></b>`,
  // }),
  // RESET_PASSWORD_SUCCESS: ({ name }) => ({
  //   subject: 'Contraseña reseteada',
  //   html: `<b>La contraseña de ${name} se ha reseteado correctamente</b>`,
  // }),
  // RESET_PASSWORD_ERROR: ({ name }) => ({
  //   subject: 'Error al resetear la contraseña',
  //   html: `<b>Ha ocurrido un error al resetear la contraseña de ${name}</b>`,
  // }),
}
