import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const collection = 'users'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
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
