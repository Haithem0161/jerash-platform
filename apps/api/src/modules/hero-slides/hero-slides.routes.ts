import type { FastifyPluginAsync } from 'fastify'
import { heroSlideSchema, heroSlideUpdateSchema, reorderSchema } from '@repo/validation'
import { withFullUrls, withFullUrlsArray } from '../../utils/url.js'

const heroSlidesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /hero-slides - Public
  fastify.get('/', {
    schema: {
      tags: ['Hero Slides'],
      summary: 'Get all active hero slides',
    },
  }, async () => {
    const slides = await fastify.prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(slides, ['imageUrl']) }
  })

  // GET /hero-slides/admin - Admin (all slides including inactive)
  fastify.get('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Hero Slides'],
      summary: 'Get all hero slides (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const slides = await fastify.prisma.heroSlide.findMany({
      orderBy: { order: 'asc' },
    })
    return { data: withFullUrlsArray(slides, ['imageUrl']) }
  })

  // GET /hero-slides/:id - Admin
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Hero Slides'],
      summary: 'Get hero slide by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const slide = await fastify.prisma.heroSlide.findUnique({
      where: { id: request.params.id },
    })
    if (!slide) {
      throw fastify.httpErrors.notFound('Hero slide not found')
    }
    return { data: withFullUrls(slide, ['imageUrl']) }
  })

  // POST /hero-slides - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Hero Slides'],
      summary: 'Create hero slide',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = heroSlideSchema.parse(request.body)
    const slide = await fastify.prisma.heroSlide.create({ data })
    return { data: slide }
  })

  // PATCH /hero-slides/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Hero Slides'],
      summary: 'Update hero slide',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = heroSlideUpdateSchema.parse(request.body)
    const slide = await fastify.prisma.heroSlide.update({
      where: { id: request.params.id },
      data,
    })
    return { data: slide }
  })

  // DELETE /hero-slides/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Hero Slides'],
      summary: 'Delete hero slide',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.heroSlide.delete({
      where: { id: request.params.id },
    })
    return { message: 'Hero slide deleted' }
  })

  // PATCH /hero-slides/reorder - Admin
  fastify.patch('/reorder', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Hero Slides'],
      summary: 'Reorder hero slides',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { items } = reorderSchema.parse(request.body)

    await fastify.prisma.$transaction(
      items.map((item) =>
        fastify.prisma.heroSlide.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return { message: 'Slides reordered' }
  })
}

export default heroSlidesRoutes
