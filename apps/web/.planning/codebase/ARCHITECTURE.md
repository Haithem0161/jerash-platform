# Architecture

**Analysis Date:** 2026-01-21

## Pattern Overview

**Overall:** Feature-based Component Architecture with Provider Composition

**Key Characteristics:**
- React 19 with React Compiler for automatic memoization
- Provider composition pattern for cross-cutting concerns (theming, i18n, data fetching, SEO)
- React Router v7 with nested layouts for page structure
- Zustand for client state, TanStack Query for server state
- Barrel file exports for clean imports

## Layers

**Entry Layer:**
- Purpose: Bootstrap application with React 19 StrictMode
- Location: `src/main.tsx`
- Contains: ReactDOM root creation
- Depends on: App component, CSS
- Used by: Vite build system

**App Orchestration Layer:**
- Purpose: Compose providers and initialize routing
- Location: `src/App.tsx`
- Contains: Provider wrapping, RouterProvider
- Depends on: Providers, Router config
- Used by: Entry point

**Provider Layer:**
- Purpose: Inject cross-cutting concerns into component tree
- Location: `src/components/providers/`
- Contains: HelmetProvider, QueryProvider, ThemeProvider, I18nProvider
- Depends on: Zustand stores, TanStack Query client, i18n config
- Used by: App component
- Provider Order (outside to inside):
  1. HelmetProvider (SEO/meta)
  2. QueryProvider (server state)
  3. ThemeProvider (theme management)
  4. I18nProvider (translations)

**Routing Layer:**
- Purpose: Define URL-to-component mapping and layouts
- Location: `src/routes/index.tsx`
- Contains: Route definitions, layout nesting
- Depends on: Layout components, Page components
- Used by: RouterProvider in App

**Layout Layer:**
- Purpose: Define consistent page structure (header, footer, content area)
- Location: `src/components/layout/`
- Contains: RootLayout, Header, Footer, Container
- Depends on: Common components, hooks
- Used by: Routes as layout wrappers

**Page Layer:**
- Purpose: Render route-specific content
- Location: `src/routes/pages/`
- Contains: Full page components (HomePage, NotFoundPage)
- Depends on: Layout components, Common components, SEO
- Used by: Router configuration

**Common Components Layer:**
- Purpose: Shared UI building blocks
- Location: `src/components/common/`
- Contains: SEO, ThemeToggle, LanguageSwitcher
- Depends on: UI components, hooks, stores
- Used by: Layout and Page components

**UI Components Layer:**
- Purpose: Primitive UI components (shadcn/ui based)
- Location: `src/components/ui/`
- Contains: Button, DropdownMenu (Radix-based)
- Depends on: CVA, clsx, tailwind-merge
- Used by: Common and feature components

**State Layer:**
- Purpose: Client-side state management
- Location: `src/stores/`
- Contains: Zustand stores (useThemeStore, useUIStore)
- Depends on: Zustand, persist middleware
- Used by: Components, providers

**Library Layer:**
- Purpose: Configuration and utilities
- Location: `src/lib/`
- Contains: Axios instance, QueryClient, i18n config, cn() utility
- Depends on: External libraries
- Used by: All layers

**API Layer:**
- Purpose: HTTP client wrappers for backend communication
- Location: `src/api/`
- Contains: Resource-specific API functions (usersApi)
- Depends on: Axios instance, types
- Used by: TanStack Query hooks (future)

**Types Layer:**
- Purpose: Shared TypeScript interfaces
- Location: `src/types/`
- Contains: API types, component prop types, form types
- Depends on: Nothing
- Used by: All typed files

**Hooks Layer:**
- Purpose: Reusable React hooks
- Location: `src/hooks/`
- Contains: useLocalStorage, useMediaQuery, viewport hooks
- Depends on: React
- Used by: Components

## Data Flow

**Page Render Flow:**

1. `main.tsx` renders `App` in StrictMode
2. `App` wraps `RouterProvider` with `Providers` composition
3. Router matches URL to route config
4. `RootLayout` renders with `<Outlet />` for child routes
5. Page component renders inside `<Outlet />`

**State Management Flow:**

1. Server state: API calls via `src/lib/axios.ts` -> TanStack Query caches response
2. Client state: Components dispatch to Zustand stores
3. Theme state: Persisted to localStorage, applied to `<html>` classList
4. Language state: Detected/stored by i18next, updates `<html>` dir and lang

**Internationalization Flow:**

1. `I18nProvider` initializes i18next with lazy-loaded JSON resources
2. `useTranslation()` hook accesses translations by namespace
3. Language change triggers document direction update (RTL support)
4. Translation files: `src/locales/{lang}/{namespace}.json`

## Key Abstractions

**Provider Composition:**
- Purpose: Inject dependencies without prop drilling
- Examples: `src/components/providers/index.tsx`
- Pattern: Nested providers with clear order

**Barrel Exports:**
- Purpose: Clean import paths via index files
- Examples: `src/components/layout/index.ts`, `src/stores/index.ts`, `src/hooks/index.ts`
- Pattern: Re-export all public members from index.ts

**Zustand Stores:**
- Purpose: Atomic client state with persistence
- Examples: `src/stores/useThemeStore.ts`, `src/stores/useUIStore.ts`
- Pattern: `create<State>()(persist(...))` with selectors

**Container Component:**
- Purpose: Consistent max-width and padding wrapper
- Examples: `src/components/layout/Container.tsx`
- Pattern: Polymorphic component (as prop)

## Entry Points

**Browser Entry:**
- Location: `src/main.tsx`
- Triggers: Browser loading index.html
- Responsibilities: Mount React app to DOM

**Build Entry:**
- Location: `vite.config.ts`
- Triggers: pnpm dev, pnpm build
- Responsibilities: Configure Vite, Tailwind, React Compiler

**Route Entry:**
- Location: `src/routes/index.tsx`
- Triggers: URL navigation
- Responsibilities: Map URLs to page components

## Error Handling

**Strategy:** Centralized interceptors + component-level try/catch

**Patterns:**
- Axios response interceptor handles 401 (clears token, optional redirect)
- TanStack Query retry logic skips 4xx errors
- React Suspense boundary in I18nProvider for translation loading

## Cross-Cutting Concerns

**Logging:** Console-based (no structured logging library detected)

**Validation:** Zod available but not yet integrated (installed as dependency)

**Authentication:** Token-based (Bearer token in localStorage, injected via Axios interceptor)

**SEO:** react-helmet-async with SEO component for meta tags, OG, Twitter cards

**Theming:** CSS class-based (light/dark on `<html>`), Zustand persistence

**RTL Support:** i18next language change updates `dir` attribute automatically

---

*Architecture analysis: 2026-01-21*
