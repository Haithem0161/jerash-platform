import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import sensible from '@fastify/sensible'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config, isDev } from './config/index.js'
import { corsConfig } from './config/cors.js'
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js'
import { setupErrorHandler } from './utils/errors.js'

import prismaPlugin from './plugins/prisma.js'
import authPlugin from './plugins/auth.js'

// Import route modules
import authRoutes from './modules/auth/auth.routes.js'
import heroSlidesRoutes from './modules/hero-slides/hero-slides.routes.js'
import settingsRoutes from './modules/settings/settings.routes.js'
import partnersRoutes from './modules/partners/partners.routes.js'
import jointVenturesRoutes from './modules/joint-ventures/joint-ventures.routes.js'
import officesRoutes from './modules/offices/offices.routes.js'
import servicesRoutes from './modules/services/services.routes.js'
import galleryRoutes from './modules/gallery/gallery.routes.js'
import jobsRoutes from './modules/jobs/jobs.routes.js'
import contactRoutes from './modules/contact/contact.routes.js'
import applicationsRoutes from './modules/applications/applications.routes.js'
import mediaRoutes from './modules/media/media.routes.js'
import usersRoutes from './modules/users/users.routes.js'
import auditRoutes from './modules/audit/audit.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: isDev ? 'info' : 'warn',
      transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    },
  })

  // Setup error handler
  setupErrorHandler(fastify)

  // Register core plugins
  await fastify.register(sensible)
  await fastify.register(cors, corsConfig)
  await fastify.register(multipart, {
    limits: {
      fileSize: config.MAX_FILE_SIZE,
    },
  })

  // Serve uploaded files
  await fastify.register(staticFiles, {
    root: path.resolve(__dirname, '..', config.UPLOAD_DIR),
    prefix: '/uploads/',
    decorateReply: false,
  })

  // API documentation
  await fastify.register(swagger, swaggerConfig)
  await fastify.register(swaggerUi, swaggerUiConfig)

  // Database
  await fastify.register(prismaPlugin)

  // Authentication
  await fastify.register(authPlugin)

  // Health check
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // Register routes
  await fastify.register(authRoutes, { prefix: '/auth' })
  await fastify.register(heroSlidesRoutes, { prefix: '/hero-slides' })
  await fastify.register(settingsRoutes, { prefix: '/settings' })
  await fastify.register(partnersRoutes, { prefix: '/partners' })
  await fastify.register(jointVenturesRoutes, { prefix: '/joint-ventures' })
  await fastify.register(officesRoutes, { prefix: '/offices' })
  await fastify.register(servicesRoutes, { prefix: '/services' })
  await fastify.register(galleryRoutes, { prefix: '/gallery' })
  await fastify.register(jobsRoutes, { prefix: '/jobs' })
  await fastify.register(contactRoutes, { prefix: '/contact' })
  await fastify.register(applicationsRoutes, { prefix: '/applications' })
  await fastify.register(mediaRoutes, { prefix: '/admin/media' })
  await fastify.register(usersRoutes, { prefix: '/admin/users' })
  await fastify.register(auditRoutes, { prefix: '/admin/audit-logs' })

  return fastify
}
