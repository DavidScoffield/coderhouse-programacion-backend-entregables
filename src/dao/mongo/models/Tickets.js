import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const collection = 'tickets'

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
    purchaseDateTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } }
)
ticketSchema.plugin(uniqueValidator)

export default mongoose.model(collection, ticketSchema)
