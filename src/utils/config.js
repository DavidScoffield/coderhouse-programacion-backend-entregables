import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8080
const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB_NAME } = process.env
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`
const PERSISTENCE_TYPE = process.env.PERSISTANCE_TYPE

export default { PORT, MONGO_URI, PERSISTENCE_TYPE }
