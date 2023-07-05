import mongoose from 'mongoose'
import { MONGO_DB_NAME, MONGO_HOST, MONGO_PASS, MONGO_USER } from '../constants/envVars.js'
import logger from '../utils/logger.utils.js'

if (!MONGO_DB_NAME || !MONGO_HOST || !MONGO_PASS || !MONGO_USER) {
  logger.error('❌❌❌ Missing MongoDB env vars ❌❌❌')
  process.exit(1)
}

const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`

class MongoSingleton {
  static #instance

  constructor() {
    logger.info('🔎🔎 connecting to', MONGO_URI)
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        logger.info('✅️✅️ Connections to Mongo database succefully')
      })
      .catch((err) => {
        logger.info('❌ error connecting to MongoDB:', err.message)
      })
  }

  static getInstance() {
    if (!this.#instance) {
      MongoSingleton.#instance = new MongoSingleton()
    }
    return this.#instance
  }
}

const connection = MongoSingleton.getInstance()

export { connection as mongooseConnection, MongoSingleton }
