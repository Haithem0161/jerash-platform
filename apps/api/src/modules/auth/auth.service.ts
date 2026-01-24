import bcrypt from 'bcryptjs'
import type { PrismaClient } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { UserRole } from '@repo/types'

const SALT_ROUNDS = 12

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      throw this.fastify.httpErrors.unauthorized('Invalid credentials')
    }

    const isValid = await this.verifyPassword(password, user.passwordHash)
    if (!isValid) {
      throw this.fastify.httpErrors.unauthorized('Invalid credentials')
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Generate tokens
    const accessToken = this.fastify.jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = await this.createRefreshToken(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900, // 15 minutes in seconds
      },
    }
  }

  async createRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await this.prisma.session.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    })

    return token
  }

  async refreshAccessToken(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.session.delete({ where: { id: session.id } })
      }
      throw this.fastify.httpErrors.unauthorized('Invalid or expired refresh token')
    }

    if (!session.user.isActive) {
      throw this.fastify.httpErrors.unauthorized('User account is disabled')
    }

    const accessToken = this.fastify.jwt.sign({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
    })

    return {
      accessToken,
      expiresIn: 900,
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { token: refreshToken },
    })
  }

  async logoutAll(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    })
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw this.fastify.httpErrors.notFound('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }
}
