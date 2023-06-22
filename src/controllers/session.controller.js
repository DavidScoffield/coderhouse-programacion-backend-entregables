import { COOKIES_OPTIONS, COOKIE_AUTH } from '../constants/constants.js'
import { UM } from '../constants/singletons.js'
import ValidationError from '../errors/ValidationError.js'
import { hashPassword, isValidPassword } from '../utils/bcrypt.js'
import { generateToken } from '../utils/jwt.utils.js'
import { httpCodes } from '../utils/response.utils.js'

const register = async (req, res, next) => {
  const { user } = req

  res.sendSuccessWithPayload({
    message: 'Usuario registrado correctamente',
    payload: user,
  })
}

const login = async (req, res, next) => {
  const { user } = req

  const userCookie = {
    name: user.name,
    role: user.role,
    id: user.id,
    email: user.email,
  }

  const accessToken = generateToken(userCookie)

  res.cookie(COOKIE_AUTH, accessToken, COOKIES_OPTIONS).sendSuccessWithPayload({
    message: 'Usuario logueado correctamente',
    payload: userCookie,
  })
}

const logout = (req, res, next) => {
  res.clearCookie(COOKIE_AUTH)
  res.sendSuccess('Sesión cerrada correctamente')
}

const restorePassword = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await UM.getUserByEmail(email)

    if (!user) throw new ValidationError('El email no está registrado')

    if (user.password) {
      const isSamePassword = isValidPassword(password, user.password)
      if (isSamePassword)
        return res.sendCustomError({
          code: httpCodes.BAD_REQUEST,
          error: 'Cannot replace password with current password',
        })
    }

    const hashedPassword = hashPassword(password)

    const updatedUser = await UM.updateUser(user._id, { password: hashedPassword })

    res.sendSuccessWithPayload({
      message: 'Contraseña actualizada correctamente',
      payload: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

const githubCallback = (req, res, next) => {
  const { user } = req

  const userCookie = {
    id: user.id,
    name: user.firstName,
    role: user.role,
    email: user.email,
  }

  const accessToken = generateToken(userCookie)

  res.cookie(COOKIE_AUTH, accessToken, COOKIES_OPTIONS)

  res.redirect('/products')
}

export default { register, login, logout, restorePassword, githubCallback }
