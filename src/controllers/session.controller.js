import httpStatus from 'http-status'
import { COOKIES_OPTIONS, COOKIE_AUTH } from '../constants/constants.js'
import ErrorService from '../services/error.service.js'
import { mailService } from '../services/index.js'
import { userRepository } from '../services/repositories/index.js'
import { hashPassword, isValidPassword } from '../utils/bcrypt.js'
import { generateToken } from '../utils/jwt.utils.js'
import EErrors from '../errors/EErrors.js'

const register = async (req, res, next) => {
  const { user } = req

  mailService.sendWelcomeMail({ to: user.email, name: `${user.firstName} ${user.lastName}` })

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

  const user = await userRepository.getUserByEmail(email)

  if (!user) ErrorService.createValidationError({ message: 'El email no está registrado' })

  if (user.password) {
    const isSamePassword = isValidPassword(password, user.password)
    if (isSamePassword)
      return ErrorService.createError({
        message: 'Cannot replace password with current password',
        cause: 'Cannot replace password with current password',
        status: httpStatus.BAD_REQUEST,
        metaData: { email },
        code: EErrors.INVALID_VALUES,
        name: 'RestorePassword Error',
      })
  }

  const hashedPassword = hashPassword(password)

  const updatedUser = await userRepository.updateUser(user._id, { password: hashedPassword })

  res.sendSuccessWithPayload({
    message: 'Contraseña actualizada correctamente',
    payload: updatedUser,
  })
}

const githubCallback = (req, res, next) => {
  const { user } = req

  const accessToken = generateToken(user.toObject())

  res.cookie(COOKIE_AUTH, accessToken, COOKIES_OPTIONS)

  res.redirect('/products')
}

const current = async (req, res, next) => {
  const { user } = req

  const currentUser = await userRepository.getCurrentUser(user.id)

  res.sendSuccessWithPayload({
    payload: currentUser,
  })
}

export default { register, login, logout, restorePassword, githubCallback, current }
