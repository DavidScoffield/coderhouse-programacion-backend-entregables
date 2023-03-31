class ProductManager {
  constructor() {
    this.products = []
  }

  getProducts = () => this.products

  getProductsById = (id) => {
    const product = this.products.find((product) => product.id === id)

    if (!product) {
      console.error('Not found')
    }

    return product
  }

  addProduct = ({ title, description, price, thumbnail, code, stock }) => {
    // Validate required fields
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Missing data')
      return
    }

    // Validate unique code field
    const productWithSameCode = this.products.find((product) => product.code === code)

    if (productWithSameCode) {
      console.error('Code already exists')
      return
    }

    // Create product
    const id = this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1

    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id,
    }

    this.products.push(product)
  }
}

const pm = new ProductManager()

console.log(pm.getProducts())

pm.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
})

console.log(pm.getProducts())

pm.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
})

console.log(pm.getProductsById(2))
