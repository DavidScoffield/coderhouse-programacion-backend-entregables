/* global Swal */

// select element from DOM where id = logoutButton
const logoutButton = document.getElementById('logout-button')

logoutButton.addEventListener('click', async (e) => {
  try {
    const response = await fetch('/api/sessions/logout', {
      method: 'GET',
    })

    const { status, error } = await response.json()

    if (status === 'success') {
      window.location.replace('/login')
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      })
    }
  } catch (error) {
    console.log(error)
  }
})
