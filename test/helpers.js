import crypto from 'crypto'
import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import '../src/config/env.config.js'

import { createCanvas } from 'canvas'
import { MongoSingleton } from '../src/config/mongodb.config.js'
import { MULTER_PATH_FOLDER } from '../src/constants/constants.js'
import { __root } from '../src/utils/dirname.utils.js'

// MONGO HELPERS --------------------------------->

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
// MONGO HELPERS ---------------------------------<

// GENERATE FILES HELPERS --------------------------------->
const folderPath = path.join(__root, 'test', 'files')

// Function to generate random files in a folder (folderPath).
export const createRandomFilesInFolder = async ({
  numberOfFiles = 4,
  maxSizeInMB = 10,
  specificSizeInMB = null,
}) => {
  const filePaths = []

  await fs.promises.mkdir(folderPath, { recursive: true })

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
    await fs.promises.writeFile(filePath, fileContent)

    // Add the file path to the array
    filePaths.push(filePath)
  }

  return filePaths
}

// Function to generate random data for a file.
// Can be used libraries like `crypto` or `faker` to generate random content.
const generateRandomData = (sizeInMB) => {
  // create a buffer with random bytes.
  const bufferSize = sizeInMB * 1024 * 1024 // Convert MB to bytes
  const randomData = Buffer.alloc(bufferSize)
  for (let i = 0; i < bufferSize; i++) {
    randomData[i] = Math.floor(Math.random() * 256) // Random byte (0-255)
  }
  return randomData
}

// Function to create a single random file in memory.
const createRandomFileInMemory = (sizeInMB, predefinedFileName = '') => {
  const randomData = generateRandomData(sizeInMB)
  const filename = predefinedFileName || `${Date.now()}_random_file` // Unique filename based on timestamp
  const filenameWithExtension = `${filename}.txt`
  return {
    name: filenameWithExtension,
    content: randomData,
  }
}

// Main function to create random files in memory and return them.
export const createRandomFilesInMemory = ({
  numberOfFiles = 4,
  maxSizeInMB = 10,
  specificSizeInMB = null,
  predefinedFileName = '',
}) => {
  const fileName = numberOfFiles > 1 ? '' : predefinedFileName

  const randomFiles = []
  for (let i = 0; i < numberOfFiles; i++) {
    const sizeInMB = specificSizeInMB || Math.random() * (maxSizeInMB - 1) + 1 // Random size between 1MB and maxSizeInMB

    const randomFile = createRandomFileInMemory(sizeInMB, fileName)
    randomFiles.push(randomFile)
  }
  return randomFiles
}
// GENERATE FILES HELPERS ---------------------------------<

// GENERATE IMAGES HELPERS --------------------------------->

/// Function to create an in-memory image with a specific size in MB
const generateImage = (sizeInMB = 10) => {
  // Calculate the width and height of the canvas based on the size in MB
  const sizeInBytes = sizeInMB * 1024 * 1024
  const width = 400 // Fixed width for this example
  const height = Math.floor(sizeInBytes / (width * 4)) // 4 bytes per RGBA pixel

  // Create a canvas with the calculated size
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  // Draw something on the canvas (e.g., a red rectangle)
  context.fillStyle = 'red'
  context.fillRect(0, 0, width, height)

  // Convert the canvas to a buffer in PNG format
  const imageBuffer = canvas.toBuffer('image/png')
  return imageBuffer
}

// Function to create a single random file in memory.
const createImageInMemory = (sizeInMB) => {
  const image = generateImage(sizeInMB)
  const filename = `${Date.now()}_image.png`
  return {
    name: filename,
    content: image,
  }
}

// Main function to create random files in memory and return them.
export const createImagesInMemory = ({
  numberOfImages = 4,
  maxSizeInMB = 10,
  specificSizeInMB = null,
}) => {
  const randomImages = []
  for (let i = 0; i < numberOfImages; i++) {
    const sizeInMB = specificSizeInMB || Math.floor(Math.random() * maxSizeInMB) + 1 // Random size between 1MB and maxSizeInMB

    const randomImage = createImageInMemory(sizeInMB)

    randomImages.push(randomImage)
  }
  return randomImages
}

// GENERATE IMAGES HELPERS ---------------------------------<

// DELETE FILES HELPERS --------------------------------->
export const deleteRandomFiles = async (...paths) => {
  const options = {
    recursive: true,
    force: true,
  }
  try {
    if (paths.length === 0) {
      await fs.promises.rm(MULTER_PATH_FOLDER, options)
      await fs.promises.rm(folderPath, options)
      return
    }
    await Promise.all(paths.map((path) => fs.promises.rm(path, options)))
  } catch (error) {
    console.error('Error clearing files:', error)
  }
}
// DELETE FILES HELPERS ---------------------------------<
