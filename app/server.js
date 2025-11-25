// Server.js для Railway - Next.js автоматически использует PORT из переменных окружения
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

console.log(`🚀 Starting Next.js server on port ${port}...`)
console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'development'}`)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

let server

app.prepare().then(() => {
  server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      
      // Health check endpoint
      if (parsedUrl.pathname === '/health' || parsedUrl.pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok', service: 'velaro-mini-app' }))
        return
      }
      
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      if (!res.headersSent) {
        res.statusCode = 500
        res.end('internal server error')
      }
    }
  })
  
  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err)
      process.exit(1)
    }
    console.log(`✅ Ready on http://${hostname}:${port}`)
    console.log(`🌐 Server is listening and ready to accept connections`)
  })
  
  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}, shutting down gracefully...`)
    server.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout')
      process.exit(1)
    }, 10000)
  }
  
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
  
  // Keep process alive
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err)
    // Don't exit, let Railway handle it
  })
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
    // Don't exit, let Railway handle it
  })
  
}).catch((err) => {
  console.error('❌ Failed to prepare Next.js app:', err)
  process.exit(1)
})

