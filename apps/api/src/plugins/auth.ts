import fastifyJwt from '@fastify/jwt'
import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { config } from '../config/index.js'
import type { UserRole } from '@repo/types'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>
    authorizeRoles: (...roles: UserRole[]) => (request: FastifyRequest) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string
      email: string
      role: UserRole
    }
    user: {
      userId: string
      email: string
      role: UserRole
    }
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Register JWT
  await fastify.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    sign: {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    },
  })

  // Authentication decorator
  fastify.decorate('authenticate', async function (request: FastifyRequest) {
    try {
      await request.jwtVerify()
    } catch (err) {
      throw fastify.httpErrors.unauthorized('Invalid or expired token')
    }
  })

  // Role-based authorization decorator
  fastify.decorate('authorizeRoles', function (...roles: UserRole[]) {
    return async function (request: FastifyRequest) {
      await fastify.authenticate(request)

      const userRole = request.user.role as UserRole
      if (!roles.includes(userRole)) {
        throw fastify.httpErrors.forbidden('Insufficient permissions')
      }
    }
  })
}

export default fp(authPlugin, {
  name: 'auth',
  dependencies: ['@fastify/sensible'],
})
