export default class RestoreTokenDTO {
  constructor({ email }) {
    this.email = email
  }

  static fromUser(user) {
    return {
      email: user.email,
    }
  }
}
