/* global Swal */

const form = document.getElementById('restorePasswordForm')
const urlParams = new Proxy(new URLSearchParams(window.location.search), {
  get: (target, prop) => target.get(prop) || '',
})

form.addEventListener('submit', async function (event) {
  event.preventDefault()

  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  const dataWithToken = {
    ...data,
    token: urlParams.token,
  }

  try {
    const response = await fetch('/api/sessions/restorePassword', {
      method: 'PUT',
      body: JSON.stringify(dataWithToken),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const { status, error } = await response.json()
    if (status === 'error') {
      throw new Error(error)
    }
    if (status === 'success') {
      window.location.replace('/login')
    }
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      title: 'Error al restaurar la contraseña',
      text: `${e.message}`,
      icon: 'error',
    })
  }
})
