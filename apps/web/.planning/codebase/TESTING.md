# Testing Patterns

**Analysis Date:** 2026-01-21

## Test Framework

**Runner:**
- **Not configured**: No test framework (Jest, Vitest, etc.) detected in `package.json`
- No `jest.config.*` or `vitest.config.*` files present

**Assertion Library:**
- Not applicable (no test framework)

**Run Commands:**
```bash
# No test commands defined in package.json
# Available scripts:
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm lint      # Run ESLint
pnpm preview   # Preview production build
```

## Test File Organization

**Location:**
- No test files detected (`*.test.*`, `*.spec.*`)

**Naming:**
- Not established (no existing tests)

**Recommended Structure (when tests are added):**
```
src/
├── components/
│   ├── common/
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeToggle.test.tsx    # Co-located
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx          # Co-located
├── hooks/
│   ├── useLocalStorage.ts
│   └── useLocalStorage.test.ts      # Co-located
└── __tests__/                       # Integration tests (alternative)
    └── integration/
```

## Test Structure

**Suite Organization:**
- Not established

**Recommended Pattern (Vitest with React Testing Library):**
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('renders all theme options', () => {
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Light')).toBeInTheDocument()
    expect(screen.getByLabelText('Dark')).toBeInTheDocument()
    expect(screen.getByLabelText('System')).toBeInTheDocument()
  })

  it('calls setTheme when option clicked', () => {
    // Test implementation
  })
})
```

## Mocking

**Framework:** Not applicable (no test framework)

**Recommended Patterns:**

**Zustand Store Mocking:**
```typescript
import { vi } from 'vitest'

vi.mock('@/stores/useThemeStore', () => ({
  useThemeStore: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
  })),
}))
```

**Axios/API Mocking:**
```typescript
import { vi } from 'vitest'

vi.mock('@/lib/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))
```

**i18n Mocking:**
```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}))
```

**What to Mock:**
- External API calls (`@/lib/axios`)
- Browser APIs (`localStorage`, `matchMedia`)
- Zustand stores when testing components in isolation
- i18n for predictable translations

**What NOT to Mock:**
- React components being tested
- Simple utility functions (`cn`, `isRTL`)
- Component composition (test the composed result)

## Fixtures and Factories

**Test Data:**
- Not established

**Recommended Pattern:**
```typescript
// src/__tests__/fixtures/users.ts
import type { User } from '@/types'

export const createUser = (overrides?: Partial<User>): User => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createApiResponse = <T>(data: T) => ({
  data,
  message: 'Success',
})
```

**Location:**
- Recommended: `src/__tests__/fixtures/` or co-located with tests

## Coverage

**Requirements:** None enforced (no test framework)

**Recommended Setup (Vitest):**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx'],
    },
  },
})
```

**View Coverage:**
```bash
# After setup:
pnpm test:coverage
```

## Test Types

**Unit Tests:**
- Not implemented
- Scope: Individual hooks, utilities, and components
- Files to prioritize:
  - `src/hooks/useLocalStorage.ts` - Complex state logic
  - `src/hooks/useMediaQuery.ts` - Browser API interaction
  - `src/lib/utils.ts` - Utility function
  - `src/lib/i18n.ts` - i18n configuration

**Integration Tests:**
- Not implemented
- Scope: Component composition, routing, provider integration
- Files to prioritize:
  - `src/components/providers/index.tsx` - Provider composition
  - `src/routes/index.tsx` - Router configuration

**E2E Tests:**
- Not implemented
- Recommended framework: Playwright or Cypress

## Common Patterns

**Async Testing:**
```typescript
// React Query with testing
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

it('fetches data', async () => {
  const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() })
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
})
```

**Error Testing:**
```typescript
it('handles localStorage errors gracefully', () => {
  const mockGetItem = vi.spyOn(Storage.prototype, 'getItem')
  mockGetItem.mockImplementation(() => { throw new Error('Storage error') })

  const { result } = renderHook(() => useLocalStorage('key', 'default'))
  expect(result.current[0]).toBe('default')

  mockGetItem.mockRestore()
})
```

**Component Testing with Providers:**
```typescript
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </BrowserRouter>
  )
}
```

## Recommended Test Setup

**Installation:**
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
```

**Configuration (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Setup File (`src/test/setup.ts`):**
```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

*Testing analysis: 2026-01-21*
