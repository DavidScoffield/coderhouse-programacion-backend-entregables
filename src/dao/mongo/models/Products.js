import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import mongoosePaginate from 'mongoose-paginate-v2'
import { DEFAULT_ADMIN_DATA } from '../../../constants/constants.js'

const collection = 'products'

const productSchema = new mongoose.Schema(
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
    thumbnail: [
      {
        type: String,
      },
    ],
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
    owner: {
      type: String,
      required: true,
      default: DEFAULT_ADMIN_DATA.name,
    },
  },
  { timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } }
)

productSchema.plugin(uniqueValidator)
productSchema.plugin(mongoosePaginate)

export default mongoose.model(collection, productSchema)
