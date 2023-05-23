import mongoose from 'mongoose'
import logger from '../utils/logger.utils.js'

const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB_NAME } = process.env
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`

// Connection at the DB
logger.info('🔎🔎 connecting to', MONGO_URI)
const connection = mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info('✅️✅️ Connections to database succefully')
  })
  .catch((err) => {
    logger.info('❌ error connecting to MongoDB:', err.message)
  })
