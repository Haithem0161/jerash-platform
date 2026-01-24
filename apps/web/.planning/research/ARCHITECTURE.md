# Architecture Patterns: Bilingual RTL/LTR Corporate Website

**Domain:** Bilingual corporate website (Arabic RTL + English LTR)
**Researched:** 2026-01-21
**Confidence:** HIGH (existing codebase + established patterns)

## Executive Summary

This architecture builds on the existing React 19 + Vite + react-i18next foundation to create a multi-page bilingual corporate website. The recommended approach uses **language-agnostic URLs** (no `/en/` or `/ar/` prefix) with client-side language switching, leveraging Tailwind's RTL utilities and i18next's direction detection. This is the simplest approach for a corporate site where SEO per language is less critical than user experience.

---

## Recommended Architecture

### High-Level Overview

```
                    +------------------+
                    |    Browser       |
                    +--------+---------+
                             |
                    +--------v---------+
                    |   App.tsx        |
                    |  (Providers)     |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
+--------v-------+  +--------v-------+  +--------v-------+
|  RootLayout    |  |  I18nProvider  |  |  ThemeProvider |
| (Header/Footer)|  | (RTL detection)|  | (light/dark)   |
+--------+-------+  +----------------+  +----------------+
         |
+--------v---------+
|   Page Routes    |
|  (Outlet)        |
+------------------+
         |
+--------v---------+
|  Page Components |
|  Home, Services  |
|  HSE, Gallery... |
+------------------+
         |
+--------v---------+
|  Section/Feature |
|   Components     |
+------------------+
         |
+--------v---------+
|  UI Primitives   |
|  (shadcn/ui)     |
+------------------+
```

### Component Boundaries

| Component Layer | Responsibility | RTL Impact |
|-----------------|----------------|------------|
| **App.tsx** | Provider composition, router | None |
| **RootLayout** | Header, Footer, Outlet wrapper | Structural direction |
| **Page Components** | Route-specific content assembly | Per-section content |
| **Section Components** | Reusable homepage/page sections | Layout direction |
| **Feature Components** | Domain-specific (Gallery, ContactForm) | Content flow |
| **UI Primitives** | Buttons, Cards, Inputs (shadcn/ui) | Logical properties |

---

## Folder Structure

### Recommended Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Provider composition + RouterProvider
├── index.css                   # Global styles + Tailwind
│
├── routes/
│   ├── index.tsx               # Route configuration (createBrowserRouter)
│   └── pages/
│       ├── Home.tsx            # Homepage (rich, animated)
│       ├── Services.tsx        # Services listing
│       ├── HSE.tsx             # HSE dedication page (crown jewel)
│       ├── Gallery.tsx         # Image gallery with masonry
│       ├── Contact.tsx         # Contact form + office locations
│       ├── Careers.tsx         # CV submission form
│       └── NotFound.tsx        # 404 page
│
├── components/
│   ├── layout/
│   │   ├── RootLayout.tsx      # Header + Outlet + Footer wrapper
│   │   ├── Header.tsx          # Navbar with language/theme toggles
│   │   ├── Footer.tsx          # Footer with PO Box, contact info
│   │   ├── Container.tsx       # Max-width wrapper
│   │   └── index.ts            # Barrel export
│   │
│   ├── sections/               # Homepage and page sections
│   │   ├── Hero.tsx            # Hero slideshow
│   │   ├── Vision.tsx          # Vision section
│   │   ├── Mission.tsx         # Mission section
│   │   ├── Values.tsx          # Core values grid
│   │   ├── ManagementPhilosophy.tsx
│   │   ├── Partners.tsx        # Partners showcase (SLB)
│   │   ├── JointVentures.tsx   # Joint ventures (Kweti)
│   │   ├── ServiceHighlights.tsx # Service cards preview
│   │   ├── GalleryPreview.tsx  # Gallery teaser
│   │   └── index.ts
│   │
│   ├── features/               # Domain-specific components
│   │   ├── gallery/
│   │   │   ├── MasonryGrid.tsx # Masonry layout
│   │   │   ├── ImageModal.tsx  # Lightbox modal
│   │   │   └── index.ts
│   │   │
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx # Contact inquiry form
│   │   │   ├── OfficeCard.tsx  # Office location card
│   │   │   └── index.ts
│   │   │
│   │   ├── careers/
│   │   │   ├── CVForm.tsx      # CV submission form
│   │   │   └── index.ts
│   │   │
│   │   └── services/
│   │       ├── ServiceCard.tsx # Service item card
│   │       ├── ServiceCategory.tsx # Category grouping
│   │       └── index.ts
│   │
│   ├── common/                 # Shared components
│   │   ├── SEO.tsx             # React Helmet wrapper
│   │   ├── LanguageSwitcher.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ScrollToTop.tsx     # Scroll restoration
│   │   └── index.ts
│   │
│   ├── ui/                     # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   │
│   ├── animations/             # Framer Motion wrappers
│   │   ├── FadeIn.tsx
│   │   ├── SlideIn.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── variants.ts         # Shared animation variants
│   │   └── index.ts
│   │
│   └── providers/
│       ├── index.tsx           # Composed providers
│       ├── QueryProvider.tsx
│       ├── ThemeProvider.tsx
│       └── I18nProvider.tsx
│
├── lib/
│   ├── i18n.ts                 # i18next configuration
│   ├── axios.ts                # HTTP client (future API)
│   ├── queryClient.ts          # TanStack Query client
│   └── utils.ts                # cn() helper
│
├── hooks/
│   ├── useDirection.ts         # RTL/LTR detection hook
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── useScrollPosition.ts
│   └── index.ts
│
├── stores/
│   ├── useThemeStore.ts        # Theme persistence
│   ├── useUIStore.ts           # UI state (mobile menu, modals)
│   └── index.ts
│
├── types/
│   ├── index.ts
│   └── i18next.d.ts            # Translation key types
│
├── locales/
│   ├── en/
│   │   ├── common.json         # Shared: nav, footer, actions
│   │   ├── home.json           # Homepage sections
│   │   ├── services.json       # Services page
│   │   ├── hse.json            # HSE page
│   │   ├── contact.json        # Contact page
│   │   ├── careers.json        # Careers page
│   │   └── gallery.json        # Gallery page
│   │
│   └── ar/
│       ├── common.json
│       ├── home.json
│       ├── services.json
│       ├── hse.json
│       ├── contact.json
│       ├── careers.json
│       └── gallery.json
│
└── assets/
    └── images/
        ├── logo/
        │   ├── jerash-logo-color.png
        │   └── jerash-logo-white.png
        │
        ├── hero/               # Hero slideshow images
        │   ├── hero-01-field-operations.jpg
        │   ├── hero-02-team-meeting.jpg
        │   └── hero-03-equipment.jpg
        │
        ├── gallery/            # Gallery images (organized)
        │   ├── operations/
        │   │   ├── op-01-drilling.jpg
        │   │   ├── op-02-wireline.jpg
        │   │   └── ...
        │   ├── team/
        │   │   ├── team-01-group.jpg
        │   │   └── ...
        │   └── facilities/
        │       ├── fac-01-basrah.jpg
        │       └── ...
        │
        └── partners/
            ├── slb-logo.png
            └── kweti-logo.png

public/
├── favicon.ico
├── robots.txt
└── sitemap.xml
```

---

## Routing Strategy

### Recommended: Language-Agnostic URLs

For a corporate site targeting regional audience (Iraq), use simple URLs without language prefixes:

```typescript
// src/routes/index.tsx
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { lazy, Suspense } from 'react'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/Home'))
const ServicesPage = lazy(() => import('./pages/Services'))
const HSEPage = lazy(() => import('./pages/HSE'))
const GalleryPage = lazy(() => import('./pages/Gallery'))
const ContactPage = lazy(() => import('./pages/Contact'))
const CareersPage = lazy(() => import('./pages/Careers'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'services',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ServicesPage />
          </Suspense>
        ),
      },
      {
        path: 'hse',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HSEPage />
          </Suspense>
        ),
      },
      {
        path: 'gallery',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GalleryPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'careers',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CareersPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
])
```

### URL Structure

| Page | URL | SEO Title (EN) | SEO Title (AR) |
|------|-----|----------------|----------------|
| Home | `/` | Jerash For Oil Field Services | جرش لخدمات حقول النفط |
| Services | `/services` | Our Services - Jerash | خدماتنا - جرش |
| HSE | `/hse` | Health Safety Environment - Jerash | الصحة والسلامة والبيئة - جرش |
| Gallery | `/gallery` | Photo Gallery - Jerash | معرض الصور - جرش |
| Contact | `/contact` | Contact Us - Jerash | اتصل بنا - جرش |
| Careers | `/careers` | Careers - Jerash | الوظائف - جرش |

### Why Not URL Prefixes (/en/, /ar/)?

| Factor | Language-Agnostic | URL Prefixes |
|--------|-------------------|--------------|
| **Implementation** | Simple - existing setup works | Complex - route duplication |
| **SEO** | Single URL per page | Separate URLs per language |
| **User preference** | Stored in localStorage | Stored in URL |
| **Shareability** | Link opens in user's language | Link opens in specific language |
| **Target audience** | Regional (Iraq) - appropriate | Global - more appropriate |

**Recommendation:** Language-agnostic URLs are simpler and appropriate for a regional corporate site. If future SEO requirements demand per-language indexing, can migrate to prefix-based routing later.

---

## RTL/LTR Component Patterns

### Direction Detection Hook

```typescript
// src/hooks/useDirection.ts
import { useTranslation } from 'react-i18next'

export function useDirection() {
  const { i18n } = useTranslation()
  const dir = i18n.dir()
  const isRTL = dir === 'rtl'

  return { dir, isRTL, isLTR: !isRTL }
}
```

### CSS Strategy: Logical Properties + Tailwind RTL Utilities

**Tailwind v4 logical properties (preferred):**

```tsx
// Use logical properties - automatically handles RTL
<div className="ps-4 pe-2">           {/* padding-inline-start, padding-inline-end */}
<div className="ms-4 me-2">           {/* margin-inline-start, margin-inline-end */}
<div className="text-start">          {/* text-align: start */}
<div className="border-s-2">          {/* border-inline-start */}
<div className="rounded-s-lg">        {/* border-start-start-radius, border-end-start-radius */}
```

**RTL-specific overrides (when needed):**

```tsx
// Icons that need flipping
<ChevronRight className="rtl:rotate-180" />

// Explicit direction overrides
<div className="ltr:flex-row rtl:flex-row-reverse">

// Slide animations
<motion.div
  initial={{ x: isRTL ? 100 : -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
/>
```

### RTL-Aware Component Example

```tsx
// src/components/sections/ServiceHighlights.tsx
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { useDirection } from '@/hooks/useDirection'
import { ChevronRight } from 'lucide-react'

interface ServiceHighlightProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function ServiceHighlight({ title, description, icon }: ServiceHighlightProps) {
  const { t } = useTranslation()
  const { isRTL } = useDirection()

  return (
    <motion.div
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      {/* Icon - stays on start side */}
      <div className="shrink-0">{icon}</div>

      {/* Content - text flows naturally */}
      <div className="flex-1 min-w-0">
        <h3 className="text-start font-semibold">{title}</h3>
        <p className="text-start text-muted-foreground">{description}</p>
      </div>

      {/* Arrow - flip for RTL */}
      <ChevronRight className="shrink-0 rtl:rotate-180" />
    </motion.div>
  )
}
```

### Layout Components with RTL Support

```tsx
// src/components/layout/RootLayout.tsx
import { Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function RootLayout() {
  const { i18n } = useTranslation()

  // Sync document direction with language
  useEffect(() => {
    const dir = i18n.dir()
    document.documentElement.dir = dir
    document.documentElement.lang = i18n.language
  }, [i18n, i18n.language])

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

---

## Translation File Organization

### Namespace Strategy

| Namespace | Content | When Loaded |
|-----------|---------|-------------|
| `common` | Nav, footer, buttons, errors | Always (default) |
| `home` | Homepage sections | `/` route |
| `services` | Services page | `/services` route |
| `hse` | HSE page | `/hse` route |
| `gallery` | Gallery page | `/gallery` route |
| `contact` | Contact page | `/contact` route |
| `careers` | Careers page | `/careers` route |

### Translation File Example

```json
// src/locales/en/common.json
{
  "siteName": "Jerash For Oil Field Services",
  "nav": {
    "home": "Home",
    "services": "Services",
    "hse": "HSE",
    "gallery": "Gallery",
    "contact": "Contact",
    "careers": "Careers"
  },
  "footer": {
    "poBox": "P.O. Box Baghdad-10001",
    "copyright": "All rights reserved.",
    "offices": {
      "basrah": "Basrah Site",
      "erbil": "Erbil Office",
      "baghdad": "Baghdad Office"
    }
  },
  "actions": {
    "learnMore": "Learn More",
    "contactUs": "Contact Us",
    "submit": "Submit",
    "viewAll": "View All"
  }
}
```

```json
// src/locales/ar/common.json
{
  "siteName": "جرش لخدمات حقول النفط",
  "nav": {
    "home": "الرئيسية",
    "services": "الخدمات",
    "hse": "الصحة والسلامة",
    "gallery": "المعرض",
    "contact": "اتصل بنا",
    "careers": "الوظائف"
  },
  "footer": {
    "poBox": "ص.ب. بغداد-10001",
    "copyright": "جميع الحقوق محفوظة.",
    "offices": {
      "basrah": "موقع البصرة",
      "erbil": "مكتب أربيل",
      "baghdad": "مكتب بغداد"
    }
  },
  "actions": {
    "learnMore": "اعرف المزيد",
    "contactUs": "اتصل بنا",
    "submit": "إرسال",
    "viewAll": "عرض الكل"
  }
}
```

### TypeScript Integration

```typescript
// src/types/i18next.d.ts
import 'i18next'
import type common from '../locales/en/common.json'
import type home from '../locales/en/home.json'
import type services from '../locales/en/services.json'
import type hse from '../locales/en/hse.json'
import type gallery from '../locales/en/gallery.json'
import type contact from '../locales/en/contact.json'
import type careers from '../locales/en/careers.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      home: typeof home
      services: typeof services
      hse: typeof hse
      gallery: typeof gallery
      contact: typeof contact
      careers: typeof careers
    }
  }
}
```

---

## Image Asset Organization

### Naming Convention

| Category | Pattern | Example |
|----------|---------|---------|
| Hero | `hero-{nn}-{description}.jpg` | `hero-01-field-operations.jpg` |
| Gallery/Operations | `op-{nn}-{description}.jpg` | `op-01-drilling-rig.jpg` |
| Gallery/Team | `team-{nn}-{description}.jpg` | `team-01-safety-meeting.jpg` |
| Gallery/Facilities | `fac-{nn}-{location}.jpg` | `fac-01-basrah-office.jpg` |
| Logos | `{name}-logo-{variant}.png` | `jerash-logo-color.png` |
| Partners | `{partner}-logo.png` | `slb-logo.png` |

### Image Migration Plan

Current state (26 WhatsApp images with timestamps) needs reorganization:

```bash
# Example renaming (to be done during asset phase)
WhatsApp Image 2026-01-09 at 4.37.32 PM.jpeg -> hero-01-field-operations.jpg
WhatsApp Image 2026-01-09 at 4.37.33 PM.jpeg -> op-01-drilling-site.jpg
# etc.
```

### Image Optimization Strategy

1. **Source images** stay in `src/assets/images/` for import
2. **Build process** optimizes via Vite's asset handling
3. **Large gallery images** can use lazy loading with placeholder blur

```tsx
// Lazy-loaded gallery image
<img
  src={imageSrc}
  alt={imageAlt}
  loading="lazy"
  className="w-full h-auto object-cover"
/>
```

---

## Data Flow

### Static Content Flow (Current Phase)

```
Translation Files (JSON)
        |
        v
useTranslation() hook
        |
        v
Component renders localized text
```

### Future API Integration Flow

```
API Request (TanStack Query)
        |
        v
React Query Cache
        |
        v
Component renders data
        |
        v
Mutations invalidate cache
```

### State Management Boundaries

| State Type | Tool | Persistence | Scope |
|------------|------|-------------|-------|
| Language | i18next | localStorage | Global |
| Theme | Zustand | localStorage | Global |
| UI (modals, menus) | Zustand | None | Global |
| Form data | React Hook Form | None | Component |
| Server data | TanStack Query | Memory | Global |

---

## Build Order (Component Dependencies)

### Phase 1: Foundation (No external deps)

```
1. hooks/useDirection.ts       - RTL detection
2. lib/utils.ts               - cn() helper (exists)
3. animations/variants.ts     - Shared motion variants
4. animations/FadeIn.tsx      - Basic animation wrapper
5. components/ui/*            - shadcn primitives (exists)
```

### Phase 2: Layout Shell

```
Depends on: Phase 1

6. components/layout/Container.tsx    (exists)
7. components/layout/Header.tsx       (enhance with nav)
8. components/layout/Footer.tsx       (enhance with content)
9. components/layout/RootLayout.tsx   (exists)
```

### Phase 3: Sections

```
Depends on: Phase 1, 2

10. components/sections/Hero.tsx
11. components/sections/Vision.tsx
12. components/sections/Mission.tsx
13. components/sections/Values.tsx
14. components/sections/ManagementPhilosophy.tsx
15. components/sections/Partners.tsx
16. components/sections/JointVentures.tsx
```

### Phase 4: Features

```
Depends on: Phase 1, 2

17. components/features/gallery/MasonryGrid.tsx
18. components/features/gallery/ImageModal.tsx
19. components/features/contact/ContactForm.tsx
20. components/features/contact/OfficeCard.tsx
21. components/features/careers/CVForm.tsx
22. components/features/services/ServiceCard.tsx
```

### Phase 5: Pages

```
Depends on: Phase 3, 4

23. routes/pages/Home.tsx       (compose sections)
24. routes/pages/Services.tsx   (service components)
25. routes/pages/HSE.tsx        (dedicated content)
26. routes/pages/Gallery.tsx    (gallery feature)
27. routes/pages/Contact.tsx    (contact feature)
28. routes/pages/Careers.tsx    (careers feature)
```

---

## Animation Architecture

### Global Animation Settings

```tsx
// src/components/providers/index.tsx
import { MotionConfig } from 'motion/react'

export function Providers({ children }: ProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <HelmetProvider>
        {/* ... other providers */}
        {children}
      </HelmetProvider>
    </MotionConfig>
  )
}
```

### Shared Animation Variants

```typescript
// src/components/animations/variants.ts
import type { Variants } from 'motion/react'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// RTL-aware slide variant factory
export const createSlideIn = (isRTL: boolean): Variants => ({
  hidden: { opacity: 0, x: isRTL ? 50 : -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
})
```

### Animation Wrapper Component

```tsx
// src/components/animations/ScrollReveal.tsx
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'

interface ScrollRevealProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export function ScrollReveal({
  children,
  variants = defaultVariants,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

---

## Anti-Patterns to Avoid

### 1. Hardcoded Direction Values

```tsx
// BAD - breaks in RTL
<div className="ml-4 text-left pl-2">

// GOOD - works in both directions
<div className="ms-4 text-start ps-2">
```

### 2. Inline Translation Calls in JSX

```tsx
// BAD - harder to maintain
<h1>{t('pages.home.hero.title')}</h1>
<p>{t('pages.home.hero.subtitle')}</p>

// GOOD - use keyPrefix
const { t } = useTranslation('home', { keyPrefix: 'hero' })
<h1>{t('title')}</h1>
<p>{t('subtitle')}</p>
```

### 3. Mixing Content and Translation Keys

```tsx
// BAD - untranslatable
<button>Click here to {action}</button>

// GOOD - full phrase in translation
<button>{t('actions.clickToAction')}</button>
```

### 4. Forgetting Animation Direction

```tsx
// BAD - slides wrong way in RTL
<motion.div initial={{ x: -100 }} animate={{ x: 0 }}>

// GOOD - direction-aware
const { isRTL } = useDirection()
<motion.div initial={{ x: isRTL ? 100 : -100 }} animate={{ x: 0 }}>
```

### 5. Images Without Alt Text

```tsx
// BAD - accessibility and SEO issue
<img src={heroImage} />

// GOOD - translated alt text
<img src={heroImage} alt={t('hero.imageAlt')} />
```

---

## Scalability Considerations

| Concern | Current (Static) | Future (API) |
|---------|------------------|--------------|
| Content updates | Edit JSON files | CMS/API updates |
| Image gallery | Static imports | API-driven with pagination |
| Contact form | Email service | Backend API |
| CV submission | Email service | Backend + database |
| Partners/JV | Static JSON | Dynamic API |

---

## Sources

**RTL/LTR Best Practices:**
- [Best practices to Implement RTL in React](https://dev.to/neers/best-practices-to-implement-rtl-in-react-js-1ckg)
- [Right to Left in React: The Developer's Guide](https://leancode.co/blog/right-to-left-in-react)
- [RTL websites design and development - Reffine](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices)

**i18n Routing:**
- [React Router i18n Routing Discussion](https://github.com/remix-run/react-router/discussions/10510)
- [How to translate your React Router v7 app - Intlayer](https://intlayer.org/doc/environment/vite-and-react/react-router-v7)
- [Multi-language routing in React - Prototyp](https://prototyp.digital/blog/multi-language-routing-in-react)

**Folder Structure:**
- [React Folder Structure in 5 Steps - Robin Wieruch](https://www.robinwieruch.de/react-folder-structure/)
- [How to Structure and Organize a React Application - Tania Rascia](https://www.taniarascia.com/react-architecture-directory-structure/)
- [Popular React Folder Structures - Profy.dev](https://profy.dev/article/react-folder-structure)

**Asset Organization:**
- [Website File Naming Conventions - Windmill Strategy](https://www.windmillstrategy.com/file-naming-conventions-and-digital-asset-organization-for-web-and-seo/)
- [Image File Management - Casey Templeton](https://caseytempleton.com/blog/image-file-naming-conventions-folder-structure/)

---

*Architecture research: 2026-01-21*
