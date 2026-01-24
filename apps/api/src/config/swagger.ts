import type { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui'

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'Jerash CMS API',
      description: 'API documentation for Jerash Website CMS',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Hero Slides', description: 'Hero slideshow management' },
      { name: 'Settings', description: 'Site settings management' },
      { name: 'Partners', description: 'Partners management' },
      { name: 'Joint Ventures', description: 'Joint ventures management' },
      { name: 'Offices', description: 'Office locations management' },
      { name: 'Services', description: 'Services management' },
      { name: 'Gallery', description: 'Gallery images management' },
      { name: 'Jobs', description: 'Job listings management' },
      { name: 'Contact', description: 'Contact form submissions' },
      { name: 'Applications', description: 'Job applications' },
      { name: 'Media', description: 'Media library management' },
      { name: 'Users', description: 'User management (admin only)' },
      { name: 'Audit', description: 'Audit logs (admin only)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
}

export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
    persistAuthorization: true,
  },
  staticCSP: true,
}
