import { tryCatchWrapperMongo } from '../../../errors/handlers/mongoError.handler.js'
import { hashPassword } from '../../../utils/bcrypt.js'
import Users from '../models/Users.js'

export default class UserManager {
  addUser = tryCatchWrapperMongo(async ({ firstName, lastName, email, age, password, cart }) => {
    const user = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(age && { age }),
      ...(password && { password: hashPassword(password) }),
      ...(cart && { cart }),
    }

    return Users.create(user)
  })

  getUserByEmail = tryCatchWrapperMongo(async (email, { lean = false } = {}) => {
    return Users.findOne({ email }, null, { lean })
  })

  updateUser = tryCatchWrapperMongo(async (userId, data, { lean = false } = {}) => {
    return Users.findByIdAndUpdate(userId, data, { new: true, lean })
  })

  getUserById = tryCatchWrapperMongo(async (userId, { lean = false } = {}) => {
    return Users.findById(userId, null, { lean })
  })
}
