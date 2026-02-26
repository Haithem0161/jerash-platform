import type { FastifyPluginAsync } from 'fastify'
import { clientSchema, clientUpdateSchema, reorderSchema } from '@repo/validation'
import { generateSlug, ensureUniqueSlug } from '../../utils/slug.js'
import { withFullUrls, withFullUrlsArray } from '../../utils/url.js'

const clientsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /clients - Public
  fastify.get('/', {
    schema: {
      tags: ['Clients'],
      summary: 'Get all active clients',
    },
  }, async () => {
    const partners = await fastify.prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(partners, ['logoUrl']) }
  })

  // GET /clients/admin - Admin (all clients)
  fastify.get('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Clients'],
      summary: 'Get all clients (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const partners = await fastify.prisma.partner.findMany({
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(partners, ['logoUrl']) }
  })

  // GET /clients/:id - Admin
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Clients'],
      summary: 'Get client by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const partner = await fastify.prisma.partner.findUnique({
      where: { id: request.params.id },
    })
    if (!partner) {
      throw fastify.httpErrors.notFound('Client not found')
    }
    return { data: withFullUrls(partner, ['logoUrl']) }
  })

  // POST /clients - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Clients'],
      summary: 'Create client',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = clientSchema.parse(request.body)

    const baseSlug = generateSlug(data.nameEn)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const existing = await fastify.prisma.partner.findUnique({ where: { slug: s } })
      return !!existing
    })

    const partner = await fastify.prisma.partner.create({
      data: {
        ...data,
        slug,
        descriptionEn: data.descriptionEn || null,
        descriptionAr: data.descriptionAr || null,
        website: data.website || null,
      },
    })
    return { data: partner }
  })

  // PATCH /clients/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Clients'],
      summary: 'Update client',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = clientUpdateSchema.parse(request.body)
    const partner = await fastify.prisma.partner.update({
      where: { id: request.params.id },
      data: {
        ...data,
        descriptionEn: data.descriptionEn || null,
        descriptionAr: data.descriptionAr || null,
        website: data.website || null,
      },
    })
    return { data: partner }
  })

  // DELETE /clients/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Clients'],
      summary: 'Delete client',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.partner.delete({
      where: { id: request.params.id },
    })
    return { message: 'Client deleted' }
  })

  // PATCH /clients/reorder - Admin
  fastify.patch('/reorder', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Clients'],
      summary: 'Reorder clients',
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

    return { message: 'Clients reordered' }
  })
}

export default clientsRoutes
