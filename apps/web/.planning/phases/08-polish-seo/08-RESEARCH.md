# Phase 8: Polish & SEO - Research

**Researched:** 2026-01-22
**Domain:** SEO, Performance Optimization, Accessibility, Image Optimization
**Confidence:** HIGH

## Summary

This phase focuses on making the Jerash oil field services website production-ready through SEO optimization, performance tuning, and accessibility compliance. The existing codebase already has a solid foundation with react-helmet-async for meta tags, react-i18next for bilingual support, and Tailwind CSS for styling.

The research identified standard approaches for all key requirements: hreflang implementation for Arabic/English SEO, vite-imagetools for build-time image optimization (AVIF/WebP/JPEG fallback chain), web-vitals library for Core Web Vitals monitoring, @tanstack/react-virtual for gallery virtualization, and vite-plugin-pwa for service worker caching. WCAG 2.2 AA compliance requires specific focus indicator styling, skip links, and color contrast verification.

**Primary recommendation:** Enhance the existing SEO component with hreflang support, add image optimization pipeline with vite-imagetools, implement gallery virtualization with @tanstack/react-virtual, and add automated accessibility testing with eslint-plugin-jsx-a11y.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-imagetools | ^7.0.0 | Build-time image optimization | Generates AVIF/WebP/JPEG variants with srcset at build time |
| web-vitals | ^4.0.0 | Core Web Vitals measurement | Google's official library for measuring LCP, CLS, INP |
| @tanstack/react-virtual | ^3.13.0 | Virtual scrolling | Headless virtualizer for gallery (26 images), 60fps rendering |
| vite-plugin-pwa | ^0.21.0 | Service worker generation | Workbox-based PWA with static asset caching |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| eslint-plugin-jsx-a11y | ^6.10.0 | Static accessibility linting | Catches accessibility issues in JSX during development |
| critters | ^0.0.25 | Critical CSS inlining | Optional - evaluate if CSS is render-blocking bottleneck |
| sharp | ^0.33.0 | Image processing | Used by vite-imagetools under the hood |

### Already Installed (Leverage Existing)
| Library | Current Version | Purpose | Notes |
|---------|---------|---------|-------|
| react-helmet-async | ^2.0.5 | Meta tags & SEO | Already configured with HelmetProvider |
| react-i18next | ^16.5.1 | Bilingual support | AR/EN translations in place |
| yet-another-react-lightbox | ^3.28.0 | Gallery lightbox | Code-split candidate |
| react-dropzone | ^14.3.8 | CV upload | Code-split candidate |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vite-imagetools | vite-plugin-image-presets | image-presets has simpler API but less flexibility |
| @tanstack/react-virtual | react-virtualized | react-virtualized is larger (37KB vs 10KB), older API |
| vite-plugin-pwa | Manual service worker | PWA plugin handles Workbox config automatically |

**Installation:**
```bash
pnpm add vite-imagetools web-vitals @tanstack/react-virtual vite-plugin-pwa
pnpm add -D eslint-plugin-jsx-a11y
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    common/
      SEO.tsx              # Enhanced with hreflang
      SkipLinks.tsx        # NEW: Skip navigation links
      WebVitals.tsx        # NEW: Web Vitals reporter
    gallery/
      VirtualizedGallery.tsx  # NEW: Replace masonry with virtual
      GalleryImage.tsx        # Enhanced with picture element
  hooks/
    useWebVitals.ts        # NEW: Web Vitals hook
  lib/
    structured-data.ts     # NEW: JSON-LD generators
public/
  images/
    gallery/               # Original images (processed at build)
    og/                    # Open Graph images per page
```

### Pattern 1: Enhanced SEO Component with Hreflang
**What:** Bi-directional hreflang tags for Arabic/English SEO
**When to use:** Every page that has both language versions
**Example:**
```typescript
// Source: Google Search Central documentation
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title: string
  description: string
  url: string
  image?: string
}

const BASE_URL = 'https://jerash.com'

export function SEO({ title, description, url, image }: SEOProps) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  return (
    <Helmet>
      {/* Basic meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE_URL}/${currentLang}${url}`} />

      {/* Hreflang - MUST be bi-directional */}
      <link rel="alternate" hreflang="en" href={`${BASE_URL}/en${url}`} />
      <link rel="alternate" hreflang="ar" href={`${BASE_URL}/ar${url}`} />
      <link rel="alternate" hreflang="x-default" href={`${BASE_URL}/en${url}`} />

      {/* Open Graph locale */}
      <meta property="og:locale" content={currentLang === 'ar' ? 'ar_SA' : 'en_US'} />
      <meta property="og:locale:alternate" content={currentLang === 'ar' ? 'en_US' : 'ar_SA'} />
    </Helmet>
  )
}
```

### Pattern 2: Image Optimization with vite-imagetools
**What:** Build-time generation of AVIF/WebP/JPEG variants with srcset
**When to use:** All images, especially gallery and hero images
**Example:**
```typescript
// vite.config.ts
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: new URLSearchParams({
        format: 'avif;webp;jpg',
        w: '640;768;1024;1280',
        quality: '75',
      }),
    }),
  ],
})

// Component usage
// Source: vite-imagetools documentation
import heroAvif from '@/assets/hero.jpg?w=1280&format=avif&as=srcset'
import heroWebp from '@/assets/hero.jpg?w=1280&format=webp&as=srcset'
import heroJpg from '@/assets/hero.jpg?w=1280'

function HeroImage() {
  return (
    <picture>
      <source type="image/avif" srcSet={heroAvif} />
      <source type="image/webp" srcSet={heroWebp} />
      <img src={heroJpg} alt="Hero" fetchpriority="high" />
    </picture>
  )
}
```

### Pattern 3: Virtual Gallery with @tanstack/react-virtual
**What:** Virtualized masonry grid for 26+ images
**When to use:** Gallery page to reduce DOM nodes
**Example:**
```typescript
// Source: TanStack Virtual documentation
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

function VirtualizedGallery({ images }: { images: GalleryImage[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: images.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Estimated row height
    overscan: 5, // Render 5 extra items outside viewport
  })

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <GalleryImage image={images[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Pattern 4: Web Vitals Reporting
**What:** Client-side measurement of Core Web Vitals
**When to use:** Production builds to collect real user metrics
**Example:**
```typescript
// Source: web-vitals GitHub repository
import { onCLS, onINP, onLCP } from 'web-vitals'

function reportWebVitals() {
  // Only report in production
  if (import.meta.env.PROD) {
    const sendToAnalytics = (metric: { name: string; value: number }) => {
      // Send to your analytics endpoint
      navigator.sendBeacon('/api/vitals', JSON.stringify(metric))
    }

    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)
  }
}
```

### Pattern 5: Skip Links for Accessibility
**What:** Hidden links that become visible on focus for keyboard navigation
**When to use:** At the top of every page layout
**Example:**
```typescript
// Source: WCAG 2.2 guidelines
function SkipLinks() {
  return (
    <div className="absolute left-0 top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-ring"
      >
        Skip to navigation
      </a>
    </div>
  )
}
```

### Pattern 6: JSON-LD Structured Data
**What:** Schema.org markup for organization and services
**When to use:** Homepage for Organization, service pages for Service schema
**Example:**
```typescript
// Source: Google Search Central documentation
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Jerash For Oil Field Services',
  url: 'https://jerash.com',
  logo: 'https://jerash.com/logo.png',
  description: 'Excellence in oil field solutions with an unwavering commitment to safety',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Basrah',
    addressCountry: 'IQ',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+964-XXX-XXX-XXXX',
    contactType: 'customer service',
    availableLanguage: ['English', 'Arabic'],
  },
  sameAs: [
    'https://linkedin.com/company/jerash',
  ],
}
```

### Anti-Patterns to Avoid
- **Auto-redirecting based on IP/browser language:** Googlebot may not crawl all versions; use language switcher instead
- **Lazy loading above-fold images:** Hero images must load immediately with fetchpriority="high"
- **Removing focus outlines:** Never use `outline: none` without providing an accessible alternative
- **Single-direction hreflang:** Both language versions MUST link to each other (bi-directional)
- **Mixing hreflang and canonical incorrectly:** Canonical points to best version of same content, hreflang points to language alternatives

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image format conversion | Manual sharp scripts | vite-imagetools | Handles AVIF/WebP generation, srcset, caching |
| Virtual scrolling | Custom intersection observer | @tanstack/react-virtual | Handles scroll math, size estimation, overscan |
| Service worker | Manual cache API | vite-plugin-pwa + Workbox | Handles precaching, versioning, cache cleanup |
| Web Vitals measurement | Performance API directly | web-vitals library | Handles all edge cases, CLS accumulation, INP calculation |
| Accessibility testing | Manual DOM inspection | eslint-plugin-jsx-a11y + axe-core | Catches 30-50% of WCAG issues automatically |
| hreflang generation | String concatenation | SEO component pattern | Easy to miss bi-directional requirement |

**Key insight:** All these domains have subtle edge cases that are easy to get wrong. Using established tools means inheriting years of bug fixes and standards compliance.

## Common Pitfalls

### Pitfall 1: Non-reciprocal Hreflang Tags
**What goes wrong:** Search engines ignore hreflang if pages don't link back to each other
**Why it happens:** Only adding hreflang to one language version, forgetting x-default
**How to avoid:** Generate hreflang tags in a single SEO component that always outputs all variants
**Warning signs:** Google Search Console shows hreflang errors, pages indexed in wrong language

### Pitfall 2: Lazy Loading LCP Images
**What goes wrong:** Largest Contentful Paint delayed by 1-3 seconds
**Why it happens:** Using `loading="lazy"` on hero images that are above the fold
**How to avoid:** Hero images: `fetchpriority="high"`, no lazy loading; Gallery: `loading="lazy"` only
**Warning signs:** LCP > 2.5s in Lighthouse, "LCP image was lazily loaded" warning

### Pitfall 3: AVIF First in Picture Sources
**What goes wrong:** Some browsers (Safari) may download AVIF but not display it properly
**Why it happens:** AVIF is newest format, put first assuming newest = best
**How to avoid:** Order sources by browser support maturity: AVIF, WebP, JPEG
**Warning signs:** Images not displaying in Safari, slow decode times in Brave

### Pitfall 4: Focus Indicators Removed or Invisible
**What goes wrong:** WCAG 2.2 AA failure, keyboard users cannot see where they are
**Why it happens:** Using `outline: none` without replacement, low contrast focus rings
**How to avoid:** Use `focus-visible:ring-2` with 3:1 contrast ratio minimum
**Warning signs:** axe-core reports focus indicator issues, manual tab-through test fails

### Pitfall 5: Missing Skip Links
**What goes wrong:** Screen reader users must tab through entire header on every page
**Why it happens:** Skip links forgotten or only partially implemented
**How to avoid:** Add SkipLinks component to RootLayout, before Header
**Warning signs:** WAVE tool reports missing skip link, keyboard navigation tedious

### Pitfall 6: Service Worker Caches Wrong Files
**What goes wrong:** Old CSS/JS served after deployment, or images not cached
**Why it happens:** globPatterns only includes `**/*.{js,css,html}` by default
**How to avoid:** Explicitly configure `globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,avif}']`
**Warning signs:** Browser shows old content after deployment, images fail offline

### Pitfall 7: Web Vitals Reported Multiple Times
**What goes wrong:** Memory leak, inflated metrics in analytics
**Why it happens:** Calling onCLS/onINP/onLCP more than once per page load
**How to avoid:** Initialize web-vitals once in main.tsx, never in components
**Warning signs:** Duplicate metric events in analytics, performance degrades over time

## Code Examples

Verified patterns from official sources:

### Service Worker Configuration (vite-plugin-pwa)
```typescript
// vite.config.ts
// Source: vite-pwa-org.netlify.app documentation
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,avif,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
})
```

### Code Splitting Heavy Components
```typescript
// routes/index.tsx
// Source: React documentation on React.lazy
import { lazy, Suspense } from 'react'

// Eager load critical pages
import { HomePage } from './pages/Home'
import { ServicesPage } from './pages/Services'

// Lazy load heavy components
const GalleryPage = lazy(() => import('./pages/Gallery'))
const ContactPage = lazy(() => import('./pages/Contact'))
const CareersPage = lazy(() => import('./pages/Careers'))

// Usage with Suspense
<Suspense fallback={<LoadingOverlay />}>
  <GalleryPage />
</Suspense>
```

### Image Preload for Hero
```typescript
// In SEO component or page head
// Source: web.dev preload documentation
<Helmet>
  <link
    rel="preload"
    as="image"
    href="/images/hero-1.webp"
    fetchpriority="high"
    imagesrcset="/images/hero-1-640.webp 640w, /images/hero-1-1024.webp 1024w, /images/hero-1-1280.webp 1280w"
    imagesizes="100vw"
  />
  {/* Preload second hero image for slideshow */}
  <link
    rel="preload"
    as="image"
    href="/images/hero-2.webp"
  />
</Helmet>
```

### Accessible Focus Styles with Tailwind
```css
/* In Tailwind config or App.css */
/* Source: WCAG 2.2 Focus Appearance guidelines */
@layer base {
  /* 2px solid outline with 3:1+ contrast */
  *:focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
  }

  /* Ensure focus is visible over any background */
  .dark *:focus-visible {
    @apply ring-offset-background;
  }
}
```

### ESLint Accessibility Configuration
```javascript
// eslint.config.js
// Source: eslint-plugin-jsx-a11y documentation
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // Strict rules for production
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
    },
  },
]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FID (First Input Delay) | INP (Interaction to Next Paint) | March 2024 | INP measures ALL interactions, not just first |
| WCAG 2.1 | WCAG 2.2 | October 2023 | New focus appearance requirements (2.4.11, 2.4.13) |
| react-helmet | react-helmet-async | 2020+ | Thread-safe, no memory leaks with SSR |
| Manual srcset | vite-imagetools | 2023+ | Build-time generation, automatic optimization |
| react-virtualized | @tanstack/react-virtual | 2022+ | Smaller (10KB vs 37KB), headless, better DX |

**Deprecated/outdated:**
- **react-helmet:** Memory leaks with async rendering, use react-helmet-async
- **FID metric:** Replaced by INP in Core Web Vitals March 2024
- **JPEG-only images:** Modern browsers support AVIF (90%+) and WebP (97%+)
- **WCAG 2.0:** Use WCAG 2.2 for latest focus and mobile requirements

## Open Questions

Things that couldn't be fully resolved:

1. **Critical CSS necessity**
   - What we know: Tailwind CSS is usually small after purging; Vite handles CSS chunking well
   - What's unclear: Whether CSS is actually a render-blocking bottleneck for this site
   - Recommendation: Measure first with Lighthouse, only implement critters if CSS > 14KB blocking

2. **Gallery virtualization vs masonry**
   - What we know: TanStack Virtual provides row/column virtualization, masonry needs special handling
   - What's unclear: Whether masonry layout can be maintained with virtualization
   - Recommendation: Consider switching to grid layout for virtualization, or use windowed masonry approach

3. **URL structure for hreflang**
   - What we know: Site currently has no language prefix in URLs (e.g., `/services` not `/en/services`)
   - What's unclear: Whether to add language prefixes or use query params
   - Recommendation: Add language prefix routing (`/en/`, `/ar/`) for cleaner hreflang implementation

## Sources

### Primary (HIGH confidence)
- [Google Search Central - Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) - hreflang requirements
- [Google Search Central - Organization Schema](https://developers.google.com/search/docs/appearance/structured-data/organization) - JSON-LD structured data
- [web.dev - Core Web Vitals](https://web.dev/articles/vitals) - LCP, CLS, INP thresholds
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility requirements
- [TanStack Virtual documentation](https://tanstack.com/virtual/latest) - Virtualization patterns

### Secondary (MEDIUM confidence)
- [vite-imagetools GitHub](https://github.com/JonasKruckenberg/imagetools) - Image optimization directives
- [vite-plugin-pwa documentation](https://vite-pwa-org.netlify.app/) - Service worker configuration
- [web-vitals npm](https://www.npmjs.com/package/web-vitals) - Measurement API

### Tertiary (LOW confidence)
- WebSearch results for critical CSS with Vite - may need validation
- WebSearch results for gallery virtualization patterns - implementation-specific

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries are well-documented with official sources
- Architecture: HIGH - Patterns verified against official documentation
- Pitfalls: HIGH - Based on official best practices and documented issues
- Critical CSS: LOW - Needs measurement before implementation decision

**Research date:** 2026-01-22
**Valid until:** 2026-02-22 (30 days - stable domain)
