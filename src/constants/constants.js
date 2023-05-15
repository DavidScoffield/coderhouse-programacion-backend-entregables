import dotenv from 'dotenv'

dotenv.config()

// Server
const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI
const PERSISTENCE_TYPE = process.env.PERSISTANCE_TYPE
const PATH_OF_PRODUCTS = './productos.json'
const PATH_OF_CARTS = './carrito.json'

export { PORT, PATH_OF_PRODUCTS, PATH_OF_CARTS, MONGO_URI, PERSISTENCE_TYPE }
