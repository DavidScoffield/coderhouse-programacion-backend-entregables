import mongoose from 'mongoose'

const collection = 'messages'

const messageSchema = new mongoose.Schema(
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

export default mongoose.model(collection, messageSchema)
