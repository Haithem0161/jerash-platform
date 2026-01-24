import type { FastifyPluginAsync } from 'fastify'
import { userCreateSchema, userUpdateSchema } from '@repo/validation'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

const usersRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /admin/users - List users (SUPER_ADMIN only)
  fastify.get('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN')],
    schema: {
      tags: ['Users'],
      summary: 'List all users',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const users = await fastify.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return { data: users }
  })

  // GET /admin/users/:id
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN')],
    schema: {
      tags: ['Users'],
      summary: 'Get user by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const user = await fastify.prisma.user.findUnique({
      where: { id: request.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!user) {
      throw fastify.httpErrors.notFound('User not found')
    }
    return { data: user }
  })

  // POST /admin/users - Create user
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN')],
    schema: {
      tags: ['Users'],
      summary: 'Create new user',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = userCreateSchema.parse(request.body)

    // Check if email already exists
    const existing = await fastify.prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      throw fastify.httpErrors.conflict('Email already exists')
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)

    const user = await fastify.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { data: user }
  })

  // PATCH /admin/users/:id - Update user
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN')],
    schema: {
      tags: ['Users'],
      summary: 'Update user',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = userUpdateSchema.parse(request.body)

    // Check if email is being changed and already exists
    if (data.email) {
      const existing = await fastify.prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: request.params.id },
        },
      })
      if (existing) {
        throw fastify.httpErrors.conflict('Email already exists')
      }
    }

    const user = await fastify.prisma.user.update({
      where: { id: request.params.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { data: user }
  })

  // DELETE /admin/users/:id - Delete user
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN')],
    schema: {
      tags: ['Users'],
      summary: 'Delete user',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    // Prevent self-deletion
    if (request.params.id === request.user.userId) {
      throw fastify.httpErrors.forbidden('Cannot delete your own account')
    }

    // Delete all sessions
    await fastify.prisma.session.deleteMany({
      where: { userId: request.params.id },
    })

    await fastify.prisma.user.delete({
      where: { id: request.params.id },
    })

    return { message: 'User deleted' }
  })

  // POST /admin/users/:id/reset-password - Reset user password
  fastify.post<{ Params: { id: string } }>('/:id/reset-password', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN')],
    schema: {
      tags: ['Users'],
      summary: 'Reset user password',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { password } = request.body as { password: string }

    if (!password || password.length < 8) {
      throw fastify.httpErrors.badRequest('Password must be at least 8 characters')
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    await fastify.prisma.user.update({
      where: { id: request.params.id },
      data: { passwordHash },
    })

    // Invalidate all sessions
    await fastify.prisma.session.deleteMany({
      where: { userId: request.params.id },
    })

    return { message: 'Password reset successfully' }
  })
}

export default usersRoutes
