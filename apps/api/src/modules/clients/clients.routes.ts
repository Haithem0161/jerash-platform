import type { FastifyPluginAsync } from 'fastify'
import { partnerSchema, partnerUpdateSchema, reorderSchema } from '@repo/validation'
import { generateSlug, ensureUniqueSlug } from '../../utils/slug.js'
import { withFullUrls, withFullUrlsArray } from '../../utils/url.js'

const partnersRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /partners - Public
  fastify.get('/', {
    schema: {
      tags: ['Partners'],
      summary: 'Get all active partners',
    },
  }, async () => {
    const partners = await fastify.prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(partners, ['logoUrl']) }
  })

  // GET /partners/admin - Admin (all partners)
  fastify.get('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Partners'],
      summary: 'Get all partners (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const partners = await fastify.prisma.partner.findMany({
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(partners, ['logoUrl']) }
  })

  // GET /partners/:id - Admin
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Partners'],
      summary: 'Get partner by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const partner = await fastify.prisma.partner.findUnique({
      where: { id: request.params.id },
    })
    if (!partner) {
      throw fastify.httpErrors.notFound('Partner not found')
    }
    return { data: withFullUrls(partner, ['logoUrl']) }
  })

  // POST /partners - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Partners'],
      summary: 'Create partner',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = partnerSchema.parse(request.body)

    const baseSlug = generateSlug(data.nameEn)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const existing = await fastify.prisma.partner.findUnique({ where: { slug: s } })
      return !!existing
    })

    const partner = await fastify.prisma.partner.create({
      data: { ...data, slug, website: data.website || null },
    })
    return { data: partner }
  })

  // PATCH /partners/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Partners'],
      summary: 'Update partner',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = partnerUpdateSchema.parse(request.body)
    const partner = await fastify.prisma.partner.update({
      where: { id: request.params.id },
      data: { ...data, website: data.website || null },
    })
    return { data: partner }
  })

  // DELETE /partners/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Partners'],
      summary: 'Delete partner',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.partner.delete({
      where: { id: request.params.id },
    })
    return { message: 'Partner deleted' }
  })

  // PATCH /partners/reorder - Admin
  fastify.patch('/reorder', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Partners'],
      summary: 'Reorder partners',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { items } = reorderSchema.parse(request.body)

    await fastify.prisma.$transaction(
      items.map((item) =>
        fastify.prisma.partner.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return { message: 'Partners reordered' }
  })
}

export default partnersRoutes
