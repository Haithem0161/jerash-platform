import type { FastifyPluginAsync } from 'fastify'
import { siteSettingUpdateSchema } from '@repo/validation'

const settingsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /settings/:group - Public
  fastify.get<{ Params: { group: string } }>('/:group', {
    schema: {
      tags: ['Settings'],
      summary: 'Get settings by group (stats, social, contact)',
    },
  }, async (request) => {
    const settings = await fastify.prisma.siteSetting.findMany({
      where: { groupName: request.params.group },
    })

    // Transform to key-value object
    const result: Record<string, string | number | boolean | object> = {}
    for (const setting of settings) {
      const key = setting.key.replace(`${request.params.group}.`, '')
      switch (setting.type) {
        case 'NUMBER':
          result[key] = Number(setting.value)
          break
        case 'BOOLEAN':
          result[key] = setting.value === 'true'
          break
        case 'JSON':
          result[key] = JSON.parse(setting.value)
          break
        default:
          result[key] = setting.value
      }
    }

    return { data: result }
  })

  // GET /settings/admin - Admin (all settings)
  fastify.get('/admin/all', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Settings'],
      summary: 'Get all settings (admin)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => {
    const settings = await fastify.prisma.siteSetting.findMany({
      orderBy: [{ groupName: 'asc' }, { key: 'asc' }],
    })
    return { data: settings }
  })

  // PATCH /settings/:key - Admin
  fastify.patch<{ Params: { key: string } }>('/:key', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Settings'],
      summary: 'Update setting value',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const { value } = siteSettingUpdateSchema.parse(request.body)

    const setting = await fastify.prisma.siteSetting.update({
      where: { key: request.params.key },
      data: { value },
    })

    return { data: setting }
  })
}

export default settingsRoutes
