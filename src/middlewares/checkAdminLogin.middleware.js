import { COOKIES_OPTIONS, COOKIE_AUTH, DEFAULT_ADMIN_DATA } from '../constants/constants.js'
import { ADMIN_PASS, ADMIN_USER } from '../constants/envVars.js'
import { generateToken } from '../utils/jwt.utils.js'
import { httpStatus } from '../utils/response.utils.js'

export default function checkAdminLogin(req, res, next) {
  const { email, password } = req.body

  if (email === ADMIN_USER && password === ADMIN_PASS) {
    const accessToken = generateToken(DEFAULT_ADMIN_DATA)

    return res.cookie(COOKIE_AUTH, accessToken, COOKIES_OPTIONS).send({
      status: httpStatus.SUCCESS,
      message: 'Usuario logeado correctamente',
      payload: { role: DEFAULT_ADMIN_DATA.role },
    })
  }

  next()
}
