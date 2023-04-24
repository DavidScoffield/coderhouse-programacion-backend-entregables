import { Router } from 'express'
import { pm } from '../constants/singletons.js'

const viewRouter = Router()

viewRouter.get('/', async (req, res) => {
  const products = await pm.getProducts()

  res.render('home', {
    products,
  })
})

export default viewRouter
