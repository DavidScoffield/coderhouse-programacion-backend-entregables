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

const chat = async (req, res) => {
  res.render('chat', {
    // css: 'chat',
  })
}

export default { home, realTimeProducts, chat }
