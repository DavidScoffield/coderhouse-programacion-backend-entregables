import { isCommonParamsValid } from './products.validations.util.js'

const validateProductArray = (products) => {
  const { valids, invalids } = products.reduce(
    (acc, product) => {
      const { id, quantity } = product
      try {
        isCommonParamsValid({ id, quantity })
        acc.valids.push(product)
      } catch (error) {
        const { message } = error
        product.reason = message
        acc.invalids.push(product)
      }

      return acc
    },
    { valids: [], invalids: [] }
  )

  return { valids, invalids }
}

export { validateProductArray }
