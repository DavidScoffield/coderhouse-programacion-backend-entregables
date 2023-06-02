import Users from '../models/Users.js'

export default class UserManager {
  addUser = async ({ firstName, lastName, email, age, password }) => {
    return Users.create({
      firstName,
      lastName,
      email,
      age,
      password,
    })
  }

  getUser = async ({ email, password }) => {
    return Users.findOne({ email, password })
  }

  getUserByEmail = async (email, { lean = false } = {}) => {
    return Users.findOne({ email }, null, { lean })
  }
}
