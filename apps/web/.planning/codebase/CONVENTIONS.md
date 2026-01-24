# Coding Conventions

**Analysis Date:** 2026-01-21

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `LanguageSwitcher.tsx`, `ThemeToggle.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useLocalStorage.ts`, `useMediaQuery.ts`)
- Stores: camelCase with `use` prefix (e.g., `useThemeStore.ts`, `useUIStore.ts`)
- Utilities: camelCase (e.g., `utils.ts`, `axios.ts`, `queryClient.ts`)
- Index files: `index.ts` or `index.tsx` for barrel exports

**Functions:**
- Components: PascalCase function declarations (e.g., `function Header()`)
- Hooks: camelCase with `use` prefix (e.g., `useLocalStorage`, `useMediaQuery`)
- Event handlers: camelCase with `handle` prefix (e.g., `handleLanguageChange`, `handleStorageChange`)
- Utilities: camelCase (e.g., `cn`, `applyTheme`, `getSystemTheme`)

**Variables:**
- Constants: camelCase or UPPER_SNAKE_CASE for true constants (e.g., `SITE_NAME`, `DEFAULT_DESCRIPTION`)
- State: camelCase (e.g., `storedValue`, `matches`, `sidebarOpen`)
- Props interfaces: PascalCase with `Props` suffix (e.g., `ContainerProps`, `SEOProps`, `ThemeProviderProps`)

**Types:**
- Interfaces: PascalCase (e.g., `ApiResponse`, `PaginatedResponse`, `User`)
- Type aliases: PascalCase (e.g., `Theme`, `SupportedLanguage`)
- Generic types: Single uppercase letter or descriptive PascalCase (e.g., `T`, `ApiResponse<T>`)

## Code Style

**Formatting:**
- No Prettier config detected; rely on ESLint for formatting
- Use single quotes for strings
- No trailing commas enforced
- 2-space indentation (standard)

**Linting:**
- ESLint 9 with flat config format (`eslint.config.js`)
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` recommended rules
- `eslint-plugin-react-refresh` for Vite HMR compatibility
- Ignores `dist/` directory

**TypeScript Strict Settings (from `tsconfig.app.json`):**
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedSideEffectImports: true`

## Import Organization

**Order:**
1. React and React ecosystem (e.g., `react`, `react-dom`, `react-router`)
2. Third-party libraries (e.g., `@tanstack/react-query`, `zustand`, `lucide-react`)
3. Path alias imports (`@/lib/*`, `@/components/*`, `@/stores/*`, etc.)
4. Relative imports (`./`, `../`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)

**Examples from codebase:**
```typescript
// From src/App.tsx
import { RouterProvider } from 'react-router'
import { Providers } from '@/components/providers'
import { router } from '@/routes'

// From src/components/common/ThemeToggle.tsx
import { Moon, Sun, Monitor } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { cn } from '@/lib/utils'
```

## Error Handling

**Patterns:**
- Use try/catch for localStorage operations with `console.warn` for errors:
```typescript
// From src/hooks/useLocalStorage.ts
try {
  const item = window.localStorage.getItem(key)
  return item ? (JSON.parse(item) as T) : initialValue
} catch (error) {
  console.warn(`Error reading localStorage key "${key}":`, error)
  return initialValue
}
```

- Axios interceptors for API error handling:
```typescript
// From src/lib/axios.ts
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)
```

- React Query retry logic with 4xx exclusion:
```typescript
// From src/lib/queryClient.ts
retry: (failureCount, error) => {
  if (error instanceof Error && 'status' in error) {
    const status = (error as { status: number }).status
    if (status >= 400 && status < 500) return false
  }
  return failureCount < 3
}
```

## Logging

**Framework:** Browser `console` (no dedicated logging library)

**Patterns:**
- Use `console.warn` for recoverable errors (e.g., localStorage failures)
- No structured logging or log levels beyond console methods

## Comments

**When to Comment:**
- JSDoc-style comments not used extensively
- Inline comments for clarification (e.g., `// React already escapes`, `// Theme is applied via Zustand's onRehydrateStorage`)
- TODO comments for placeholder code (e.g., `// Add navigation links here`)

**JSDoc/TSDoc:**
- Not detected; interfaces and types serve as documentation

## Function Design

**Size:**
- Keep functions focused and small (typically under 30 lines)
- Extract reusable logic into utility functions or custom hooks

**Parameters:**
- Use object destructuring for props:
```typescript
export function Container({
  children,
  className,
  as: Component = 'div',
}: ContainerProps) { ... }
```

- Use generics for reusable patterns:
```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] { ... }
```

**Return Values:**
- Components return JSX
- Hooks return tuples or objects
- API functions return typed Promises

## Module Design

**Exports:**
- Named exports preferred over default exports (except `App.tsx`)
- Export at declaration for components: `export function ComponentName() { ... }`
- Export at end for related items: `export { Button, buttonVariants }`

**Barrel Files:**
- Use `index.ts`/`index.tsx` files for re-exports from directories:
```typescript
// From src/components/common/index.ts
export { SEO } from './SEO'
export { ThemeToggle } from './ThemeToggle'
export { LanguageSwitcher } from './LanguageSwitcher'
```

## Component Patterns

**Props Interface Pattern:**
```typescript
interface ComponentProps {
  children: React.ReactNode
  className?: string
}

export function Component({ children, className }: ComponentProps) { ... }
```

**Polymorphic Components:**
```typescript
// From src/components/layout/Container.tsx
interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'main' | 'article'
}

export function Container({
  children,
  className,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Component>
  )
}
```

**Variant Pattern (shadcn/ui style):**
```typescript
// From src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: { default: "...", destructive: "...", outline: "..." },
      size: { default: "...", sm: "...", lg: "..." },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant, size, asChild, ...props }: ...) {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

## State Management Patterns

**Zustand Store Pattern:**
```typescript
// From src/stores/useUIStore.ts
interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
```

**Zustand with Persistence:**
```typescript
// From src/stores/useThemeStore.ts
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => { applyTheme(theme); set({ theme }) },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)
```

## i18n Pattern

**Translation Hook Usage:**
```typescript
const { t } = useTranslation()

// With fallback
{t('home.title', 'Home')}
{t('home.heading', 'Welcome to Jerash')}
```

## CSS/Styling Conventions

**Tailwind CSS Utility Pattern:**
- Use `cn()` utility from `@/lib/utils` for conditional classes:
```typescript
className={cn(
  'rounded-md px-2 py-1 text-sm transition-colors',
  currentLang === lang
    ? 'bg-accent text-accent-foreground'
    : 'text-muted-foreground hover:text-foreground'
)}
```

**Responsive Design:**
- Mobile-first approach: `sm:`, `md:`, `lg:` breakpoint prefixes
- Example: `'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'`

---

*Convention analysis: 2026-01-21*
