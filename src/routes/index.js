import CartRouter from './carts.router.js'
import ProductRouter from './products.router.js'
import SessionRouter from './session.router.js'

const instanceSessionRouter = new SessionRouter()
const instanceProductRouter = new ProductRouter()
const instanceCartRouter = new CartRouter()

export const sessionRouter = instanceSessionRouter.getRouter()
export const productRouter = instanceProductRouter.getRouter()
export const cartRouter = instanceCartRouter.getRouter()
