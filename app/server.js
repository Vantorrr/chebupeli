// Server.js для Railway - Next.js автоматически использует PORT из переменных окружения
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

console.log(`🚀 Starting Next.js server on port ${port}...`)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err)
      process.exit(1)
    }
    console.log(`✅ Ready on http://${hostname}:${port}`)
  })
}).catch((err) => {
  console.error('❌ Failed to prepare Next.js app:', err)
  process.exit(1)
})

