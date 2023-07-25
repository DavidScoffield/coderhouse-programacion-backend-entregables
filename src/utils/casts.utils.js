import mongoose from 'mongoose'
import ValidationError from '../errors/classes/ValidationError.js'

const castToMongoId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id)
  } catch (error) {
    throw new ValidationError(`The provided id (${id}) isn't valid`, 400)
  }
}

export { castToMongoId }
