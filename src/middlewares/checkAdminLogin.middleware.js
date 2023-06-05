import { httpStatus } from '../utils/response.utils.js'

const { ADMIN_USER, ADMIN_PASS } = process.env

export default function checkAdminLogin(req, res, next) {
  const { email, password } = req.body

  if (email === ADMIN_USER && password === ADMIN_PASS) {
    req.session.user = {
      id: 0,
      name: 'Admin',
      role: 'admin',
      email: '...',
    }

    return res.send({
      status: httpStatus.SUCCESS,
      message: 'Usuario logeado correctamente',
      payload: { role: 'admin' },
    })
  }

  next()
}
