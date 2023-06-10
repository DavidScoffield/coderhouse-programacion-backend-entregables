import { UM } from '../constants/singletons.js'
import ValidationError from '../errors/ValidationError.js'
import { hashPassword, isValidPassword } from '../utils/bcrypt.js'
import logger from '../utils/logger.utils.js'
import { httpCodes, httpStatus } from '../utils/response.utils.js'

const register = async (req, res, next) => {
  const { user } = req

  res.send({
    status: httpStatus.SUCCESS,
    message: 'Usuario registrado correctamente',
    payload: user,
  })
}

const login = async (req, res, next) => {
  const { user } = req

  req.session.user = {
    name: user.name,
    role: user.role,
    id: user.id,
    email: user.email,
  }

  res.send({
    status: httpStatus.SUCCESS,
    message: 'Usuario logueado correctamente',
    payload: user,
  })
}

const authenticationFail = (req, res, next) => {
  const { messages } = req.session
  const message = messages.at(-1)

  logger.error(message)

  res.status(httpCodes.BAD_REQUEST).send({ status: httpStatus.ERROR, message: message })
}

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .send({ status: httpStatus.ERROR, message: 'Error al cerrar sesión' })
    }

    res.clearCookie('connect.sid')
    res.send({ status: httpStatus.SUCCESS, message: 'Sesión cerrada correctamente' })
  })
}

const restorePassword = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await UM.getUserByEmail(email)

    if (!user) throw new ValidationError('El email no está registrado')

    const hashedPassword = hashPassword(password)

    const updatedUser = await UM.updateUser(user._id, { password: hashedPassword })

    res.send({
      status: httpStatus.SUCCESS,
      message: 'Contraseña actualizada correctamente',
      payload: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

const githubCallback = (req, res, next) => {
  const { user } = req

  req.session.user = {
    id: user.id,
    name: user.firstName,
    role: user.role,
    email: user.email,
  }

  res.redirect('/products')
}

export default { register, login, logout, restorePassword, authenticationFail, githubCallback }
