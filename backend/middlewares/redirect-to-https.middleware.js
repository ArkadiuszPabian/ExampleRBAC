export function redirectToHTTPS() {
  return (req, res, next) => {
    if (req.protocol !== 'https') {
      // Redirect HTTP to HTTPS
      return res.redirect(`https://${req.headers.host}${req.url}`)
    }
    next()
  }
}
