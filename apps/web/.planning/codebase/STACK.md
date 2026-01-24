# Technology Stack

**Analysis Date:** 2026-01-21

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (strict mode enabled)

**Secondary:**
- JSON - Configuration and i18n translation files
- CSS - Styling via Tailwind CSS

## Runtime

**Environment:**
- Node.js (no version file, relies on LTS)
- Browser (ES2022 target)

**Package Manager:**
- pnpm (required, see CLAUDE.md)
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- React 19.2.0 - UI framework with Concurrent features
- React Compiler (babel-plugin-react-compiler 1.0.0) - Automatic performance optimizations
- React Router 7.11.0 - Client-side routing via `createBrowserRouter`

**State Management:**
- Zustand 5.0.9 - Global state with persist middleware
- TanStack React Query 5.90.16 - Server state and caching
- Immer 11.1.3 - Immutable state updates (available)

**Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS (via Vite plugin)
- class-variance-authority 0.7.1 - Variant styling
- tailwind-merge 3.4.0 - Class merging
- clsx 2.1.1 - Conditional classes
- tw-animate-css 1.4.0 - Animation utilities

**Animation:**
- Framer Motion 12.24.3 - React animations
- GSAP 3.14.2 - Advanced animations
- OGL 1.0.11 - WebGL rendering

**Forms:**
- React Hook Form 7.70.0 - Form state management
- @hookform/resolvers 5.2.2 - Schema validation integration
- Zod 4.3.5 - Schema validation

**i18n:**
- i18next 25.7.3 - Internationalization core
- react-i18next 16.5.1 - React bindings
- i18next-browser-languagedetector 8.2.0 - Auto language detection
- i18next-resources-to-backend 1.2.1 - Dynamic translation loading

**UI Components:**
- Radix UI primitives (@radix-ui/react-dropdown-menu, @radix-ui/react-slot)
- Lucide React 0.562.0 - Icons
- shadcn CLI 3.6.3 - Component scaffolding (devDependency)

**HTTP:**
- Axios 1.13.2 - HTTP client with interceptors

**SEO:**
- react-helmet-async 2.0.5 - Document head management

**Build/Dev:**
- Vite (via rolldown-vite 7.2.5) - Build tool with Rolldown bundler
- @vitejs/plugin-react 5.1.1 - React plugin with Babel integration
- @tailwindcss/vite 4.1.18 - Tailwind Vite plugin

**Testing:**
- Not configured (no test framework detected)

**Linting:**
- ESLint 9.39.1 - Flat config format
- typescript-eslint 8.46.4 - TypeScript rules
- eslint-plugin-react-hooks 7.0.1 - Hooks rules
- eslint-plugin-react-refresh 0.4.24 - Fast refresh compatibility

## Key Dependencies

**Critical:**
- `react` 19.2.0 - Core UI rendering
- `react-router` 7.11.0 - All navigation
- `@tanstack/react-query` 5.90.16 - All API data fetching
- `zustand` 5.0.9 - Theme and UI state persistence
- `axios` 1.13.2 - All HTTP requests

**Infrastructure:**
- `vite` (rolldown-vite 7.2.5) - Development server and build
- `tailwindcss` 4.1.18 - All styling
- `i18next` 25.7.3 - Arabic/English support with RTL

## Configuration

**Environment:**
- Variables via `.env` files with `VITE_` prefix
- Required vars (see `.env.example`):
  - `VITE_API_URL` - Backend API base URL
  - `VITE_SITE_URL` - Site URL for SEO/OG tags

**Build:**
- `vite.config.ts` - Vite configuration with React Compiler and Tailwind plugins
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App TypeScript config (ES2022, strict mode)
- `tsconfig.node.json` - Node/Vite config TypeScript
- `eslint.config.js` - ESLint 9 flat config

**Path Aliases:**
- `@/*` maps to `./src/*`

## Platform Requirements

**Development:**
- Node.js (LTS recommended)
- pnpm package manager

**Production:**
- Static hosting (SPA)
- No SSR requirements
- Browser target: ES2022 compatible

## Commands

```bash
pnpm dev       # Start development server
pnpm build     # TypeScript check + Vite build
pnpm lint      # ESLint
pnpm preview   # Preview production build
```

---

*Stack analysis: 2026-01-21*
