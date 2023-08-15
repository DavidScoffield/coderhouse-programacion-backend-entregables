import jwt from 'jsonwebtoken'
import { SECRET_JWT } from '../constants/envVars.js'
import { COOKIE_AUTH } from '../constants/constants.js'

export const cookieExtractor = (req) => {
  return req?.cookies?.[COOKIE_AUTH] || null
}

export const generateToken = (user, expiresIn = '1d') => {
  return jwt.sign(user, SECRET_JWT, { expiresIn })
}

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_JWT)
}
