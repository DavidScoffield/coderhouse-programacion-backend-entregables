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
}
