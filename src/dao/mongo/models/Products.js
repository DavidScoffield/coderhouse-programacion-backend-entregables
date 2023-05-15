import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const collection = 'products'

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: { createdAt: 'create_ad', updatedAt: 'update_ad' } }
)

productSchema.plugin(uniqueValidator)

export default model(collection, productSchema)
