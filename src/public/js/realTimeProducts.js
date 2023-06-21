/* global io */

import logger from '../../utils/logger.utils.js'

const socket = io()

// DOM elements
const tbody = document.getElementById('tbody')

// Helpers
const renderProducts = (products) => {
  const productsHTML = products
    .map(
      (product) => ` 
  <tr>
    <td>${product.title}</td>
    <td>${product.code}</td>
    <td>${product.category}</td>
    <td>${product.description}</td>
    <td>${product.price}</td>
    <td>${product.stock}</td>
    <td>${product.status ? 'Disponible' : 'No disponible'}</td>
    <td><button class="delete-button" id="${product._id}">Eliminar</button></td>
  </tr>`
    )
    .join('')

  tbody.innerHTML = productsHTML
}

// Listeners
tbody.addEventListener('click', async (e) => {
  const clickedElement = e.target
  const classArray = Array.from(clickedElement.classList)
  if ((clickedElement.tagName = 'BUTTON') && classArray.includes('delete-button')) {
    const result = window.confirm('¿Está seguro de eliminar el producto?')
    if (result) {
      socket.emit('realTimeProducts:deleteProduct', clickedElement.id)
    }
  }
})

socket.on('realTimeProducts:storedProducts', (products) => {
  logger.info(products)
  renderProducts(products)
})
