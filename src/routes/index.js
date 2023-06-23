import ProductRouter from './products.router.js'
import SessionRouter from './session.router.js'

const instanceSessionRouter = new SessionRouter()
const instanceProductRouter = new ProductRouter()

export const sessionRouter = instanceSessionRouter.getRouter()
export const productRouter = instanceProductRouter.getRouter()
