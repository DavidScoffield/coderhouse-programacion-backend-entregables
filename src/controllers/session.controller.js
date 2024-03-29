import httpStatus from 'http-status'
import { COOKIES_OPTIONS, COOKIE_AUTH, USER_ROLES } from '../constants/constants.js'
import RestoreTokenDTO from '../dto/RestoreTokenDTO.js'
import EErrors from '../errors/EErrors.js'
import ErrorService from '../services/error.service.js'
import { mailService } from '../services/index.js'
import { userRepository } from '../services/repositories/index.js'
import { hashPassword, isValidPassword } from '../utils/bcrypt.js'
import { generateToken, verifyToken } from '../utils/jwt.utils.js'
import { isUsersDataValid } from '../utils/validations/users.validation.util.js'
import SessionUserDTO from '../dto/SessionUserDTO.js'

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

const logout = async (req, res, next) => {
  if (req.user.role !== USER_ROLES.ADMIN)
    await userRepository.updateLastConnectionForUser(req.user.id)

  res.clearCookie(COOKIE_AUTH)
  res.sendSuccess('Sesión cerrada correctamente')
}

const restorePassword = async (req, res, next) => {
  const { password, token } = req.body

  try {
    const tokenUser = verifyToken(token)

    const user = await userRepository.getUserByEmail(tokenUser.email)

    if (!user) ErrorService.createValidationError({ message: 'El email no está registrado' })

    if (user.password) {
      const isSamePassword = isValidPassword(password, user.password)
      if (isSamePassword)
        return ErrorService.createError({
          message: 'No se puede reemplazar la contraseña con la contraseña actual',
          cause: 'Cannot replace password with current password',
          status: httpStatus.BAD_REQUEST,
          metaData: { email: tokenUser.email, password },
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
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      ErrorService.createError({
        message: 'Token inválido',
        cause: 'Token inválido',
        status: httpStatus.BAD_REQUEST,
        metaData: { token },
        code: EErrors.INVALID_VALUES,
        name: 'RestorePassword Error',
      })
    } else {
      next(e)
    }
  }
}

const restoreRequest = async (req, res, next) => {
  const { email } = req.body

  if (!email) ErrorService.createValidationError({ message: 'No se ha especificado un email' })

  const user = await userRepository.getUserByEmail(email)

  if (!user) ErrorService.createValidationError({ message: 'El email no está registrado' })

  const token = generateToken(RestoreTokenDTO.fromUser(user), '1h')

  await mailService.sendRestorePasswordMail({
    to: user.email,
    token,
  })

  res.sendSuccess('Se ha enviado un mail a tu casilla de correo para restaurar tu contraseña')
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

const updateProfile = async (req, res, next) => {
  const { user } = req
  const { email, age } = req.body

  isUsersDataValid({ email, age })

  const updatedUser = await userRepository.updateUser(user.id, {
    email,
    age,
  })

  const updatedUserDTO = new SessionUserDTO(updatedUser)

  const accessToken = generateToken(updatedUserDTO.toObject())

  res.cookie(COOKIE_AUTH, accessToken, COOKIES_OPTIONS).sendSuccessWithPayload({
    message: 'Usuario actualizado correctamente',
    payload: updatedUserDTO,
  })
}

export default {
  register,
  login,
  logout,
  restoreRequest,
  restorePassword,
  githubCallback,
  current,
  updateProfile,
}
