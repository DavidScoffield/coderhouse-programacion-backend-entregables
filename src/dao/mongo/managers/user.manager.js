import { hashPassword } from '../../../utils/bcrypt.js'
import Users from '../models/Users.js'

export default class UserManager {
  addUser = ({ firstName, lastName, email, age, password }) => {
    return Users.create({
      firstName,
      lastName,
      email,
      age,
      password: hashPassword(password),
    })
  }

  getUserByEmail = (email, { lean = false } = {}) => {
    return Users.findOne({ email }, null, { lean })
  }

  updateUser = (userId, data, { lean = false } = {}) => {
    return Users.findByIdAndUpdate(userId, data, { new: true, lean: lean })
  }

  getUserById = (userId, { lean = false } = {}) => {
    return Users.findById(userId, null, { lean })
  }
}
