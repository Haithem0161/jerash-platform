# Codebase Structure

**Analysis Date:** 2026-01-21

## Directory Layout

```
the-studio-website-new/
├── public/              # Static assets (served as-is)
├── src/
│   ├── api/             # API client functions
│   ├── assets/          # Imported assets (processed by Vite)
│   ├── components/
│   │   ├── common/      # Shared feature components
│   │   ├── layout/      # Page structure components
│   │   ├── providers/   # React context providers
│   │   └── ui/          # Primitive UI components (shadcn)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Configurations and utilities
│   ├── locales/         # i18n translation files
│   │   ├── ar/          # Arabic translations
│   │   └── en/          # English translations
│   ├── routes/
│   │   └── pages/       # Page components
│   ├── stores/          # Zustand state stores
│   ├── types/           # TypeScript type definitions
│   ├── App.css          # Global styles
│   ├── App.tsx          # Root app component
│   └── main.tsx         # Entry point
├── .planning/           # GSD planning documents
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config root
├── tsconfig.app.json    # App TypeScript config
├── tsconfig.node.json   # Node TypeScript config
└── eslint.config.js     # ESLint flat config
```

## Directory Purposes

**`public/`:**
- Purpose: Static files served without processing
- Contains: Images, PDFs, favicons, og-image
- Key files: `Jerash-logo-color.png`

**`src/api/`:**
- Purpose: HTTP API client functions grouped by resource
- Contains: API function objects (e.g., usersApi)
- Key files: `src/api/index.ts`

**`src/assets/`:**
- Purpose: Assets imported into code (processed by Vite)
- Contains: Images, SVGs, fonts that need bundling

**`src/components/common/`:**
- Purpose: Reusable feature-level components
- Contains: SEO, ThemeToggle, LanguageSwitcher
- Key files: `src/components/common/index.ts` (barrel export)

**`src/components/layout/`:**
- Purpose: Page structure and layout primitives
- Contains: RootLayout, Header, Footer, Container
- Key files: `src/components/layout/index.ts` (barrel export)

**`src/components/providers/`:**
- Purpose: React context providers for cross-cutting concerns
- Contains: QueryProvider, ThemeProvider, I18nProvider
- Key files: `src/components/providers/index.tsx` (composed Providers)

**`src/components/ui/`:**
- Purpose: Primitive UI components from shadcn/ui
- Contains: Button, DropdownMenu (Radix-based)
- Key files: Individual component files (lowercase)

**`src/hooks/`:**
- Purpose: Custom React hooks for reusable logic
- Contains: useLocalStorage, useMediaQuery, viewport hooks
- Key files: `src/hooks/index.ts` (barrel export)

**`src/lib/`:**
- Purpose: Library configurations and utility functions
- Contains: Axios instance, QueryClient, i18n setup, cn()
- Key files: `src/lib/axios.ts`, `src/lib/queryClient.ts`, `src/lib/i18n.ts`, `src/lib/utils.ts`

**`src/locales/`:**
- Purpose: i18n translation JSON files
- Contains: Namespace-based translation files per language
- Key files: `src/locales/en/common.json`, `src/locales/ar/common.json`

**`src/routes/`:**
- Purpose: Router configuration and route definitions
- Contains: Route config, page components
- Key files: `src/routes/index.tsx`

**`src/routes/pages/`:**
- Purpose: Full page components for each route
- Contains: HomePage, NotFoundPage
- Key files: Named with PascalCase + Page suffix

**`src/stores/`:**
- Purpose: Zustand global state stores
- Contains: Theme store, UI store
- Key files: `src/stores/index.ts` (barrel export)

**`src/types/`:**
- Purpose: Shared TypeScript interfaces and types
- Contains: API types, component prop types
- Key files: `src/types/index.ts` (barrel export)

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React DOM entry point
- `src/App.tsx`: Root component with providers
- `src/routes/index.tsx`: Router configuration
- `index.html`: HTML shell

**Configuration:**
- `vite.config.ts`: Vite + React Compiler + Tailwind config
- `tsconfig.json`: TypeScript project references
- `tsconfig.app.json`: App TypeScript config (strict mode)
- `eslint.config.js`: ESLint 9 flat config
- `package.json`: Dependencies and scripts

**Core Logic:**
- `src/lib/axios.ts`: HTTP client with interceptors
- `src/lib/queryClient.ts`: TanStack Query client config
- `src/lib/i18n.ts`: i18next initialization
- `src/stores/useThemeStore.ts`: Theme state with persistence

**Layout:**
- `src/components/layout/RootLayout.tsx`: Main page wrapper
- `src/components/layout/Header.tsx`: Site header
- `src/components/layout/Footer.tsx`: Site footer
- `src/components/layout/Container.tsx`: Max-width wrapper

## Naming Conventions

**Files:**
- Components: PascalCase.tsx (`HomePage.tsx`, `ThemeToggle.tsx`)
- UI components (shadcn): lowercase.tsx (`button.tsx`, `dropdown-menu.tsx`)
- Hooks: camelCase with use prefix (`useMediaQuery.ts`)
- Stores: camelCase with use prefix (`useThemeStore.ts`)
- Utilities: camelCase (`utils.ts`, `axios.ts`)
- Types: camelCase (`index.ts`)
- Translations: lowercase namespace (`common.json`)

**Directories:**
- All lowercase, singular (`components`, `hooks`, `stores`)
- Language codes for locales (`en`, `ar`)

**Exports:**
- Named exports preferred over default (except App.tsx)
- Barrel files: `index.ts` or `index.tsx`

## Where to Add New Code

**New Page:**
- Create page component: `src/routes/pages/NewPage.tsx`
- Add route in: `src/routes/index.tsx`
- Use pattern: Export function `NewPagePage`, wrap with SEO component

**New Feature Component:**
- Create component: `src/components/common/FeatureName.tsx`
- Export from: `src/components/common/index.ts`

**New UI Primitive:**
- Use shadcn CLI: `pnpm dlx shadcn@latest add component-name`
- Result goes to: `src/components/ui/`

**New Hook:**
- Create hook: `src/hooks/useHookName.ts`
- Export from: `src/hooks/index.ts`

**New Store:**
- Create store: `src/stores/useStoreName.ts`
- Export from: `src/stores/index.ts`
- Pattern: Zustand create with typed state interface

**New API Resource:**
- Add to existing or create: `src/api/resourceName.ts`
- Export from: `src/api/index.ts`
- Pattern: Object with CRUD methods using `api` from lib/axios

**New Type:**
- Add to: `src/types/index.ts`
- Or create domain file: `src/types/domainName.ts` and re-export

**New Translation Namespace:**
- Create: `src/locales/en/namespaceName.json`
- Create: `src/locales/ar/namespaceName.json`
- Add namespace to i18n config ns array in `src/lib/i18n.ts`

**New Utility:**
- Add to: `src/lib/utils.ts` (general)
- Or create specific file: `src/lib/specificUtil.ts`

## Special Directories

**`.planning/`:**
- Purpose: GSD planning and codebase documentation
- Generated: By Claude Code mapping
- Committed: Yes (for project context)

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (pnpm install)
- Committed: No (in .gitignore)

**`dist/`:**
- Purpose: Production build output
- Generated: Yes (pnpm build)
- Committed: No (in .gitignore)

**`.claude/`:**
- Purpose: Claude Code configuration
- Generated: By Claude Code
- Committed: Optional

## Path Aliases

**Configured in tsconfig.json and vite.config.ts:**
- `@/*` maps to `./src/*`

**Usage examples:**
```typescript
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores'
import { Button } from '@/components/ui/button'
```

---

*Structure analysis: 2026-01-21*
