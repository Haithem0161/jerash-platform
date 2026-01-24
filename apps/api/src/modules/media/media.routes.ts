import type { FastifyPluginAsync } from 'fastify'
import { mediaUpdateSchema } from '@repo/validation'
import { getPaginationParams, getPaginationMeta, getSkipTake } from '../../utils/pagination.js'
import { config } from '../../config/index.js'
import { withFullUrls, withFullUrlsArray } from '../../utils/url.js'
import path from 'node:path'
import fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { spawn } from 'node:child_process'

const MEDIA_URL_FIELDS = ['url', 'thumbnailUrl'] as const

// Use FFmpeg for image processing
async function getImageDimensions(filepath: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height',
      '-of', 'json',
      filepath,
    ])

    let output = ''
    ffprobe.stdout.on('data', (data) => {
      output += data.toString()
    })

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        resolve(null)
        return
      }
      try {
        const data = JSON.parse(output)
        const stream = data.streams?.[0]
        if (stream?.width && stream?.height) {
          resolve({ width: stream.width, height: stream.height })
        } else {
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    })

    ffprobe.on('error', () => resolve(null))
  })
}

async function generateThumbnail(inputPath: string, outputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-vf', 'scale=400:-1',
      '-y',
      outputPath,
    ])

    ffmpeg.on('close', (code) => resolve(code === 0))
    ffmpeg.on('error', () => resolve(false))
  })
}

const mediaRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /admin/media - List media files
  fastify.get<{ Querystring: { page?: number; pageSize?: number; folder?: string } }>('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Media'],
      summary: 'List media files',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const params = getPaginationParams(request.query)
    const { skip, take } = getSkipTake(params)

    const where = request.query.folder ? { folder: request.query.folder } : {}

    const [files, total] = await Promise.all([
      fastify.prisma.mediaFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      fastify.prisma.mediaFile.count({ where }),
    ])

    return {
      data: withFullUrlsArray(files, [...MEDIA_URL_FIELDS]),
      meta: getPaginationMeta(total, params),
    }
  })

  // POST /admin/media - Upload file
  fastify.post('/', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Media'],
      summary: 'Upload media file',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = await request.file()

    if (!data) {
      throw fastify.httpErrors.badRequest('File is required')
    }

    // Get folder from fields (default to 'general' to avoid /uploads/uploads/ path)
    const folder = (data.fields.folder as { value: string } | undefined)?.value || 'general'

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ]
    if (!allowedMimeTypes.includes(data.mimetype)) {
      throw fastify.httpErrors.badRequest('Invalid file type')
    }

    // Save file
    const uploadsDir = path.resolve(config.UPLOAD_DIR, folder)
    await fs.mkdir(uploadsDir, { recursive: true })

    const ext = path.extname(data.filename)
    const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`
    const filepath = path.join(uploadsDir, filename)

    await pipeline(data.file, createWriteStream(filepath))

    // Get file size
    const stats = await fs.stat(filepath)

    // Get dimensions for images
    let width: number | null = null
    let height: number | null = null
    let thumbnailUrl: string | null = null

    if (data.mimetype.startsWith('image/') && !data.mimetype.includes('svg')) {
      const dimensions = await getImageDimensions(filepath)
      if (dimensions) {
        width = dimensions.width
        height = dimensions.height
      }

      // Generate thumbnail
      const thumbFilename = `thumb-${filename}`
      const thumbPath = path.join(uploadsDir, thumbFilename)
      const thumbCreated = await generateThumbnail(filepath, thumbPath)
      if (thumbCreated) {
        thumbnailUrl = `/uploads/${folder}/${thumbFilename}`
      }
    }

    // Save to database
    const mediaFile = await fastify.prisma.mediaFile.create({
      data: {
        filename,
        originalName: data.filename,
        mimeType: data.mimetype,
        size: stats.size,
        url: `/uploads/${folder}/${filename}`,
        thumbnailUrl,
        width,
        height,
        folder,
      },
    })

    return { data: withFullUrls(mediaFile, [...MEDIA_URL_FIELDS]) }
  })

  // GET /admin/media/:id
  fastify.get<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Media'],
      summary: 'Get media file by ID',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const file = await fastify.prisma.mediaFile.findUnique({
      where: { id: request.params.id },
    })
    if (!file) {
      throw fastify.httpErrors.notFound('File not found')
    }
    return { data: withFullUrls(file, [...MEDIA_URL_FIELDS]) }
  })

  // PATCH /admin/media/:id - Update alt text
  fastify.patch<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR')],
    schema: {
      tags: ['Media'],
      summary: 'Update media file metadata',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const data = mediaUpdateSchema.parse(request.body)
    const file = await fastify.prisma.mediaFile.update({
      where: { id: request.params.id },
      data,
    })
    return { data: withFullUrls(file, [...MEDIA_URL_FIELDS]) }
  })

  // DELETE /admin/media/:id
  fastify.delete<{ Params: { id: string } }>('/:id', {
    onRequest: [fastify.authorizeRoles('SUPER_ADMIN', 'ADMIN')],
    schema: {
      tags: ['Media'],
      summary: 'Delete media file',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    const file = await fastify.prisma.mediaFile.findUnique({
      where: { id: request.params.id },
    })

    if (file) {
      // Delete files from disk
      const filepath = path.resolve(config.UPLOAD_DIR, file.url.replace('/uploads/', ''))
      await fs.unlink(filepath).catch(() => {})

      if (file.thumbnailUrl) {
        const thumbPath = path.resolve(config.UPLOAD_DIR, file.thumbnailUrl.replace('/uploads/', ''))
        await fs.unlink(thumbPath).catch(() => {})
      }
    }

    await fastify.prisma.mediaFile.delete({
      where: { id: request.params.id },
    })

    return { message: 'File deleted' }
  })
}

export default mediaRoutes
