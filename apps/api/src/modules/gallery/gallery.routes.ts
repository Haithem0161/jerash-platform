import type { FastifyPluginAsync } from 'fastify'
import { galleryImageSchema, galleryImageUpdateSchema, reorderSchema } from '@repo/validation'
import { getPaginationParams, getPaginationMeta, getSkipTake } from '../../utils/pagination.js'
import { withFullUrls, withFullUrlsArray } from '../../utils/url.js'

const IMAGE_URL_FIELDS = ['imageUrl', 'thumbnailUrl'] as const

const galleryRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /gallery - Public (paginated)
  fastify.get<{ Querystring: { page?: number; pageSize?: number } }>('/', {
    schema: {
      tags: ['Gallery'],
      summary: 'Get gallery images (paginated)',
    },
  }, async (request) => {
    const params = getPaginationParams(request.query)
    const { skip, take } = getSkipTake(params)

    const [images, total] = await Promise.all([
      fastify.prisma.galleryImage.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        skip,
        take,
      }),
      fastify.prisma.galleryImage.count({ where: { isActive: true } }),
    ])

    return {
      data: withFullUrlsArray(images, [...IMAGE_URL_FIELDS]),
      meta: getPaginationMeta(total, params),
    }
  })

  // GET /gallery/admin - Admin (all images)
  fastify.get('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Gallery'],
      summary: 'Get all gallery images (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const images = await fastify.prisma.galleryImage.findMany({
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(images, [...IMAGE_URL_FIELDS]) }
  })

  // GET /gallery/:id - Admin
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Gallery'],
      summary: 'Get gallery image by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const image = await fastify.prisma.galleryImage.findUnique({
      where: { id: request.params.id },
    })
    if (!image) {
      throw fastify.httpErrors.notFound('Gallery image not found')
    }
    return { data: withFullUrls(image, [...IMAGE_URL_FIELDS]) }
  })

  // POST /gallery - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Gallery'],
      summary: 'Create gallery image',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = galleryImageSchema.parse(request.body)
    const image = await fastify.prisma.galleryImage.create({ data })
    return { data: image }
  })

  // PATCH /gallery/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Gallery'],
      summary: 'Update gallery image',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = galleryImageUpdateSchema.parse(request.body)
    const image = await fastify.prisma.galleryImage.update({
      where: { id: request.params.id },
      data,
    })
    return { data: image }
  })

  // DELETE /gallery/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Gallery'],
      summary: 'Delete gallery image',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.galleryImage.delete({
      where: { id: request.params.id },
    })
    return { message: 'Gallery image deleted' }
  })

  // PATCH /gallery/reorder - Admin
  fastify.patch('/reorder', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Gallery'],
      summary: 'Reorder gallery images',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { items } = reorderSchema.parse(request.body)

    await fastify.prisma.$transaction(
      items.map((item) =>
        fastify.prisma.galleryImage.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return { message: 'Gallery images reordered' }
  })
}

export default galleryRoutes
