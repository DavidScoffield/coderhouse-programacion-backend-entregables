import { faker } from '@faker-js/faker/locale/es'

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price()),
    thumbnail: Array.from({ length: faker.number.int({ min: 0, max: 6 }) }, () =>
      faker.image.url()
    ),
    code: faker.string.alphanumeric(10),
    stock: faker.number.int({ min: 0, max: 200 }),
    category: faker.commerce.department(),
    status: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
}
