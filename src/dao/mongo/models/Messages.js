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
  { timestamps: { createdAt: 'create_at', updatedAt: 'update_at' } }
)

export default mongoose.model(collection, messageSchema)
