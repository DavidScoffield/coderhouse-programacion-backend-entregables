const info = (...params) => {
  console.log('❔ INFO |', ...params)
}
const error = (...params) => {
  console.log('-----------------------------------------')
  console.error('❌ ERROR |', [...params].join('\n'))
  console.log('-----------------------------------------')
}

const msgIdWrong = ({ res, id }) => {
  res.status(404).send({ error: `El id '${id}' no existe` })
  console.log(`❌ ${id} does not exist`)
}

export default { info, error, msgIdWrong }
