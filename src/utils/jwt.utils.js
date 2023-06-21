import jwt from 'jsonwebtoken'
import { SECRET_JWT } from '../constants/envVars.js'

export const cookieExtractor = (req) => {
  return req?.cookies?.[COOKIE_AUTH] || null
}

export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_JWT, { expiresIn: '24h' })
  return token
}
