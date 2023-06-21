// # Mongo credentials
export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASS = process.env.MONGO_PASS
export const MONGO_HOST = process.env.MONGO_HOST
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME

// # App credentials
export const PERSISTENCE_TYPE = process.env.PERSISTENCE_TYPE
export const SECRET_SESSION = process.env.SECRET_SESSION || 'secret'
export const SECRET_JWT = process.env.SECRET_JWT || 'jwtSecret'

// # Admin credentials
export const ADMIN_USER = process.env.ADMIN_USER
export const ADMIN_PASS = process.env.ADMIN_PASS

// # Server credentials
export const PORT = process.env.SERVER_PORT || 8080
export const HOST = process.env.SERVER_HOST || 'localhost'

// Github credentials
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
export const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL
