/* global Swal */

const form = document.getElementById('restorePasswordForm')

form.addEventListener('submit', async function (event) {
  event.preventDefault()

  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  try {
    const response = await fetch('/api/sessions/restorePassword', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { status, message } = await response.json()

    if (status === 'error') {
      throw new Error(message)
    }

    if (status === 'success') {
      window.location.replace('/login')
    }
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      title: 'Error al restaurar la contraseña',
      text: `${e.message}`,
      icon: 'error',
    })
  }
})
