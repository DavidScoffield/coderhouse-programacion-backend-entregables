import { faker } from '@faker-js/faker/locale/es'
import { USER_ROLES } from '../constants/constants.js'

export const generateUser = ({ lastConnection = null }) => {
  return {
    id: faker.database.mongodbObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 65 }),
    password: faker.internet.password(),
    role: [USER_ROLES.USER, USER_ROLES.PREMIUM][faker.number.int({ min: 0, max: 1 })],
    cart: faker.database.mongodbObjectId(),
    lastConnection: lastConnection || faker.date.past(),
    documents: Array.from({ length: faker.number.int({ min: 0, max: 6 }) }, () => ({
      name: faker.commerce.productName(),
      reference: faker.image.url(),
    })),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
}
