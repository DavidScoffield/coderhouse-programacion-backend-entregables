export const PRIVACY_TYPES = {
  PRIVATE: 'PRIVATE',
  NO_AUTH: 'NO_AUTH',
}

const STRATEGIES = {
  [PRIVACY_TYPES.PRIVATE]: (user, res, next) => {
    if (!user) res.redirect('/login')
    else next()
  },
  [PRIVACY_TYPES.NO_AUTH]: (user, res, next) => {
    if (user) res.redirect('/profile')
    else next()
  },
}

export const privacy = (privacyType) => {
  return async (req, res, next) => {
    const { user } = req.session
    const strategyFn = STRATEGIES[privacyType]
    strategyFn(user, res, next)
  }
}
