# Jerash Platform

A full-stack monorepo platform with a public website, admin dashboard, and API.

## Architecture

| App | Tech Stack | Port |
|-----|------------|------|
| **web** | React 19 + Vite | 5173 |
| **admin** | React 19 + Vite | 5174 |
| **api** | Fastify + Prisma | 3000 |
| **postgres** | PostgreSQL 17 | 5433 |

## Quick Start (Docker)

Start all services with a single command:

```bash
# 1. Copy environment file
cp .env.docker.example .env

# 2. Start all services
docker compose up -d

# 3. Run database migrations and seed
docker compose exec api npx prisma db push
docker compose exec api npx prisma db seed
```

Access the applications:
- **Web**: http://localhost:5173
- **Admin**: http://localhost:5174
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/docs

### Docker Commands

```bash
# Start all services
docker compose up -d

# Rebuild and start
docker compose up -d --build

# View logs
docker compose logs -f api
docker compose logs -f web
docker compose logs -f admin

# Stop all services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v
```

## Local Development (without Docker)

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+

### Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL (using Docker)
docker compose -f docker/docker-compose.yml up -d

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Run database migrations
pnpm db:push
pnpm db:seed

# Start all apps in development mode
pnpm dev
```

### Development Commands

```bash
# Run all apps
pnpm dev

# Run individual apps
pnpm dev:web
pnpm dev:admin
pnpm dev:api

# Build all apps
pnpm build

# Lint all apps
pnpm lint
```

### Database Commands

```bash
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed database
pnpm db:studio    # Open Prisma Studio
pnpm db:generate  # Generate Prisma client
```

## Project Structure

```
jerash-platform/
├── apps/
│   ├── web/           # Public website (React + Vite)
│   ├── admin/         # Admin dashboard (React + Vite)
│   └── api/           # Backend API (Fastify + Prisma)
├── packages/
│   ├── types/         # Shared TypeScript types
│   └── validation/    # Shared Zod schemas
├── docker/            # Docker configs (DB only)
├── docker-compose.yml # Full stack Docker setup
└── pnpm-workspace.yaml
```

## Environment Variables

See `.env.docker.example` for all available configuration options.

### Required for Production

```bash
POSTGRES_PASSWORD=<strong-password>
JWT_SECRET=<random-32-char-string>
JWT_REFRESH_SECRET=<random-32-char-string>
```

## Default Credentials

After seeding the database:

- **Email**: admin@jerash.com
- **Password**: admin123
