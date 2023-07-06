export default class UserRepository {
  constructor(dao) {
    this.dao = dao
  }

  addUser = ({ firstName, lastName, email, age, password, cart }) => {
    return this.dao.addUser({ firstName, lastName, email, age, password, cart })
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
}
