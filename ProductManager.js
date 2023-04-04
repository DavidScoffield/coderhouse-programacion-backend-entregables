class ProductManager {
  constructor() {
    this.products = []
  }

  getProducts = () => this.products

  getProductsById = (id) => {
    const product = this.products.find((product) => product.id === id)

    if (!product) {
      console.log('Not found')
    }

    return product
  }

  addProduct = ({ title, description, price, thumbnail, code, stock }) => {
    // Validate required fields
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log('Missing data')
      return
    }

    // Validate unique code field
    const productWithSameCode = this.products.find((product) => product.code === code)

    if (productWithSameCode) {
      console.log('Code already exists')
      return
    }

    // Create product id
    const id = this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1

    // Create product
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
