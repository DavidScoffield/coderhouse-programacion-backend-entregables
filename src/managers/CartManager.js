import FileSystemPromises from '../utils/FileSystemPromises.js'

export default class CartManager {
  #path

  constructor(path) {
    this.#path = path
    this.fsp = new FileSystemPromises(path)
  }

  #nextId = (carts) => (carts.length === 0 ? 1 : carts[carts.length - 1].id + 1)

  #getCarts = async () => {
    if (this.fsp.exists()) {
      return await this.fsp.readFile()
    } else {
      return []
    }
  }

  getCartsById = async (id) => {
    const carts = await this.#getCarts()

    const cart = carts.find((cart) => cart.id === id)

    if (!cart) {
      console.log(`Cart with id "${id}" not exist in list`)
      throw new Error(`Cart with id "${id}" not exist in list`)
    }

    return cart
  }

  addCart = async () => {
    const carts = await this.#getCarts()

    const id = this.#nextId(carts)

    const cart = {
      id,
      products: [],
    }

    const arrayWithNewCart = [...carts, cart]

    await this.fsp.writeFile(arrayWithNewCart)
    return cart
  }

  // addProduct = async ({ title, description, price, thumbnail, code, stock, category, status }) => {
  //   // Validate required fields
  //   if (
  //     !title ||
  //     !description ||
  //     !price ||
  //     !thumbnail ||
  //     !code ||
  //     !stock ||
  //     !category ||
  //     status === undefined
  //   ) {
  //     throw new Error('Missing data to create product')
  //   }

  //   // Get products
  //   const products = await this.getProducts()

  //   // Validate unique code field
  //   const productWithSameCode = products.find((product) => product.code === code)

  //   if (productWithSameCode) {
  //     throw new Error(`Code: "${code}" already exists`)
  //   }

  //   // Create product id
  //   const id = this.#nextId(products)

  //   // Create product
  //   const product = {
  //     title,
  //     description,
  //     price,
  //     thumbnail,
  //     code,
  //     stock,
  //     category,
  //     status,
  //     id,
  //   }

  //   const arrayWithNewProduct = [...products, product]

  //   await this.fsp.writeFile(arrayWithNewProduct)
  //   return product
  // }

  // updateProduct = async (
  //   id,
  //   { title, description, price, thumbnail, code, stock, category, status }
  // ) => {
  //   // Validate required fields
  //   if (
  //     !title &&
  //     !description &&
  //     !price &&
  //     !thumbnail &&
  //     !code &&
  //     !stock &&
  //     !category &&
  //     status === undefined
  //   ) {
  //     throw new Error('Must provide at least one field to update')
  //   }

  //   // Get products
  //   const products = await this.getProducts()

  //   // Validate unique code field
  //   const productWithSameCode = products.find(
  //     (product) => product.code === code && product.id !== id
  //   )

  //   if (productWithSameCode) {
  //     throw new Error(`Code: "${code}" already exists`)
  //   }

  //   // Validate product id
  //   const product = products.find((product) => product.id === id)

  //   if (!product) {
  //     throw new Error(`Product with id "${id}" not found in list for update`)
  //   }

  //   // Create product
  //   const updatedProduct = {
  //     title: title || product.title,
  //     description: description || product.description,
  //     price: price || product.price,
  //     thumbnail: thumbnail || product.thumbnail,
  //     code: code || product.code,
  //     stock: stock || product.stock,
  //     category: category || product.category,
  //     status: status !== undefined ? status : product.status,
  //     id,
  //   }

  //   const arrayWithUpdatedProduct = products.map((product) =>
  //     product.id === id ? updatedProduct : product
  //   )

  //   await this.fsp.writeFile(arrayWithUpdatedProduct)
  //   return product
  // }

  // deleteProduct = async (id) => {
  //   // Get products
  //   const products = await this.getProducts()

  //   // Validate product id
  //   const product = products.find((product) => product.id === id)

  //   if (!product) {
  //     throw new Error(`Product with id "${id}" not found in list for deletion`)
  //   }

  //   const arrayWithDeletedProduct = products.filter((product) => product.id !== id)

  //   await this.fsp.writeFile(arrayWithDeletedProduct)
  // }
}
