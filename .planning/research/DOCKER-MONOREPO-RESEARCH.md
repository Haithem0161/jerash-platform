# Docker Research: Enterprise pnpm Monorepo with Multiple Apps

**Project:** Jerash Platform
**Researched:** 2026-01-24
**Overall Confidence:** HIGH

## Executive Summary

This research covers best practices for Dockerizing a pnpm monorepo containing a Fastify/Prisma API, two Vite/React frontends (web and admin), and shared packages. The findings are drawn from official documentation (pnpm, Prisma, Docker, Nginx) and verified community best practices.

**Key recommendation:** Use multi-stage builds with `pnpm deploy` for the API and multi-stage Nginx builds for frontends. Leverage BuildKit cache mounts for fast builds. Implement proper health checks, graceful shutdown, and security hardening.

---

## Table of Contents

1. [pnpm Monorepo Docker Patterns](#1-pnpm-monorepo-docker-patterns)
2. [Fastify/Node.js API Dockerfile](#2-fastifynodejs-api-dockerfile)
3. [Prisma in Docker](#3-prisma-in-docker)
4. [Vite/React SPA with Nginx](#4-vitereact-spa-with-nginx)
5. [Docker Compose Best Practices](#5-docker-compose-best-practices)
6. [Enterprise Considerations](#6-enterprise-considerations)
7. [Complete Example Configurations](#7-complete-example-configurations)

---

## 1. pnpm Monorepo Docker Patterns

### Source: [Official pnpm Docker Documentation](https://pnpm.io/docker)

### 1.1 Enable pnpm via Corepack (Recommended)

```dockerfile
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
```

**Why:** Corepack is built into Node.js 16.13+. No need to install pnpm via npm.

### 1.2 BuildKit Cache Mounts (Critical for Performance)

```dockerfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
```

**Benefits:**
- Persists pnpm store across builds
- Dramatically reduces build time for unchanged dependencies
- Works with Docker BuildKit (default in Docker 23+)

### 1.3 The `pnpm deploy` Command (Monorepo Essential)

For monorepos, `pnpm deploy` is the key to small, production-ready images:

```dockerfile
# After building, deploy only necessary files for a specific package
RUN pnpm deploy --filter=@jerash/api --prod /prod/api
```

**What it does:**
- Copies only the target package and its dependencies
- Prunes devDependencies
- Creates a standalone deployment folder
- No symlinks, no workspace cruft

### 1.4 Layer Caching Strategy

```dockerfile
# 1. Copy only lockfile and workspace config first
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# 2. Fetch packages (cached if lockfile unchanged)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

# 3. Copy source code (changes frequently)
COPY . .

# 4. Install offline (uses fetched packages)
RUN pnpm install --offline --frozen-lockfile
```

**Why this order matters:**
- Docker caches each layer
- If lockfile unchanged, steps 1-2 are cached
- Source changes only invalidate step 3+

### 1.5 Alternative: `pnpm fetch` for CI/CD

For environments without persistent BuildKit cache:

```dockerfile
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches patches  # If you have patches
RUN pnpm fetch --prod

COPY . .
RUN pnpm install -r --offline --prod
```

**When to use:** Ephemeral CI/CD systems without cache mount support.

---

## 2. Fastify/Node.js API Dockerfile

### Sources: [Snyk Node.js Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/), [OWASP Docker Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NodeJS_Docker_Cheat_Sheet.html)

### 2.1 Base Image Selection

| Image | Size | Use Case |
|-------|------|----------|
| `node:22-slim` | ~200MB | **Recommended** - Debian-based, balanced |
| `node:22-alpine` | ~140MB | Smaller, but potential musl libc issues |
| `gcr.io/distroless/nodejs22` | ~120MB | Maximum security, no shell |

**Recommendation:** Use `node:22-slim` for Prisma compatibility and debugging capability.

### 2.2 Non-Root User (Security Critical)

```dockerfile
# Create non-root user
RUN groupadd --gid 1000 nodejs \
    && useradd --uid 1000 --gid 1000 -m nodejs

# Switch to non-root user before running
USER nodejs
```

**Why:** If attackers compromise the app, they have limited privileges.

### 2.3 Graceful Shutdown (Critical for Kubernetes/Docker)

**Problem:** npm/yarn don't forward SIGTERM signals to Node.js properly.

**Solution 1: Run node directly (Recommended)**
```dockerfile
CMD ["node", "dist/index.js"]
# NOT: CMD ["npm", "start"]
```

**Solution 2: Use tini as init system**
```dockerfile
RUN apt-get update && apt-get install -y tini
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/index.js"]
```

**In Fastify application:**
```typescript
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  await fastify.close();  // Stops accepting new connections
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

### 2.4 Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
```

**Or with curl (if installed):**
```dockerfile
HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1
```

### 2.5 FFmpeg for Media Processing

**Option 1: Alpine with FFmpeg**
```dockerfile
FROM node:22-alpine AS runtime
RUN apk add --no-cache ffmpeg
```

**Option 2: Pre-built FFmpeg image (for heavy processing)**
```dockerfile
# Use jrottenberg/ffmpeg as base for media workers
FROM jrottenberg/ffmpeg:7.1-alpine320 AS ffmpeg
FROM node:22-alpine AS runtime
COPY --from=ffmpeg /usr/local /usr/local
```

### 2.6 File Uploads and Volumes

```dockerfile
# Create upload directory with correct permissions
RUN mkdir -p /app/uploads && chown -R nodejs:nodejs /app/uploads

# Declare as volume (hint for orchestration)
VOLUME ["/app/uploads"]
```

In `docker-compose.yml`:
```yaml
volumes:
  - uploads:/app/uploads
```

---

## 3. Prisma in Docker

### Source: [Official Prisma Docker Guide](https://www.prisma.io/docs/guides/docker)

### 3.1 Generate in Build Stage, Not Runtime

```dockerfile
FROM node:22-slim AS build

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (MUST be in build stage)
RUN npx prisma generate

# Build application
RUN pnpm run build
```

**Why:**
- Prisma Client is platform-specific
- Must match the runtime architecture (Linux in Docker)
- Generation downloads binaries - do this once in build

### 3.2 Copy Generated Client to Runtime

```dockerfile
FROM node:22-slim AS runtime

# Copy node_modules with generated Prisma Client
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
```

### 3.3 Binary Targets (if needed)

In `schema.prisma`:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]  // For Alpine
}
```

**Common targets:**
- `debian-openssl-3.0.x` - Debian/Ubuntu with OpenSSL 3
- `linux-musl-openssl-3.0.x` - Alpine Linux
- `native` - Development machine

### 3.4 Migrations in Production

**Never run migrations automatically in production containers.**

```dockerfile
# Development: OK to run migrations
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

# Production: Separate migration job
# Use a separate container/job for migrations
```

### 3.5 Prisma Without Rust Binaries (Prisma 6.16+)

For smaller images:
```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"  // Uses JS-native driver
}
```

Requires a driver adapter:
```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

---

## 4. Vite/React SPA with Nginx

### Sources: [Build with Matija](https://www.buildwithmatija.com/blog/production-react-vite-docker-deployment), [DEV Community Guide](https://dev.to/it-wibrc/guide-to-containerizing-a-modern-javascript-spa-vuevitereact-with-a-multi-stage-nginx-build-1lma)

### 4.1 Multi-Stage Build Pattern

```dockerfile
# Stage 1: Build
FROM node:22-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

COPY . .
RUN pnpm install --offline --frozen-lockfile

# Build with environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter @jerash/web build

# Stage 2: Serve
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 Nginx Configuration for SPAs

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Brotli compression (if module installed)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/xml image/svg+xml application/x-font-ttf application/json font/eot application/vnd.ms-fontobject application/javascript font/otf application/xml application/xhtml+xml text/javascript text/css;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com;" always;

    # SPA routing - critical for React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 4.3 Environment Variables Strategy

**Build-time (VITE_ prefix):**
```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm build
```

**Runtime configuration (advanced):**
```nginx
# Serve config.json from a mounted volume
location /config.json {
    alias /etc/nginx/config.json;
}
```

In React app:
```typescript
// Load config at runtime
const config = await fetch('/config.json').then(r => r.json());
```

### 4.4 Nginx Security Hardening

```nginx
# Remove server version header
server_tokens off;

# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# HSTS (if using HTTPS)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 5. Docker Compose Best Practices

### Sources: [Docker Compose Docs](https://docs.docker.com/compose/), [Docker Healthcheck Guide](https://last9.io/blog/docker-compose-health-checks/)

### 5.1 Service Dependencies with Health Checks

```yaml
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:17-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### 5.2 Network Configuration

```yaml
services:
  api:
    networks:
      - frontend
      - backend

  web:
    networks:
      - frontend

  postgres:
    networks:
      - backend  # Only accessible from backend network

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

### 5.3 Volume Management

```yaml
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    volumes:
      - uploads:/app/uploads

volumes:
  postgres_data:
    driver: local
    name: jerash_postgres_data
  uploads:
    driver: local
    name: jerash_uploads
```

### 5.4 Environment Variables and Secrets

**Development (.env file):**
```yaml
services:
  api:
    env_file:
      - .env
      - .env.local  # Optional override
```

**Production (Docker secrets):**
```yaml
services:
  api:
    secrets:
      - db_password
      - jwt_secret
    environment:
      DATABASE_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

**Application reads secret from file:**
```typescript
import { readFileSync } from 'fs';

const getSecret = (name: string): string => {
  const filePath = process.env[`${name}_FILE`];
  if (filePath) {
    return readFileSync(filePath, 'utf8').trim();
  }
  return process.env[name] || '';
};

const dbPassword = getSecret('DATABASE_PASSWORD');
```

### 5.5 Resource Limits

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M

  postgres:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 5.6 Restart Policies

```yaml
services:
  api:
    restart: unless-stopped  # Recommended for production

  postgres:
    restart: always  # Critical service
```

**Options:**
- `no` - Never restart (default)
- `always` - Always restart
- `on-failure` - Restart only on non-zero exit
- `unless-stopped` - Restart unless manually stopped

---

## 6. Enterprise Considerations

### 6.1 Image Size Optimization

| Technique | Impact |
|-----------|--------|
| Multi-stage builds | 60-80% reduction |
| Alpine base images | 30-50% reduction |
| `pnpm deploy --prod` | Removes devDependencies |
| `.dockerignore` | Excludes unnecessary files |

**Essential .dockerignore:**
```
node_modules
.git
.gitignore
*.md
.env*
.vscode
.idea
coverage
test
tests
__tests__
*.test.*
*.spec.*
```

### 6.2 Security Scanning with Trivy

**CI/CD Integration:**
```yaml
# GitHub Actions example
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:${{ github.sha }}'
    format: 'table'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'
```

**Local scanning:**
```bash
trivy image myapp:latest
trivy image --severity HIGH,CRITICAL myapp:latest
```

**Ignore known issues:**
```
# .trivyignore
CVE-2024-12345 exp:2025-06-01  # Waiting for upstream fix
```

### 6.3 Logging Best Practices

**Use structured JSON logging:**
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Logs: {"level":"info","time":"2026-01-24T10:00:00.000Z","msg":"Server started","port":3000}
logger.info({ port: 3000 }, 'Server started');
```

**Docker log driver configuration:**
```yaml
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### 6.4 Graceful Shutdown Implementation

```typescript
// Fastify graceful shutdown
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

const shutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);

  // Stop accepting new requests
  await fastify.close();

  // Close database connections
  await prisma.$disconnect();

  fastify.log.info('Graceful shutdown complete');
  process.exit(0);
};

// Handle termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  fastify.log.fatal(error, 'Uncaught exception');
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  fastify.log.fatal({ reason }, 'Unhandled rejection');
  shutdown('unhandledRejection');
});
```

### 6.5 Production Checklist

- [ ] Non-root user in all containers
- [ ] Health checks for all services
- [ ] Resource limits defined
- [ ] Graceful shutdown handlers
- [ ] Structured JSON logging
- [ ] Security headers in Nginx
- [ ] `--frozen-lockfile` in all installs
- [ ] Secrets not in environment variables
- [ ] `.dockerignore` excludes dev files
- [ ] Trivy scan passes without CRITICAL issues
- [ ] Deterministic image tags (not `latest`)

---

## 7. Complete Example Configurations

### 7.1 API Dockerfile (Fastify + Prisma)

```dockerfile
# =============================================================================
# Base stage: Setup pnpm
# =============================================================================
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# =============================================================================
# Dependencies stage: Install and cache dependencies
# =============================================================================
FROM base AS deps
WORKDIR /app

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# =============================================================================
# Build stage: Build the application
# =============================================================================
FROM base AS build
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /app/packages/validation/node_modules ./packages/validation/node_modules

# Copy source code
COPY . .

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build packages and API
RUN pnpm --filter @jerash/types build
RUN pnpm --filter @jerash/validation build
RUN pnpm --filter @jerash/api build

# Deploy only the API with production dependencies
RUN pnpm deploy --filter @jerash/api --prod /prod/api

# =============================================================================
# Production stage: Minimal runtime image
# =============================================================================
FROM node:22-slim AS production

# Install tini for proper signal handling and FFmpeg for media processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    tini \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1000 nodejs \
    && useradd --uid 1000 --gid 1000 -m nodejs

WORKDIR /app

# Copy deployed application
COPY --from=build --chown=nodejs:nodejs /prod/api .

# Copy Prisma schema for migrations (if needed)
COPY --from=build --chown=nodejs:nodejs /app/apps/api/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use tini as init and run node directly
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/index.js"]
```

### 7.2 Web/Admin Dockerfile (Vite + React + Nginx)

```dockerfile
# =============================================================================
# Base stage: Setup pnpm
# =============================================================================
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# =============================================================================
# Build stage: Build the application
# =============================================================================
FROM base AS build
WORKDIR /app

# Copy workspace configuration for dependency resolution
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./

# Copy all package.json files for workspace
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build shared packages first
RUN pnpm --filter @jerash/types build
RUN pnpm --filter @jerash/validation build

# Build web app with build-time environment variables
ARG VITE_API_URL
ARG VITE_APP_NAME="Jerash Platform"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN pnpm --filter @jerash/web build

# =============================================================================
# Production stage: Serve with Nginx
# =============================================================================
FROM nginx:1.27-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Create non-root user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# Security: Remove unnecessary packages
RUN rm -rf /var/cache/apk/*

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Run as non-root user
USER nginx

CMD ["nginx", "-g", "daemon off;"]
```

### 7.3 Docker Compose (Production)

```yaml
version: '3.9'

services:
  # ==========================================================================
  # PostgreSQL Database
  # ==========================================================================
  postgres:
    image: postgres:17-alpine
    container_name: jerash-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-jerash}
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
      POSTGRES_DB: ${POSTGRES_DB:-jerash}
    secrets:
      - postgres_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-jerash} -d ${POSTGRES_DB:-jerash}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M

  # ==========================================================================
  # Redis Cache
  # ==========================================================================
  redis:
    image: redis:7-alpine
    container_name: jerash-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

  # ==========================================================================
  # API Server (Fastify + Prisma)
  # ==========================================================================
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: production
    container_name: jerash-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://${POSTGRES_USER:-jerash}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-jerash}
      REDIS_URL: redis://redis:6379
      JWT_SECRET_FILE: /run/secrets/jwt_secret
    secrets:
      - jwt_secret
    volumes:
      - uploads:/app/uploads
    networks:
      - frontend
      - backend
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # ==========================================================================
  # Web Frontend (Public Website)
  # ==========================================================================
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: production
      args:
        VITE_API_URL: ${VITE_API_URL:-http://localhost:3000}
        VITE_APP_NAME: ${VITE_APP_NAME:-Jerash Platform}
    container_name: jerash-web
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    networks:
      - frontend
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 128M

  # ==========================================================================
  # Admin Frontend (Admin Dashboard)
  # ==========================================================================
  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
      target: production
      args:
        VITE_API_URL: ${VITE_API_URL:-http://localhost:3000}
        VITE_APP_NAME: ${VITE_ADMIN_APP_NAME:-Jerash Admin}
    container_name: jerash-admin
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    networks:
      - frontend
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 128M

  # ==========================================================================
  # Nginx Reverse Proxy (Optional - for production routing)
  # ==========================================================================
  nginx:
    image: nginx:1.27-alpine
    container_name: jerash-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
      - web
      - admin
    networks:
      - frontend
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

# =============================================================================
# Networks
# =============================================================================
networks:
  frontend:
    driver: bridge
    name: jerash-frontend
  backend:
    driver: bridge
    internal: true  # Database not accessible from outside
    name: jerash-backend

# =============================================================================
# Volumes
# =============================================================================
volumes:
  postgres_data:
    driver: local
    name: jerash-postgres-data
  redis_data:
    driver: local
    name: jerash-redis-data
  uploads:
    driver: local
    name: jerash-uploads

# =============================================================================
# Secrets
# =============================================================================
secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### 7.4 .dockerignore

```
# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
build
.next
.nuxt

# Git
.git
.gitignore
.gitattributes

# IDE
.vscode
.idea
*.swp
*.swo

# Environment files (use secrets instead)
.env
.env.*
!.env.example

# Documentation
*.md
docs
LICENSE

# Tests
test
tests
__tests__
*.test.*
*.spec.*
coverage
.nyc_output

# Development files
.eslintrc*
.prettierrc*
tsconfig*.json
jest.config.*
vitest.config.*

# CI/CD
.github
.gitlab-ci.yml
.circleci
Jenkinsfile

# Docker (don't include in context)
Dockerfile*
docker-compose*
.docker

# Misc
*.log
*.tmp
.DS_Store
Thumbs.db
```

---

## Sources

### Official Documentation
- [pnpm Docker Guide](https://pnpm.io/docker) - Official pnpm documentation
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/docker) - Official Prisma documentation
- [Docker Compose Secrets](https://docs.docker.com/compose/how-tos/use-secrets/) - Official Docker documentation
- [Docker Compose Health Checks](https://docs.docker.com/compose/how-tos/startup-order/) - Official Docker documentation
- [Docker Resource Constraints](https://docs.docker.com/engine/containers/resource_constraints/) - Official Docker documentation
- [Nginx Compression](https://docs.nginx.com/nginx/admin-guide/web-server/compression/) - Official Nginx documentation

### Security Best Practices
- [Snyk Node.js Docker Best Practices](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
- [OWASP Node.js Docker Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NodeJS_Docker_Cheat_Sheet.html)
- [Trivy Container Scanning](https://trivy.dev/docs/latest/guide/target/container_image/)

### Community Resources
- [Captain Codeman - pnpm Monorepo Docker](https://www.captaincodeman.com/build-a-docker-container-from-a-pnpm-monorepo)
- [Build with Matija - React Vite Docker](https://www.buildwithmatija.com/blog/production-react-vite-docker-deployment)
- [Better Stack - Node.js Logging](https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/)
- [RisingStack - Graceful Shutdown](https://blog.risingstack.com/graceful-shutdown-node-js-kubernetes/)
- [Last9 - Docker Compose Health Checks](https://last9.io/blog/docker-compose-health-checks/)

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| pnpm Docker patterns | HIGH | Official documentation verified |
| Prisma Docker setup | HIGH | Official documentation verified |
| Nginx SPA config | HIGH | Well-documented, standard patterns |
| Health checks | HIGH | Official Docker documentation |
| Graceful shutdown | HIGH | Multiple verified sources |
| Security headers | HIGH | OWASP and industry standards |
| Resource limits | MEDIUM | Varies by workload, needs tuning |
| FFmpeg setup | MEDIUM | Multiple approaches, depends on use case |

---

## Roadmap Implications

Based on this research, the Docker implementation should be phased:

### Phase 1: Foundation
- Base Dockerfiles for API and frontends
- Basic docker-compose.yml for development
- .dockerignore files

### Phase 2: Production Hardening
- Multi-stage builds with pnpm deploy
- Health checks for all services
- Non-root users
- Graceful shutdown handlers

### Phase 3: Enterprise Features
- Docker secrets integration
- Resource limits tuning
- Nginx reverse proxy with SSL
- Trivy scanning in CI/CD

### Phase 4: Optimization
- BuildKit cache optimization
- Image size reduction
- Brotli compression
- Structured logging
