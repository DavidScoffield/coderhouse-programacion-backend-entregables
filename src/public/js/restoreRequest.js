/* global Swal */

const form = document.getElementById('restoreRequestForm')

form.addEventListener('submit', async function (event) {
  event.preventDefault()

  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  try {
    const response = await fetch('/api/sessions/restoreRequest', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { status, error } = await response.json()

    if (status === 'error') {
      throw new Error(error)
    }

    if (status === 'success') {
      const PsuccessRestore = document.getElementById('successRestore')
      PsuccessRestore.innerHTML =
        'Se ha enviado un mail a tu casilla de correo para restaurar tu contraseña'
    }
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      title: 'Error en el proceso',
      text: `${e.message}`,
      icon: 'error',
    })
  }
})
