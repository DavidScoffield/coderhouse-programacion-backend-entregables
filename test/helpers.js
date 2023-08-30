import '../src/config/env.config.js'

import { MongoSingleton } from '../src/config/mongodb.config.js'

export const mongoConection = MongoSingleton.getInstance()
