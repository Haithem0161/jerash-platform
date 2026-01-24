import type { FastifyPluginAsync } from 'fastify'
import { getPaginationParams, getPaginationMeta, getSkipTake } from '../../utils/pagination.js'

const auditRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /admin/audit-logs
  fastify.get<{
    Querystring: {
      page?: number
      pageSize?: number
      entityType?: string
      entityId?: string
      userId?: string
      action?: string
    }
  }>('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Audit'],
      summary: 'Get audit logs',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const params = getPaginationParams(request.query)
    const { skip, take } = getSkipTake(params)

    const where: any = {}
    if (request.query.entityType) {
      where.entityType = request.query.entityType
    }
    if (request.query.entityId) {
      where.entityId = request.query.entityId
    }
    if (request.query.userId) {
      where.userId = request.query.userId
    }
    if (request.query.action) {
      where.action = request.query.action
    }

    const [logs, total] = await Promise.all([
      fastify.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      fastify.prisma.auditLog.count({ where }),
    ])

    return {
      data: logs,
      meta: getPaginationMeta(total, params),
    }
  })
}

export default auditRoutes
