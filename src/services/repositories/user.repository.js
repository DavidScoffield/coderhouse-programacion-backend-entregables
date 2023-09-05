import { DEFAULT_ADMIN_DATA } from '../../constants/constants.js'
import CurrentUserDTO from '../../dto/CurrentUserDTO.js'

export default class UserRepository {
  constructor(dao) {
    this.dao = dao
  }

  addUser = ({ firstName, lastName, email, age, password, cart, role }) => {
    return this.dao.addUser({ firstName, lastName, email, age, password, cart, role })
  }

  getUserByEmail = (email, { lean } = {}) => {
    return this.dao.getUserByEmail(email, { lean })
  }

  updateUser = (userId, data, { lean } = {}) => {
    return this.dao.updateUser(userId, data, { lean })
  }

  getUserById = (userId, { lean } = {}) => {
    return this.dao.getUserById(userId, { lean })
  }

  getCurrentUser = async (userId) => {
    if (userId === DEFAULT_ADMIN_DATA.id) return new CurrentUserDTO(DEFAULT_ADMIN_DATA)

    const user = await this.getUserById(userId, { lean: true })

    return new CurrentUserDTO(user)
  }

  updateLastConnectionForUser = (userId, { lean } = {}) => {
    return this.updateUser(userId, { last_connection: new Date() }, { lean })
  }
}
