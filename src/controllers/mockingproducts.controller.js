import { generateProduct } from '../mocks/products.mock.js'

const mockProducts = (req, res) => {
  const products = Array.from({ length: 100 }, () => generateProduct())

  res.sendSuccessWithPayload({
    message: 'Los products fueron generados con exito',
    payload: { products },
  })
}

export default { mockProducts }
