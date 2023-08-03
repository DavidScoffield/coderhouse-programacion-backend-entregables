export default function protectRoleRegistration(req, res, next) {
  req.body.role = null
  next()
}
