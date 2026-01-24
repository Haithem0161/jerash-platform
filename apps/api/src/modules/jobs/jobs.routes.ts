import type { FastifyPluginAsync } from 'fastify'
import { jobSchema, jobUpdateSchema } from '@repo/validation'
import { generateSlug, ensureUniqueSlug } from '../../utils/slug.js'

const jobsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /jobs - Public
  fastify.get('/', {
    schema: {
      tags: ['Jobs'],
      summary: 'Get all active job listings',
    },
  }, async () => {
    const now = new Date()
    const jobs = await fastify.prisma.job.findMany({
      where: {
        isActive: true,
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: now } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })
    return { data: jobs }
  })

  // GET /jobs/:slug - Public
  fastify.get<{ Params: { slug: string } }>('/:slug', {
    schema: {
      tags: ['Jobs'],
      summary: 'Get job by slug',
    },
  }, async (request) => {
    const job = await fastify.prisma.job.findUnique({
      where: { slug: request.params.slug },
    })
    if (!job || !job.isActive) {
      throw fastify.httpErrors.notFound('Job not found')
    }
    return { data: job }
  })

  // GET /jobs/admin - Admin (all jobs)
  fastify.get('/admin/all', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Jobs'],
      summary: 'Get all jobs (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const jobs = await fastify.prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    })
    return { data: jobs }
  })

  // GET /jobs/admin/:id - Admin
  fastify.get<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Jobs'],
      summary: 'Get job by ID (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const job = await fastify.prisma.job.findUnique({
      where: { id: request.params.id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    })
    if (!job) {
      throw fastify.httpErrors.notFound('Job not found')
    }
    return { data: job }
  })

  // POST /jobs - Admin
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Jobs'],
      summary: 'Create job',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = jobSchema.parse(request.body)

    const baseSlug = generateSlug(data.titleEn)
    const slug = await ensureUniqueSlug(baseSlug, async (s) => {
      const existing = await fastify.prisma.job.findUnique({ where: { slug: s } })
      return !!existing
    })

    const job = await fastify.prisma.job.create({
      data: { ...data, slug },
    })
    return { data: job }
  })

  // PATCH /jobs/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Jobs'],
      summary: 'Update job',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = jobUpdateSchema.parse(request.body)
    const job = await fastify.prisma.job.update({
      where: { id: request.params.id },
      data,
    })
    return { data: job }
  })

  // DELETE /jobs/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Jobs'],
      summary: 'Delete job',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.job.delete({
      where: { id: request.params.id },
    })
    return { message: 'Job deleted' }
  })
}

export default jobsRoutes
