import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

export function formatZodError(error: ZodError) {
  const details: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!details[path]) {
      details[path] = []
    }
    details[path].push(issue.message)
  }

  return {
    message: 'Validation error',
    code: 'VALIDATION_ERROR',
    details,
  }
}

interface FastifyError extends Error {
  statusCode?: number
  code?: string
}

interface PrismaError extends Error {
  code: string
  meta?: { target?: string[] }
}

export function setupErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, _request, reply) => {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send(formatZodError(error))
    }

    // Handle Fastify errors (from @fastify/sensible)
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        message: error.message,
        code: error.code || 'ERROR',
      })
    }

    // Handle Prisma errors
    if (error.constructor.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as unknown as PrismaError

      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target?.join(', ') || 'field'
        return reply.status(409).send({
          message: `A record with this ${target} already exists`,
          code: 'DUPLICATE_ENTRY',
        })
      }

      if (prismaError.code === 'P2025') {
        return reply.status(404).send({
          message: 'Record not found',
          code: 'NOT_FOUND',
        })
      }
    }

    // Log unexpected errors
    fastify.log.error(error)

    // Generic error response
    return reply.status(500).send({
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    })
  })
}
