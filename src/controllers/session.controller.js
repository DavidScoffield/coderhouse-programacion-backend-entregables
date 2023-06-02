import { UM } from '../constants/singletons.js'
import ValidationError from '../errors/ValidationError.js'
import { httpCodes, httpStatus } from '../utils/response.utils.js'
import { isUsersDataValid } from '../utils/validations/users.validation.util.js'

const register = async (req, res, next) => {
  const { firstName, lastName, email, age, password } = req.body

  try {
    isUsersDataValid({ firstName, lastName, email, age, password })

    const user = await UM.addUser({ firstName, lastName, age, email, password })

    res.send({ status: httpStatus.SUCCESS, payload: user })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  const user = await UM.getUser({ email, password })

  if (!user)
    return res
      .status(httpCodes.BAD_REQUEST)
      .send({ status: httpStatus.ERROR, message: 'Usuario o contraseña incorrectas' })

  req.session.user = {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  }

  res.send({ status: httpStatus.SUCCESS, message: 'Usuario logeado correctamente', payload: user })
}

export default { register, login }
