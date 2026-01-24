import type { FastifyPluginAsync } from 'fastify'
import { serviceSchema, serviceUpdateSchema, serviceCategorySchema, serviceCategoryUpdateSchema, reorderSchema } from '@repo/validation'
import { generateSlug, ensureUniqueSlug } from '../../utils/slug.js'

const servicesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /services - Public (with categories)
  fastify.get('/', {
    schema: {
      tags: ['Services'],
      summary: 'Get all active services with categories',
    },
  }, async () => {
    const categories = await fastify.prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    })
    return { data: categories }
  })

  // GET /services/:slug - Public
  fastify.get<{ Params: { slug: string } }>('/:slug', {
    schema: {
      tags: ['Services'],
      summary: 'Get service by slug',
    },
  }, async (request) => {
    const service = await fastify.prisma.service.findUnique({
      where: { slug: request.params.slug },
      include: { category: true },
    })
    if (!service || !service.isActive) {
      throw fastify.httpErrors.notFound('Service not found')
    }
    return { data: service }
  })

  // ========== ADMIN ROUTES ==========

  // GET /services/admin - Admin (all services)
  fastify.get('/admin/all', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Services'],
      summary: 'Get all services (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const services = await fastify.prisma.service.findMany({
      orderBy: [{ categoryId: 'asc' }, { order: 'asc' }],
      include: { category: true },
    })
    return { data: services }
  })

  // GET /services/admin/:id - Admin
  fastify.get<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Services'],
      summary: 'Get service by ID (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const service = await fastify.prisma.service.findUnique({
      where: { id: request.params.id },
      include: { category: true },
    })
    if (!service) {
      throw fastify.httpErrors.notFound('Service not found')
    }
    return { data: service }
  })

  // POST /services - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Services'],
      summary: 'Create service',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = serviceSchema.parse(request.body)

    const baseSlug = generateSlug(data.titleEn)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const existing = await fastify.prisma.service.findUnique({ where: { slug: s } })
      return !!existing
    })

    const service = await fastify.prisma.service.create({
      data: { ...data, slug },
      include: { category: true },
    })
    return { data: service }
  })

  // PATCH /services/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Services'],
      summary: 'Update service',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = serviceUpdateSchema.parse(request.body)
    const service = await fastify.prisma.service.update({
      where: { id: request.params.id },
      data,
      include: { category: true },
    })
    return { data: service }
  })

  // DELETE /services/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Services'],
      summary: 'Delete service',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.service.delete({
      where: { id: request.params.id },
    })
    return { message: 'Service deleted' }
  })

  // PATCH /services/reorder - Admin
  fastify.patch('/reorder', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Services'],
      summary: 'Reorder services',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { items } = reorderSchema.parse(request.body)

    await fastify.prisma.$transaction(
      items.map((item) =>
        fastify.prisma.service.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return { message: 'Services reordered' }
  })

  // ========== CATEGORY ROUTES ==========

  // GET /services/categories - Public
  fastify.get('/categories', {
    schema: {
      tags: ['Services'],
      summary: 'Get all service categories',
    },
  }, async () => {
    const categories = await fastify.prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return { data: categories }
  })

  // GET /services/categories/admin - Admin
  fastify.get('/categories/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Services'],
      summary: 'Get all service categories (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const categories = await fastify.prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' },
    })
    return { data: categories }
  })

  // POST /services/categories - Admin
  fastify.post('/categories', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Services'],
      summary: 'Create service category',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = serviceCategorySchema.parse(request.body)

    const baseSlug = generateSlug(data.nameEn)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const existing = await fastify.prisma.serviceCategory.findUnique({ where: { slug: s } })
      return !!existing
    })

    const category = await fastify.prisma.serviceCategory.create({
      data: { ...data, slug },
    })
    return { data: category }
  })

  // PATCH /services/categories/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/categories/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Services'],
      summary: 'Update service category',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = serviceCategoryUpdateSchema.parse(request.body)
    const category = await fastify.prisma.serviceCategory.update({
      where: { id: request.params.id },
      data,
    })
    return { data: category }
  })

  // DELETE /services/categories/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/categories/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Services'],
      summary: 'Delete service category',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    // Check if category has services
    const serviceCount = await fastify.prisma.service.count({
      where: { categoryId: request.params.id },
    })
    if (serviceCount > 0) {
      throw fastify.httpErrors.conflict('Cannot delete category with existing services')
    }

    await fastify.prisma.serviceCategory.delete({
      where: { id: request.params.id },
    })
    return { message: 'Category deleted' }
  })
}

export default servicesRoutes
