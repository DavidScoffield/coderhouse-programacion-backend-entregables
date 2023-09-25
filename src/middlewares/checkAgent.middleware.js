export const checkAgent = (req, res, next) => {
  const userAgent = req.headers['user-agent']
  const acceptHeader = req.headers.accept

  if (!userAgent) return next()

  const isMobile = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  )
  const isDesktop = userAgent.match(/Chrome|Safari/i)

  const isTablet = userAgent.match(/iPad|Kindle|Tablet|Silk|PlayBook|Nexus|Xoom/i)

  if (isMobile) {
    req.isMobile = true
  } else if (isDesktop) {
    req.isDesktop = true
  } else if (isTablet) {
    req.isTablet = true
  }

  if (!acceptHeader) return next()

  if (acceptHeader.includes('text/html')) {
    req.isBrowser = true
  } else {
    req.isApi = true
  }

  next()
}
