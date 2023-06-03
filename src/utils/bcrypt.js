import bcrypt from 'bcryptjs'

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export const isValidPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}
