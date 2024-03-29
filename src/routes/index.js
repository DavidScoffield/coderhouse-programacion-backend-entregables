import CartRouter from './carts.router.js'
import HealthcheckRouter from './healthcheck.router.js'
import ProductRouter from './products.router.js'
import SessionRouter from './session.router.js'
import ViewRouter from './views.router.js'
import MockingProductsRouter from './mockingproducts.router.js'
import LoggerRouter from './logger.router.js'
import UserRouter from './users.router.js'

const instanceSessionRouter = new SessionRouter()
const instanceProductRouter = new ProductRouter()
const instanceCartRouter = new CartRouter()
const intanceHealthcheckRouter = new HealthcheckRouter()
const instanceViewRouter = new ViewRouter()
const instanceMockingProductsRouter = new MockingProductsRouter()
const instanceLoggerRouter = new LoggerRouter()
const instanceUserRouter = new UserRouter()

export const sessionRouter = instanceSessionRouter.getRouter()
export const productRouter = instanceProductRouter.getRouter()
export const cartRouter = instanceCartRouter.getRouter()
export const healthcheckRouter = intanceHealthcheckRouter.getRouter()
export const viewRouter = instanceViewRouter.getRouter()
export const mockingProductsRouter = instanceMockingProductsRouter.getRouter()
export const loggerRouter = instanceLoggerRouter.getRouter()
export const userRouter = instanceUserRouter.getRouter()
