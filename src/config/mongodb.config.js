import mongoose from 'mongoose'
import {
  MONGO_DB_NAME,
  MONGO_HOST,
  MONGO_PASS,
  MONGO_USER,
  NODE_ENV,
} from '../constants/envVars.js'
import LoggerService from '../services/logger.service.js'

if (!MONGO_DB_NAME || !MONGO_HOST || !MONGO_PASS || !MONGO_USER) {
  LoggerService.fatal('❌❌❌ Missing MongoDB env vars ❌❌❌')
  process.exit(1)
}

const MONGO_URIS = {
  production: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`,
  development: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB_NAME}-dev?retryWrites=true&w=majority`,
  test: `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB_NAME}-test?retryWrites=true&w=majority`,
}

const MONGO_URI = MONGO_URIS[NODE_ENV]

class MongoSingleton {
  static #instance

  constructor() {
    LoggerService.info('🔎🔎 connecting to', MONGO_URI)
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        LoggerService.info('✅️✅️ Connections to Mongo database succefully')
      })
      .catch((err) => {
        LoggerService.error('❌ error connecting to MongoDB:', err.message)
      })
  }

  static getInstance() {
    if (!this.#instance) {
      MongoSingleton.#instance = new MongoSingleton()
    }
    return this.#instance
  }

  close() {
    mongoose.connection.close()
  }
}

const connection = MongoSingleton.getInstance()

export { connection as mongooseConnection, MongoSingleton }
