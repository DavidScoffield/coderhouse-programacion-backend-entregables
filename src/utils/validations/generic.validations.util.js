const isInvalidNumber = (value) => {
  const parsedValue = Number(value)
  return value !== undefined && (isNaN(parsedValue) || parsedValue <= 0)
}

/**
 * @param {Object} data
 * @param {Object} validations
 
 * @returns {boolean}
 * @throws {ValidationError}

  @description Check if values in data are valid according to validations object
 */
const validateData = (data, validations) => {
  const keysData = Object.keys(data)
  const availableValidations = Object.keys(validations)

  const { matches, nonMatches } = keysData.reduce(
    (result, key) => {
      if (availableValidations.includes(key)) {
        result.matches.push(key)
      } else {
        result.nonMatches.push(key)
      }
      return result
    },
    { matches: [], nonMatches: [] }
  )

  if (nonMatches.length > 0) {
    logger.error(`❓Las keys |${nonMatches.join(',')}| no tienen validador`)
  }

  const validatedValues = matches.reduce((acc, property) => {
    return { ...acc, [property]: validations[property](data[property]) }
  }, {})

  // Check if all values in validatedValues are true
  return Object.values(validatedValues).every(Boolean)
}

export { validateData, isInvalidNumber }
