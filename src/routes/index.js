import SessionRouter from './session.router.js'

const instanceSessionRouter = new SessionRouter()

export const sessionRouter = instanceSessionRouter.getRouter()
