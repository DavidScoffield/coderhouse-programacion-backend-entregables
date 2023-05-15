import { Schema, model } from 'mongoose'

import Products from './Products.js'

const collection = 'messages'

const messageSchema = new Schema(
  {
    user: {
      type: String,

      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'create_ad', updatedAt: 'update_ad' } }
)

export default model(collection, messageSchema)
