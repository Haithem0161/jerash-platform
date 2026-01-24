import type { FastifyPluginAsync } from 'fastify'
import { jobApplicationFormSchema, jobApplicationUpdateSchema } from '@repo/validation'
import { getPaginationParams, getPaginationMeta, getSkipTake } from '../../utils/pagination.js'
import { sendApplicationNotification } from '../../utils/email.js'
import { config } from '../../config/index.js'
import path from 'node:path'
import fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

const applicationsRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /applications - Public (submit job application)
  fastify.post('/', {
    schema: {
      tags: ['Applications'],
      summary: 'Submit job application with CV',
    },
  }, async (request) => {
    const data = await request.file()

    if (!data) {
      throw fastify.httpErrors.badRequest('CV file is required')
    }

    // Parse form fields
    const fields: Record<string, string> = {}
    for (const [key, value] of Object.entries(data.fields)) {
      if (typeof value === 'object' && 'value' in value) {
        fields[key] = (value as { value: string }).value
      }
    }

    // Validate form data
    const formData = jobApplicationFormSchema.parse(fields)

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ]
    if (!allowedMimeTypes.includes(data.mimetype)) {
      throw fastify.httpErrors.badRequest('Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG')
    }

    // Save file
    const uploadsDir = path.resolve(config.UPLOAD_DIR, 'cvs')
    await fs.mkdir(uploadsDir, { recursive: true })

    const ext = path.extname(data.filename)
    const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`
    const filepath = path.join(uploadsDir, filename)

    await pipeline(data.file, createWriteStream(filepath))

    // Get job title if jobId provided
    let jobTitle: string | undefined
    if (formData.jobId) {
      const job = await fastify.prisma.job.findUnique({
        where: { id: formData.jobId },
        select: { titleEn: true },
      })
      jobTitle = job?.titleEn
    }

    // Create application
    const application = await fastify.prisma.jobApplication.create({
      data: {
        jobId: formData.jobId || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cvUrl: `/uploads/cvs/${filename}`,
        cvFilename: data.filename,
      },
    })

    // Send email notification (async)
    sendApplicationNotification({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      jobTitle,
      cvFilename: data.filename,
    }).catch((err) => {
      fastify.log.error('Failed to send application notification:', err)
    })

    return {
      data: { id: application.id },
      message: 'Thank you for your application. We will review it and get back to you.',
    }
  })

  // GET /applications/admin - Admin
  fastify.get<{ Querystring: { page?: number; pageSize?: number; status?: string; jobId?: string } }>('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER')],
    schema: {
      tags: ['Applications'],
      summary: 'Get job applications (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const params = getPaginationParams(request.query)
    const { skip, take } = getSkipTake(params)

    const where: any = {}
    if (request.query.status) {
      where.status = request.query.status
    }
    if (request.query.jobId) {
      where.jobId = request.query.jobId
    }

    const [applications, total] = await Promise.all([
      fastify.prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          job: {
            select: { id: true, slug: true, titleEn: true, titleAr: true },
          },
        },
      }),
      fastify.prisma.jobApplication.count({ where }),
    ])

    return {
      data: applications,
      meta: getPaginationMeta(total, params),
    }
  })

  // GET /applications/admin/:id - Admin
  fastify.get<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER')],
    schema: {
      tags: ['Applications'],
      summary: 'Get job application by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const application = await fastify.prisma.jobApplication.findUnique({
      where: { id: request.params.id },
      include: {
        job: {
          select: { id: true, slug: true, titleEn: true, titleAr: true },
        },
      },
    })
    if (!application) {
      throw fastify.httpErrors.notFound('Application not found')
    }

    // Mark as reviewing if new
    if (application.status === 'NEW') {
      await fastify.prisma.jobApplication.update({
        where: { id: request.params.id },
        data: { status: 'REVIEWING' },
      })
    }

    return { data: application }
  })

  // PATCH /applications/admin/:id - Admin
  fastify.patch<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Applications'],
      summary: 'Update job application',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = jobApplicationUpdateSchema.parse(request.body)

    const updateData: any = { ...data }
    if (data.status && data.status !== 'NEW') {
      updateData.reviewedAt = new Date()
    }

    const application = await fastify.prisma.jobApplication.update({
      where: { id: request.params.id },
      data: updateData,
      include: {
        job: {
          select: { id: true, slug: true, titleEn: true, titleAr: true },
        },
      },
    })
    return { data: application }
  })

  // DELETE /applications/admin/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Applications'],
      summary: 'Delete job application',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    // Get application to delete CV file
    const application = await fastify.prisma.jobApplication.findUnique({
      where: { id: request.params.id },
    })

    if (application) {
      // Delete CV file
      const cvPath = path.resolve(config.UPLOAD_DIR, application.cvUrl.replace('/uploads/', ''))
      await fs.unlink(cvPath).catch(() => {}) // Ignore if file doesn't exist
    }

    await fastify.prisma.jobApplication.delete({
      where: { id: request.params.id },
    })
    return { message: 'Application deleted' }
  })
}

export default applicationsRoutes
