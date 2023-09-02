import '../src/config/env.config.js'
import mongoose from 'mongoose'

import { MongoSingleton } from '../src/config/mongodb.config.js'

export const mongoConection = MongoSingleton.getInstance()

export const dropAllCollections = async (collectionNames) => {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany({})
  }
}

export const dropCollection = async (...collectionNames) => {
  for (const collectionName of collectionNames) {
    const collection = mongoose.connection.collections[collectionName]
    if (!collection) return console.log(`"${collectionName}" collection not found`)
    await collection.deleteMany({})
  }
}
