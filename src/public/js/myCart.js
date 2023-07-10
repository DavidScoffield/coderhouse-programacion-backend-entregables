const cartProducts = document.querySelector('.cart-products')
const cartId = JSON.parse(document.querySelector('script[data]').getAttribute('data'))

cartProducts.addEventListener('click', async (e) => {
  const clickedElement = e.target
  const classArray = Array.from(clickedElement.classList)

  const productId = clickedElement.getAttribute('product-id')

  if (clickedElement.tagName === 'BUTTON') {
    if (classArray.includes('remove-button')) {
      const result = window.confirm('¿Está seguro de eliminar el producto?')

      if (result) {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'DELETE',
        })

        if (response.status === 200) window.location.reload()
      }
    } else if (classArray.includes('update-button')) {
      const newQuantity = clickedElement.parentElement.querySelector('.quantity').value

      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      })

      if (response.status === 200) window.location.reload()
    }
  }
})
