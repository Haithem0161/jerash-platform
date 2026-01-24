# External Integrations

**Analysis Date:** 2026-01-21

## APIs & External Services

**Backend API:**
- Generic REST API integration prepared
  - Client: Axios (`src/lib/axios.ts`)
  - Base URL: `VITE_API_URL` env var (defaults to `/api`)
  - Auth: Bearer token from localStorage
  - Timeout: 10 seconds

**No Third-Party Services Detected:**
- No Stripe, Supabase, Firebase, or AWS SDK imports found
- No analytics services configured
- No error tracking services configured

## Data Storage

**Databases:**
- None (frontend-only application)
- Backend API expected at `VITE_API_URL`

**Local Storage:**
- `token` - JWT auth token (managed by `src/lib/axios.ts`)
- `theme-storage` - Theme preference (managed by `src/stores/useThemeStore.ts`)
- `i18nextLng` - Language preference (managed by i18next)

**File Storage:**
- None (no file upload integrations)

**Caching:**
- React Query client-side caching (`src/lib/queryClient.ts`)
  - staleTime: 5 minutes
  - gcTime: 30 minutes
  - Retry: 3 times (except 4xx errors)

## Authentication & Identity

**Auth Provider:**
- Custom token-based (prepared, not implemented)
  - Token storage: localStorage
  - Header: `Authorization: Bearer {token}`
  - 401 handling: clears token (redirect commented out)
  - Implementation: `src/lib/axios.ts` interceptors

**No External Auth:**
- No OAuth providers configured
- No social login integrations

## Monitoring & Observability

**Error Tracking:**
- None configured

**Logs:**
- Browser console only
- No structured logging

**Analytics:**
- None configured

## CI/CD & Deployment

**Hosting:**
- Not configured (static SPA, any static host works)

**CI Pipeline:**
- None detected (no `.github/workflows`, no CI config)

**Build Output:**
- `dist/` directory (Vite default)

## Environment Configuration

**Required env vars:**
- `VITE_API_URL` - Backend API base URL (required for API calls)
- `VITE_SITE_URL` - Site URL for SEO meta tags

**Example configuration (`.env.example`):**
```
VITE_API_URL=http://localhost:3000/api
VITE_SITE_URL=http://localhost:5173
```

**Secrets location:**
- `.env` file (gitignored)
- No secrets management service

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## API Client Setup

**Axios Instance (`src/lib/axios.ts`):**
```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

**Request Interceptor:**
- Adds `Authorization: Bearer {token}` header if token exists in localStorage

**Response Interceptor:**
- On 401: clears token from localStorage

**React Query Client (`src/lib/queryClient.ts`):**
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (status >= 400 && status < 500) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
```

## Prepared API Patterns

**Example API module (`src/api/index.ts`):**
```typescript
export const usersApi = {
  getAll: async (page, pageSize): Promise<PaginatedResponse<User>> => { ... },
  getById: async (id): Promise<ApiResponse<User>> => { ... },
  create: async (data): Promise<ApiResponse<User>> => { ... },
  update: async (id, data): Promise<ApiResponse<User>> => { ... },
  delete: async (id): Promise<void> => { ... },
}
```

**Types (`src/types/index.ts`):**
```typescript
interface ApiResponse<T> { data: T; message?: string }
interface PaginatedResponse<T> { data: T[]; meta: { total, page, pageSize, totalPages } }
interface ApiError { message: string; code?: string; details?: Record<string, string[]> }
```

## i18n Integration

**Languages:**
- English (`en`) - default
- Arabic (`ar`) - RTL support

**Translation Files:**
- `src/locales/en/common.json`
- `src/locales/ar/common.json`

**Features:**
- Browser language detection
- localStorage persistence
- Dynamic RTL switching on language change
- Lazy loading via `resourcesToBackend`

---

*Integration audit: 2026-01-21*
