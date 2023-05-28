const prevBtn = document.getElementById('prev-page')
const nextBtn = document.getElementById('next-page')

const hydratePagination = (btn) => {
  const link = btn.getAttribute('href')

  const paramsString = link.split('?')[1]
  const page = link ? new URLSearchParams(paramsString).get('page') : 1

  const params = new URLSearchParams(window.location.search)
  params.set('page', page)

  btn.setAttribute('href', `${window.location.pathname}?${params.toString()}`)
}

if (prevBtn) {
  hydratePagination(prevBtn)
}

if (nextBtn) {
  hydratePagination(nextBtn)
}
