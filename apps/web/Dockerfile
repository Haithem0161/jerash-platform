# =============================================================================
# Base stage: Setup pnpm with Corepack
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

# Copy workspace configuration first for better layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all package.json files needed for this app
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

# Install dependencies with BuildKit cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build shared packages first (web depends on these)
RUN pnpm --filter @repo/types build
RUN pnpm --filter @repo/validation build

# Build-time environment variables for Vite
ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_SITE_URL=http://localhost:5173

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

# Build the web application
RUN pnpm --filter web build

# =============================================================================
# Production stage: Serve with Nginx
# =============================================================================
FROM nginx:1.27-alpine AS production

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from build stage
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Set correct permissions for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# Install curl for health check and clean cache
RUN apk add --no-cache curl

# Expose port 80
EXPOSE 80

# Health check using curl (installed in alpine) - use 127.0.0.1 to avoid IPv6 issues
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -sf http://127.0.0.1/health || exit 1

# Run as non-root user
USER nginx

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
