import { COOKIES_OPTIONS, COOKIE_AUTH } from '../constants/constants.js'
import ValidationError from '../errors/ValidationError.js'
import { userRepository } from '../repositories/index.js'
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

  const accessToken = generateToken(user.toObject())

  res.cookie(COOKIE_AUTH, accessToken, COOKIES_OPTIONS).sendSuccessWithPayload({
    message: 'Usuario logueado correctamente',
    payload: user,
  })
}

const logout = (req, res, next) => {
  res.clearCookie(COOKIE_AUTH)
  res.sendSuccess('Sesión cerrada correctamente')
}

const restorePassword = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await userRepository.getUserByEmail(email)

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

    const updatedUser = await userRepository.updateUser(user._id, { password: hashedPassword })

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

  const accessToken = generateToken(user.toObject())

  res.cookie(COOKIE_AUTH, accessToken, COOKIES_OPTIONS)

  res.redirect('/products')
}

const current = (req, res, next) => {
  const { user } = req

  res.sendSuccessWithPayload({
    payload: user,
  })
}

export default { register, login, logout, restorePassword, githubCallback, current }
