import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import logger from '../utils/logger.utils.js'
import { MONGO_DB_NAME, MONGO_HOST, MONGO_PASS, MONGO_USER } from '../constants/envVars.js'

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

const sessionStore = MongoStore.create({
  mongoUrl: MONGO_URI,
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  ttl: 60 * 60 * 24, // 1 day
})

export { sessionStore, connection as mongooseConnection }
