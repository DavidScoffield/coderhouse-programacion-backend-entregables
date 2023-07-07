export default class SessionUserDTO {
  id
  name
  role
  email

  constructor({ name, firstName, lastName, id, role, email }) {
    if (!id && id !== 0) throw new Error('SessionUserDTO: id is required')

    if (!role) throw new Error('SessionUserDTO: role is required')

    if (!email) throw new Error('SessionUserDTO: email is required')

    if (!name && !firstName && !lastName)
      throw new Error('SessionUserDTO: Name or firstName or lastName are required')

    this.id = id
    this.role = role
    this.email = email
    this.name = name || `${firstName || ''} ${lastName || ''}`
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      email: this.email,
    }
  }
}
