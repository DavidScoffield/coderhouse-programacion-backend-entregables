/* global Swal */

const form = document.getElementById('registerForm')

form.addEventListener('submit', async function (event) {
  event.preventDefault()

  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  try {
    const response = await fetch('/api/sessions/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const { error } = await response.json()
      console.log(error)
      throw new Error(error)
    }

    const { status } = await response.json()

    if (status === 'success') {
      window.location.replace('/login')
    }
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      title: 'Error al registrarse',
      text: `${e.message}`,
      icon: 'error',
    })
  }
})
