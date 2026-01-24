# =============================================================================
# Base stage: Setup pnpm with Corepack
# =============================================================================
FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# Build stage: Install dependencies and build the application
# =============================================================================
FROM base AS build

WORKDIR /app

# Copy workspace configuration first for better layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all package.json files for workspace resolution
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

# Install all dependencies with BuildKit cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm --filter api exec prisma generate

# Build shared packages first
RUN pnpm --filter @repo/types build
RUN pnpm --filter @repo/validation build

# Build the API
RUN pnpm --filter api build

# =============================================================================
# Production stage: Minimal runtime image
# =============================================================================
FROM node:22-slim AS production

# Install tini for proper signal handling, FFmpeg for media processing, and OpenSSL for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    tini \
    ffmpeg \
    openssl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Keep the same directory structure as the monorepo
WORKDIR /app

# Copy the entire workspace structure needed for runtime
# Root node_modules with .pnpm store
COPY --from=build --chown=node:node /app/node_modules ./node_modules

# Copy root package files
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy API app
COPY --from=build --chown=node:node /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=node:node /app/apps/api/prisma ./apps/api/prisma

# Copy shared packages
COPY --from=build --chown=node:node /app/packages/types ./packages/types
COPY --from=build --chown=node:node /app/packages/validation ./packages/validation

# Create uploads directory with correct permissions
RUN mkdir -p apps/api/uploads && chown -R node:node apps/api/uploads

# Set working directory to the API app
WORKDIR /app/apps/api

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Switch to non-root user (node user exists in node:22-slim image)
USER node

# Expose the API port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use tini as init system for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

# Run the application directly with node (not npm/pnpm for proper signal handling)
CMD ["node", "dist/index.js"]
