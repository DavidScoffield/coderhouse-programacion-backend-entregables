import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import '../src/config/env.config.js'
import crypto from 'crypto'

import { MongoSingleton } from '../src/config/mongodb.config.js'
import { __root } from '../src/utils/dirname.utils.js'
import { MULTER_PATH_FOLDER } from '../src/constants/constants.js'

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
  })

  try {
    await Promise.all(promises)
  } catch (error) {
    console.error('Error clearing collections:', error)
  }
}

const folderPath = path.join(__root, 'test', 'files')

export const generateRandomFiles = ({
  numberOfFiles = 4,
  maxSizeInMB = 10,
  specificSizeInMB = null,
}) => {
  const filePaths = []

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }

  for (let i = 0; i < numberOfFiles; i++) {
    // Generate a random file size between 1 MB and maxSizeInMB MB
    const randomSizeInMB = Math.random() * (maxSizeInMB - 1) + 1
    const sizeInMB = specificSizeInMB || randomSizeInMB
    const sizeInBytes = sizeInMB * 1024 * 1024

    // Generate a unique file name based on a random string
    const randomString = crypto.randomBytes(20).toString('hex')
    const fileName = `${randomString}.txt`

    const filePath = path.join(folderPath, fileName)

    // Create random data for the file
    const fileContent = crypto.randomBytes(sizeInBytes)

    // Write the data to the file
    fs.writeFileSync(filePath, fileContent)

    // Add the file path to the array
    filePaths.push(filePath)
  }

  return filePaths
}

export const deleteRandomFiles = () => {
  fs.rmSync(folderPath, { recursive: true })
  fs.rmSync(MULTER_PATH_FOLDER, { recursive: true })
}
