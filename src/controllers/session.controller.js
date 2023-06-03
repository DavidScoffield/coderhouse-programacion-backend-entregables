import { UM } from '../constants/singletons.js'
import ValidationError from '../errors/ValidationError.js'
import { httpCodes, httpStatus } from '../utils/response.utils.js'
import { isUsersDataValid } from '../utils/validations/users.validation.util.js'

const register = async (req, res, next) => {
  const { firstName, lastName, email, age, password } = req.body

  try {
    isUsersDataValid({ firstName, lastName, email, age, password })

    const userExists = await UM.getUserByEmail(email)

    if (userExists) throw new ValidationError('El email ya está registrado')

    const user = await UM.addUser({ firstName, lastName, age, email, password })

    res.send({ status: httpStatus.SUCCESS, payload: user })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await UM.getUser({ email, password })

    if (!user)
      return res
        .status(httpCodes.BAD_REQUEST)
        .send({ status: httpStatus.ERROR, message: 'Usuario o contraseña incorrectas' })

    req.session.user = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }

    res.send({
      status: httpStatus.SUCCESS,
      message: 'Usuario logeado correctamente',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
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

export default { register, login, logout }
