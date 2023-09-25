/* global Swal */

const btnRemoveInactives = document.getElementById('btn-rm-inactives')
const tableBody = document.getElementById('table-body')

btnRemoveInactives.addEventListener('click', async () => {
  const result = window.confirm('¿Está seguro de eliminar a los usuarios inactivos?')

  if (!result) return

  try {
    const response = await fetch('/api/users/', {
      method: 'DELETE',
    })

    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error)
    }

    const { status, payload, error } = await response.json()

    if (status === 'success') {
      const { deletedCount } = payload

      if (deletedCount === 0) {
        throw new Error('No hay usuarios inactivos')
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Usuarios eliminados',
        text: `Se eliminaron ${deletedCount} usuarios`,
        icon: 'success',
      })

      return window.location.reload()
    } else {
      throw new Error(error)
    }
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      title: 'Error',
      text: `${e.message}`,
      icon: 'error',
    })
  }
})

tableBody.addEventListener('click', async (e) => {
  if (e.target.tagName === 'BUTTON' && e.target.className === 'btn-update-user') {
    const uid = e.target.getAttribute('user-id')

    try {
      const response = await fetch(`/api/users/premium/${uid}`, {
        method: 'PUT',
      })

      const { error, status } = await response.json()

      if (!response.ok || status === 'error') {
        throw new Error(error)
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        title: `Se actualizo al usuario`,
        icon: 'success',
      })

      window.location.reload()
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `Error`,
        text: error.message,
        icon: 'error',
      })
    }
  }

  if (e.target.tagName === 'BUTTON' && e.target.className === 'delete-button') {
    const result = window.confirm('¿Está seguro de eliminar al usuario?')
    if (result) {
      const uid = e.target.getAttribute('id')

      try {
        const response = await fetch(`/api/users/${uid}`, {
          method: 'DELETE',
        })

        const { error, status } = await response.json()

        if (!response.ok || status === 'error') {
          throw new Error(error)
        }

        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          title: `Se eliminó al usuario`,
          icon: 'success',
        })

        window.location.reload()
      } catch (error) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: `Error`,
          text: error.message,
          icon: 'error',
        })
      }
    }
  }
})
