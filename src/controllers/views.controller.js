import { PM } from '../constants/singletons.js'

const home = async (req, res) => {
  const products = await PM.getProducts()

  res.render('home', {
    products,
  })
}

const realTimeProducts = async (req, res) => {
  res.render('realtimeproducts', {
    css: 'realTimeProducts',
  })
}

export default { home, realTimeProducts }
