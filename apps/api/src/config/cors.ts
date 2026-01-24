import type { FastifyCorsOptions } from '@fastify/cors'
import { config } from './index.js'

export const corsConfig: FastifyCorsOptions = {
  origin: config.CORS_ORIGIN.split(',').map((o) => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
}
