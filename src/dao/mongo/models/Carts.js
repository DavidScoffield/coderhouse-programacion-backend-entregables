import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ErrorService from '../../../services/ErrorService.js'
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
  { timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } }
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
  //! Problem when product was removed from db (TypeError, Cannot read properties of null (reading '_id'))
  const index = this.products.findIndex((p) => p._id._id.equals(product._id))

  if (index === -1) {
    ErrorService.createError({
      message: `Product with id ${product._id} not exist in cart`,
      status: httpStatus.NOT_FOUND,
      name: 'ProductNotInCart',
    })
  }

  this.products.splice(index, 1)
}

export default mongoose.model(collection, cardSchema)
