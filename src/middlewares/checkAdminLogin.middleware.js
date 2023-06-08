import { DEFAULT_ADMIN_DATA } from '../constants/constants.js'
import { ADMIN_PASS, ADMIN_USER } from '../constants/envVars.js'
import { httpStatus } from '../utils/response.utils.js'

export default function checkAdminLogin(req, res, next) {
  const { email, password } = req.body

  if (email === ADMIN_USER && password === ADMIN_PASS) {
    req.session.user = DEFAULT_ADMIN_DATA

    return res.send({
      status: httpStatus.SUCCESS,
      message: 'Usuario logeado correctamente',
      payload: { role: DEFAULT_ADMIN_DATA.role },
    })
  }

  next()
}
