import TicketDTO from '../../dto/TicketDTO.js'
import { productRepository, ticketRepository } from './index.js'

export default class CartRepository {
  constructor(dao) {
    this.dao = dao
  }

  getCartById = (id, { lean } = {}) => {
    return this.dao.getCartById(id, { lean })
  }

  addCart = () => {
    return this.dao.addCart()
  }

  addProductToCart = ({ cart, productId, quantity }) => {
    return this.dao.addProductToCart({ cart, productId, quantity })
  }

  removeProductFromCart = ({ cart, productId }) => {
    return this.dao.removeProductFromCart({ cart, productId })
  }

  removeAllProductFromCart = (cartId) => {
    return this.dao.removeAllProductFromCart(cartId)
  }

  updateQuantityOfProductInCart = ({ cartId, productId, quantity }) => {
    return this.dao.updateQuantityOfProductInCart({ cartId, productId, quantity })
  }

  updateCartWithProducts = ({ cartId, products }) => {
    return this.dao.updateCartWithProducts({ cartId, products })
  }

  purchaseCart = async ({ cartId, purchaserEmail }) => {
    const cart = await this.getCartById(cartId)

    // Filter products with invalid stock
    const { validStock, invalidStock } = this.#filterProductsByValidStock(cart.products)

    // Get the ids of products with invalid stock
    const productIdsWithInvalidStock = invalidStock.map(({ _id }) => _id._id)

    // Validate if valid stock is not empty
    if (validStock.length === 0) {
      return { productIdsWithInvalidStock, ticket: null }
    }

    // Update stock of products with valid stock
    validStock.forEach(async ({ _id: product, quantity }) => {
      const { _id: productId, stock } = product
      const newStock = stock - quantity

      await productRepository.updateProduct(productId, { stock: newStock })
    })

    // Calculate amount of ticket
    const amount = validStock.reduce((acc, { _id: product, quantity }) => {
      const { price } = product
      return acc + price * quantity
    }, 0)

    // Remove all valid products from cart
    await this.updateCartWithProducts({ cartId, products: invalidStock })

    // Create ticket with amount and purchaser
    const newTicket = await ticketRepository.createTicket({ amount, purchaser: purchaserEmail })

    const ticketDTO = new TicketDTO(newTicket)

    // Return the ids of products with invalid stock and the ticket
    return { productIdsWithInvalidStock, ticket: ticketDTO }
  }

  #filterProductsByValidStock = (products = []) => {
    const { validStock, invalidStock } = products.reduce(
      (acc, productCart) => {
        const { _id: product, quantity } = productCart
        const { stock: productStock } = product

        if (productStock < quantity) {
          acc.invalidStock.push(productCart)
        } else {
          acc.validStock.push(productCart)
        }

        return acc
      },
      { validStock: [], invalidStock: [] }
    )

    return { validStock, invalidStock }
  }
}
