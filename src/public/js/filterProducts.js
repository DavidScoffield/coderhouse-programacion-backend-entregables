const formFilterProducts = document.getElementById('form-filter-products')

formFilterProducts.addEventListener('submit', async (e) => {
  e.preventDefault()
  // Add values in a FormData object
  const formData = new FormData(formFilterProducts)

  // Validate formData, and if any of the values is empty, delete it
  for (const [key, value] of [...formData.entries()]) {
    if (value === '0') {
      formData.delete(key)
    }
  }

  // Create a URLSearchParams object
  const params = new URLSearchParams(formData)
  // Get the URL
  const url = window.location.href
  // Get the URL without the query string
  const urlWithoutQueryString = url.split('?')[0]

  // Get the query string
  const queryString = params.toString()

  // Get the new URL
  const newUrl = `${urlWithoutQueryString}?${queryString}`

  // Redirect to the new URL
  window.location.href = newUrl
})
