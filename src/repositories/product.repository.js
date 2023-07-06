export default class ProductRepository {
  constructor(dao) {
    this.dao = dao
  }

  getProducts = ({ limit, page, sort, query } = {}) => {
    this.dao.getProducts({ limit, page, sort, query })
  }

  getProductById = (id) => {
    this.dao.getProductById(id)
  }

  addProduct = ({ title, description, price, thumbnail, code, stock, category, status }) => {
    this.dao.addProduct({ title, description, price, thumbnail, code, stock, category, status })
  }

  updateProduct = (id, { title, description, price, thumbnail, code, stock, category, status }) => {
    this.dao.updateProduct(id, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    })
  }

  deleteProduct = (id) => {
    this.dao.deleteProduct(id)
  }

  getCategories = () => {
    this.dao.getCategories()
  }
}
