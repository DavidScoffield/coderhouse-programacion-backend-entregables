const info = (...params) => {
  console.log(...params)
}
const error = (...params) => {
  console.error(...params)
}

const msgIdWrong = ({ res, id }) => {
  res.status(404).send({ error: `El id '${id}' no existe` })
  console.log(`❌ ${id} does not exist`)
}

export default { info, error, msgIdWrong }
