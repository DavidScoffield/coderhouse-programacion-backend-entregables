const form = document.getElementById('loginForm')
const githubButton = document.getElementById('githubButton')

form.addEventListener('submit', async function (event) {
  event.preventDefault()

  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  try {
    const response = await fetch('/api/sessions/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { status, payload, message } = await response.json()

    if (status === 'error') {
      throw new Error(message)
    }

    if (status === 'success') {
      window.location.replace('/products')
    }
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      title: 'Error al iniciar sesión',
      text: `${e.message}`,
      icon: 'error',
    })
  }
})

githubButton.addEventListener('click', (e) => {
  window.location.replace('/api/sessions/github')
})
