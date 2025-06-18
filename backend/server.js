import app from './app.js'
import initDb from './services/db-init.service.js'

initDb()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server listening on port 3000')
    })
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err)
    process.exit(1)
  })
