import type { FastifyPluginAsync } from 'fastify'
import { contactFormSchema, contactSubmissionUpdateSchema } from '@repo/validation'
import { getPaginationParams, getPaginationMeta, getSkipTake } from '../../utils/pagination.js'
import { sendContactNotification } from '../../utils/email.js'

const contactRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /contact - Public (submit contact form)
  fastify.post('/', {
    schema: {
      tags: ['Contact'],
      summary: 'Submit contact form',
    },
  }, async (request) => {
    const data = contactFormSchema.parse(request.body)

    const submission = await fastify.prisma.contactSubmission.create({
      data,
    })

    // Send email notification (async, don't wait)
    sendContactNotification(data).catch((err) => {
      fastify.log.error('Failed to send contact notification:', err)
    })

    return {
      data: { id: submission.id },
      message: 'Thank you for contacting us. We will get back to you soon.',
    }
  })

  // GET /contact/admin - Admin (list submissions)
  fastify.get<{ Querystring: { page?: number; pageSize?: number; status?: string } }>('/admin', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER')],
    schema: {
      tags: ['Contact'],
      summary: 'Get contact submissions (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const params = getPaginationParams(request.query)
    const { skip, take } = getSkipTake(params)
    const statusFilter = request.query.status

    const where = statusFilter ? { status: statusFilter as any } : {}

    const [submissions, total] = await Promise.all([
      fastify.prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      fastify.prisma.contactSubmission.count({ where }),
    ])

    return {
      data: submissions,
      meta: getPaginationMeta(total, params),
    }
  })

  // GET /contact/admin/:id - Admin
  fastify.get<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER')],
    schema: {
      tags: ['Contact'],
      summary: 'Get contact submission by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const submission = await fastify.prisma.contactSubmission.findUnique({
      where: { id: request.params.id },
    })
    if (!submission) {
      throw fastify.httpErrors.notFound('Submission not found')
    }

    // Mark as read if new
    if (submission.status === 'NEW') {
      await fastify.prisma.contactSubmission.update({
        where: { id: request.params.id },
        data: { status: 'READ' },
      })
    }

    return { data: submission }
  })

  // PATCH /contact/admin/:id - Admin (update status/notes)
  fastify.patch<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Contact'],
      summary: 'Update contact submission',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = contactSubmissionUpdateSchema.parse(request.body)

    const updateData: any = { ...data }
    if (data.status === 'RESPONDED') {
      updateData.respondedAt = new Date()
    }

    const submission = await fastify.prisma.contactSubmission.update({
      where: { id: request.params.id },
      data: updateData,
    })
    return { data: submission }
  })

  // DELETE /contact/admin/:id - Admin
  fastify.delete<{ Params: { id: string } }>('/admin/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Contact'],
      summary: 'Delete contact submission',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    await fastify.prisma.contactSubmission.delete({
      where: { id: request.params.id },
    })
    return { message: 'Submission deleted' }
  })
}

export default contactRoutes
