import { buildApp } from './app.js'
import { config } from './config/index.js'

async function main() {
  const app = await buildApp()

  try {
    await app.listen({ port: config.PORT, host: config.HOST })
    console.log(`🚀 Server running at http://${config.HOST}:${config.PORT}`)
    console.log(`📚 API docs at http://${config.HOST}:${config.PORT}/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
