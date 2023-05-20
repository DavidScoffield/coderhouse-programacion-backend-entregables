import mongoose from 'mongoose'

import Products from './Products.js'

const collection = 'carts'

const cardSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Products,
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: 'create_ad', updatedAt: 'update_ad' } }
)

export default mongoose.model(collection, cardSchema)
