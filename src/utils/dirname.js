import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __src = dirname(dirname(__filename))
const __root = dirname(dirname(dirname(__filename)))

export { __src, __root }
