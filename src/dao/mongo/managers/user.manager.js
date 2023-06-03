import Users from '../models/Users.js'
import { hashPassword, isValidPassword } from '../../../utils/bcrypt.js'

export default class UserManager {
  addUser = async ({ firstName, lastName, email, age, password }) => {
    return Users.create({
      firstName,
      lastName,
      email,
      age,
      password: hashPassword(password),
    })
  }

  getUser = async ({ email, password }) => {
    const user = await this.getUserByEmail(email)

    if (!user) return null

    if (!isValidPassword(password, user.password)) return null

    return user
  }

  getUserByEmail = async (email, { lean = false } = {}) => {
    return Users.findOne({ email }, null, { lean })
  }
}
