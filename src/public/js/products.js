/* global Swal */

// Recuperar CID (actualmente hardcodeado)
const cid = '64679c70db83fc11a4f2df62'

const tableBody = document.getElementById('table-body')

tableBody.addEventListener('click', async (e) => {
  if (e.target.className === 'btn-add-to-cart') {
    const pid = e.target.getAttribute('product-id')
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: 'POST',
    })
    const data = await response.json()
    console.log(data)

    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      title: `Se agrego el producto al carrito`,
      icon: 'success',
    })
  }
})
