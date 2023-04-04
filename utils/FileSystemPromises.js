import { promises as fs, existsSync } from 'fs'

export default class FileSystemPromises {
  #path

  constructor(path) {
    this.#path = path
  }

  exists = () => {
    try {
      return existsSync(this.#path)
    } catch (error) {
      console.log(error)
    }
  }

  readFile = async () => {
    try {
      const data = await fs.readFile(this.#path, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.log(error)
      throw new Error(`Error reading file or file not found: ${this.#path}}`)
    }
  }

  writeFile = async (data) => {
    try {
      const stringifiedData = JSON.stringify(data, null, 2)
      await fs.writeFile(this.#path, stringifiedData)
    } catch (error) {
      console.log(error)
      throw new Error('Error writing file')
    }
  }
}
