import mongoose from 'mongoose'
import Products from './Products.js'

import CustomError from '../../../errors/CustomError.js'

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

// populate ('products._id') in save method
cardSchema.pre('save', function () {
  this.populate('products._id')
})

// populate('products._id') in any find method
cardSchema.pre(/^find/, function () {
  this.populate('products._id')
})

cardSchema.methods.addProduct = function (product, quantity) {
  const index = this.products.findIndex((p) => p._id._id.equals(product._id))

  if (index === -1) {
    this.products.push({ _id: product, quantity })
  } else {
    this.products[index].quantity += quantity
  }
}

cardSchema.methods.removeProduct = function (product) {
  const index = this.products.findIndex((p) => p._id._id.equals(product._id))

  if (index === -1) {
    throw new CustomError(`Product with id ${product._id} not exist in cart`)
  }

  this.products.splice(index, 1)
}

export default mongoose.model(collection, cardSchema)
