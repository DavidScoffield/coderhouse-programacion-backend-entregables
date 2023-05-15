import { Schema, model } from 'mongoose'

import Products from './Products.js'

const collection = 'carts'

const cardSchema = new Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Products,
      },
    ],
  },
  { timestamps: { createdAt: 'create_ad', updatedAt: 'update_ad' } }
)

export default model(collection, cardSchema)
