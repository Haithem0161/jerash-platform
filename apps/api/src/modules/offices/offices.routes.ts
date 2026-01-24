import type { FastifyPluginAsync } from 'fastify'
import { officeSchema, officeUpdateSchema, reorderSchema } from '@repo/validation'
import { generateSlug, ensureUniqueSlug } from '../../utils/slug.js'

const officesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /offices - Public
  fastify.get('/', {
    schema: {
      tags: ['Offices'],
      summary: 'Get all active offices',
    },
  }, async () => {
    const offices = await fastify.prisma.office.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return { data: offices }
  })

  // GET /offices/admin - Admin
  fastify.get('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Offices'],
      summary: 'Get all offices (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const offices = await fastify.prisma.office.findMany({
      orderBy: { order: 'asc' },
    })
    return { data: offices }
  })

  // GET /offices/:id - Admin
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Offices'],
      summary: 'Get office by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const office = await fastify.prisma.office.findUnique({
      where: { id: request.params.id },
    })
    if (!office) {
      throw fastify.httpErrors.notFound('Office not found')
    }
    return { data: office }
  })

  // POST /offices - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Offices'],
      summary: 'Create office',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = officeSchema.parse(request.body)

    const baseSlug = generateSlug(data.nameEn)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const existing = await fastify.prisma.office.findUnique({ where: { slug: s } })
      return !!existing
    })

    const office = await fastify.prisma.office.create({
      data: { ...data, slug },
    })
    return { data: office }
  })

  // PATCH /offices/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Offices'],
      summary: 'Update office',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = officeUpdateSchema.parse(request.body)
    const office = await fastify.prisma.office.update({
      where: { id: request.params.id },
      data,
    })
    return { data: office }
  })

  // DELETE /offices/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Offices'],
      summary: 'Delete office',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.office.delete({
      where: { id: request.params.id },
    })
    return { message: 'Office deleted' }
  })

  // PATCH /offices/reorder - Admin
  fastify.patch('/reorder', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Offices'],
      summary: 'Reorder offices',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { items } = reorderSchema.parse(request.body)

    await fastify.prisma.$transaction(
      items.map((item) =>
        fastify.prisma.office.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return { message: 'Offices reordered' }
  })
}

export default officesRoutes
