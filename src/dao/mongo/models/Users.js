import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Carts from './Carts.js'
import { USER_ROLES } from '../../../constants/constants.js'

const collection = 'users'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: USER_ROLES.USER,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Carts,
    default: null,
  },
  last_connection: {
    type: Date,
    default: null,
  },
})

userSchema.plugin(uniqueValidator)

// delete sensitive data from response with set
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password
    delete ret.__v
    return ret
  },
})

userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.__v
  return user
}

export default mongoose.model(collection, userSchema)
