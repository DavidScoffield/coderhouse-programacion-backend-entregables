import { promises as fs, existsSync } from 'fs'
import logger from '../../../utils/logger.js'

export default class FileSystemPromises {
  #path

  constructor(path) {
    this.#path = path
  }

  exists = () => {
    try {
      return existsSync(this.#path)
    } catch (error) {
      logger.error(error)
    }
  }

  readFile = async () => {
    try {
      const data = await fs.readFile(this.#path, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      logger.error(error)
      throw new Error(`Error reading file or file not found: ${this.#path}}`)
    }
  }

  writeFile = async (data) => {
    try {
      const stringifiedData = JSON.stringify(data, null, 2)
      await fs.writeFile(this.#path, stringifiedData)
    } catch (error) {
      logger.error(error)
      throw new Error('Error writing file')
    }
  }
}
