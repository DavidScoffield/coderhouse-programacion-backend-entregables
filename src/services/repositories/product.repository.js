export default class ProductRepository {
  constructor(dao) {
    this.dao = dao
  }

  getProducts = ({ limit, page, sort, query } = {}) => {
    return this.dao.getProducts({ limit, page, sort, query })
  }

  getProductById = (id) => {
    return this.dao.getProductById(id)
  }

  addProduct = ({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status,
    owner,
    images,
  }) => {
    return this.dao.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
      owner,
      images,
    })
  }

  updateProduct = (id, { title, description, price, thumbnail, code, stock, category, status }) => {
    return this.dao.updateProduct(id, {
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
    return this.dao.deleteProduct(id)
  }

  getCategories = () => {
    return this.dao.getCategories()
  }
}
