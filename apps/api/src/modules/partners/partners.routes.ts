import type { FastifyPluginAsync } from 'fastify'
import { jointVentureSchema, jointVentureUpdateSchema, reorderSchema } from '@repo/validation'
import { generateSlug, ensureUniqueSlug } from '../../utils/slug.js'
import { withFullUrls, withFullUrlsArray } from '../../utils/url.js'

const jointVenturesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /joint-ventures - Public
  fastify.get('/', {
    schema: {
      tags: ['Joint Ventures'],
      summary: 'Get all active joint ventures',
    },
  }, async () => {
    const jvs = await fastify.prisma.jointVenture.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(jvs, ['logoUrl']) }
  })

  // GET /joint-ventures/admin - Admin
  fastify.get('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Joint Ventures'],
      summary: 'Get all joint ventures (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const jvs = await fastify.prisma.jointVenture.findMany({
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(jvs, ['logoUrl']) }
  })

  // GET /joint-ventures/:id - Admin
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Joint Ventures'],
      summary: 'Get joint venture by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const jv = await fastify.prisma.jointVenture.findUnique({
      where: { id: request.params.id },
    })
    if (!jv) {
      throw fastify.httpErrors.notFound('Joint venture not found')
    }
    return { data: withFullUrls(jv, ['logoUrl']) }
  })

  // POST /joint-ventures - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Joint Ventures'],
      summary: 'Create joint venture',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = jointVentureSchema.parse(request.body)

    const baseSlug = generateSlug(data.nameEn)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const existing = await fastify.prisma.jointVenture.findUnique({ where: { slug: s } })
      return !!existing
    })

    const jv = await fastify.prisma.jointVenture.create({
      data: { ...data, slug, website: data.website || null },
    })
    return { data: jv }
  })

  // PATCH /joint-ventures/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Joint Ventures'],
      summary: 'Update joint venture',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = jointVentureUpdateSchema.parse(request.body)
    const jv = await fastify.prisma.jointVenture.update({
      where: { id: request.params.id },
      data: { ...data, website: data.website || null },
    })
    return { data: jv }
  })

  // DELETE /joint-ventures/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Joint Ventures'],
      summary: 'Delete joint venture',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.jointVenture.delete({
      where: { id: request.params.id },
    })
    return { message: 'Joint venture deleted' }
  })

  // PATCH /joint-ventures/reorder - Admin
  fastify.patch('/reorder', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Joint Ventures'],
      summary: 'Reorder joint ventures',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { items } = reorderSchema.parse(request.body)

    await fastify.prisma.$transaction(
      items.map((item) =>
        fastify.prisma.jointVenture.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return { message: 'Joint ventures reordered' }
  })
}

export default jointVenturesRoutes
