import crypto from 'crypto'

export const generateCodeString = (length = 15) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const codeArray = []
  const characterCount = characters.length

  for (let i = 0; i < length; i++) {
    const randomBytes = crypto.randomBytes(1)
    const randomIndex = randomBytes[0] % characterCount
    const randomChar = characters.charAt(randomIndex)
    codeArray.push(randomChar)
  }

  return codeArray.join('')
}
