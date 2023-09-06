import dotenv from 'dotenv'

dotenv.config()

const ENVS = {
  production: '.env',
  development: '.env.dev',
  test: '.env.test',
}

const envFilePath = ENVS[process.env.NODE_ENV] || '.env'

dotenv.config({ path: envFilePath, override: true })
dotenv.config({ path: `.env.local`, override: true })
