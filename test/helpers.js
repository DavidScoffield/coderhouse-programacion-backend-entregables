import '../src/config/env.config.js'
import mongoose from 'mongoose'

import { MongoSingleton } from '../src/config/mongodb.config.js'

export const mongoConection = MongoSingleton.getInstance()

export const dropAllCollections = async (collectionNames) => {
  const collections = Object.keys(mongoose.connection.collections)

  await dropCollection(...collections)
}

export const dropCollection = async (...collectionNames) => {
  const promises = collectionNames.map(async (collectionName) => {
    const collection = mongoose.connection.collections[collectionName]
    if (!collection) {
      console.log(`"${collectionName}" collection not found`)
      return
    }
    await collection.deleteMany({})
    // console.log(`Deleted all documents from "${collectionName}" collection`)
  })

  try {
    await Promise.all(promises)
  } catch (error) {
    console.error('Error clearing collections:', error)
  }
}
