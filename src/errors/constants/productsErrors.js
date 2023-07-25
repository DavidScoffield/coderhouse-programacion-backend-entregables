export const productErrorIncompleteValues = (product) => {
  return `Uno o más parámetros obligatorios no fueron proporcionados:
  Propiedades obligatorias:
  * title: se esperaba una cadena definida, y se recibió |${product.title}|;
  * description: se esperaba una cadena definida, y se recibió |${product.description}|;
  * code: se esperaba una cadena definida, y se recibió |${product.code}|;
  * stock: se esperaba un número definido, y se recibió |${product.stock}|;
  * category: se esperaba una cadena definida, y se recibió |${product.category}|;
  * price: se esperaba un número definido, y se recibió |${product.price}|;`
}

export const productErrorInvalidTypes = (product) => {
  return `Uno o más parámetros tienen un tipo inválido:
  * title: se esperaba una cadena, y se recibió ${typeof product.title};
  * description: se esperaba una cadena, y se recibió ${typeof product.description};
  * code: se esperaba una cadena, y se recibió ${typeof product.code};
  * stock: se esperaba un número, y se recibió ${typeof product.stock};
  * category: se esperaba una cadena, y se recibió ${typeof product.category};
  * price: se esperaba un número, y se recibió ${typeof product.price};`
}

export const productErrorAtLeastOne = (product) => {
  return `Se esperaba al menos un parámetro para actualizar, y se recibió:
  * title: ${product.title};
  * description: ${product.description};
  * code: ${product.code};
  * stock: ${product.stock};
  * category: ${product.category};
  * status: ${product.status};
  * thumbnail: ${product.thumbnail};
  * price: ${product.price};`
}
