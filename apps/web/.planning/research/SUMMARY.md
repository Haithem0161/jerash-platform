# Project Research Summary

**Project:** Jerash For Oil Field Services Website
**Domain:** Bilingual Corporate Website (Arabic RTL + English LTR) for Oil & Gas Sector
**Researched:** 2026-01-21
**Confidence:** HIGH

## Executive Summary

This is a bilingual corporate website for an Iraqi oil field services company, requiring full Arabic RTL and English LTR support with "bold, cinematic animations" that differentiate from the industry's typically boring websites. The existing React 19 + Vite + Tailwind + Framer Motion + react-i18next stack is exceptionally well-chosen and covers 90% of requirements. Research confirms only minimal additions are needed: a lightbox for the 26-image gallery (yet-another-react-lightbox), masonry grid layout (react-masonry-css), and file upload for CV submission (react-dropzone).

The recommended approach is a frontend-first build with language-agnostic URLs and client-side language switching. The architecture uses Tailwind v4's built-in logical properties (ms-/me-/ps-/pe-) for RTL support, avoiding the complexity of URL-prefixed language routing. The bilingual i18n system with proper Arabic pluralization (6 forms) and dedicated Arabic fonts must be established as the foundation before any content development.

The key risks are: (1) RTL implementation mistakes, particularly flipping icons that should not flip or using physical CSS properties that break in RTL mode; (2) animation performance issues from animating layout-triggering properties instead of transforms; (3) accessibility failures from missing prefers-reduced-motion support. All three risks are preventable with upfront conventions established in Phase 1. The client's emphasis on HSE (Health, Safety, Environment) as a "crown jewel" feature elevates it from a typical about-page section to a dedicated page requiring rich content and design attention.

## Key Findings

### Recommended Stack

The current stack is production-ready. React 19.2.0 with the compiler, Vite 7.2.5 with Rolldown, TypeScript 5.9.3, Tailwind CSS 4.1.18, Framer Motion 12.24.3, react-i18next 16.5.1, React Router 7.11.0, shadcn/ui 3.6.3, React Query 5.90.16, Zustand 5.0.9, React Hook Form 7.70.0, Zod 4.3.5, and Lucide React are all current versions requiring no upgrades.

**New runtime dependencies (3 total):**
- **yet-another-react-lightbox**: Image gallery lightbox with plugins for thumbnails/zoom/fullscreen, ~15kb core
- **react-masonry-css**: CSS-based masonry grid for gallery layout, ~2kb, zero dependencies
- **react-dropzone**: Drag-and-drop file upload for CV submission, ~10kb, hook-based API

**New shadcn/ui components (2):**
- **sonner**: Toast notifications (official shadcn/ui recommendation)
- **carousel**: Hero slideshow (Embla-based, already in shadcn/ui ecosystem)

**Dev dependencies:**
- **vite-plugin-image-optimizer + sharp**: Build-time WebP/AVIF generation for image optimization

**Do NOT add:** Swiper (use shadcn carousel), react-spring (Framer Motion covers it), tailwindcss-rtl (Tailwind v4 has built-in RTL), react-toastify (use Sonner).

### Expected Features

**Must have (table stakes):**
- Homepage with company overview and hero slideshow
- Bilingual toggle (AR/EN) with full RTL layout support
- Services page with 20+ services organized by category
- HSE dedicated page (elevated from section to "crown jewel")
- Image gallery showcasing 26 field images
- Contact page with 3 office locations (Basrah, Erbil, Baghdad)
- Partners section highlighting SLB partnership
- Mobile responsive design (60% of traffic is mobile)

**Should have (competitive differentiators):**
- Cinematic hero animations with scroll-triggered effects
- Smooth page transitions (competitors lack this entirely)
- Animated statistics/counters (years experience, projects)
- Interactive service cards with hover states
- Scroll-triggered reveal animations
- Joint Ventures section (Kweti)

**Defer (v2+):**
- CV submission with file upload (use mailto: link for MVP, backend later)
- Project case studies (content may not exist)
- Video integration (performance concerns)
- Dark mode (nice-to-have polish)
- Interactive office map (text addresses work for MVP)

### Architecture Approach

The architecture uses language-agnostic URLs (no /en/ or /ar/ prefix) with client-side language switching stored in localStorage. This is simpler than URL-prefixed routing and appropriate for a regional corporate site. The component hierarchy flows from App.tsx (providers) to RootLayout (header/footer) to Page Components to Section/Feature Components to UI Primitives (shadcn/ui).

**Major components:**
1. **RootLayout** - Header, Footer, Outlet wrapper; syncs document direction with i18n language
2. **Page Components** (Home, Services, HSE, Gallery, Contact, Careers) - Route-specific content assembly
3. **Section Components** (Hero, Vision, Mission, Values, Partners, etc.) - Reusable homepage sections
4. **Feature Components** (MasonryGrid, ImageModal, ContactForm, ServiceCard) - Domain-specific UI
5. **Animation Wrappers** (ScrollReveal, FadeIn, SlideIn) - Shared Framer Motion patterns with RTL awareness

**Folder structure:**
- `src/routes/pages/` - Page components with lazy loading
- `src/components/sections/` - Homepage and page sections
- `src/components/features/` - gallery/, contact/, careers/, services/
- `src/locales/en/` and `src/locales/ar/` - Namespace-separated translation files
- `src/hooks/useDirection.ts` - RTL/LTR detection hook

### Critical Pitfalls

1. **Mirror-flip everything for RTL** - Only flip directional icons (chevrons, arrows), NOT universal icons (search, settings, play/pause). Create explicit flip/no-flip decision matrix. Phase 1.

2. **Arabic pluralization hardcoded for English** - Arabic has 6 plural forms (zero, one, two, few, many, other), not 2. All translation files must include all forms. Native Arabic speaker review required. Phase 2.

3. **Animating layout-triggering properties** - Only animate `transform` (x, y, scale, rotate) and `opacity`. Never animate width, height, top, left, margin, padding. Use DevTools Performance panel to verify. Phase 3.

4. **Missing prefers-reduced-motion support** - Wrap app in `<MotionConfig reducedMotion="user">`. Industry (oil & gas) often requires accessibility compliance. Phase 3.

5. **Using physical CSS properties (ml/mr/pl/pr)** - Use logical properties (ms/me/ps/pe) exclusively. Tailwind v4 supports them natively. Establish as team convention from first component. Phase 1.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Layout Shell
**Rationale:** i18n system and RTL support must be established before any content development. Research shows RTL mistakes in foundation cause rewrites later.
**Delivers:** Working bilingual layout with header, footer, navigation, language switcher
**Addresses:** Bilingual toggle, navigation, responsive design, RTL/LTR layout system
**Avoids:** Physical properties pitfall (establish logical properties convention), icon flipping mistakes
**Stack elements:** react-i18next (existing), Tailwind v4 logical properties (existing)

### Phase 2: Translation System & Typography
**Rationale:** Content translation patterns must be established before page development. Arabic font sizing and pluralization rules affect all content.
**Delivers:** Complete translation file structure with all 6 Arabic plural forms, Arabic font integration
**Addresses:** Arabic typography, translation key patterns, Trans component BiDi handling
**Avoids:** Arabic pluralization pitfall, Arabic font too small pitfall, Trans BiDi issues
**Architecture component:** locales/en/*.json and locales/ar/*.json namespace structure

### Phase 3: Animation Framework
**Rationale:** Animation patterns must be established before building animated pages. Performance and accessibility rules apply to all animations.
**Delivers:** Shared animation variants, ScrollReveal wrapper, MotionConfig with reduced motion support
**Addresses:** Scroll-triggered animations, page transitions
**Avoids:** Layout-triggering animation pitfall, missing prefers-reduced-motion pitfall, bundle size bloat
**Stack elements:** Framer Motion (existing), LazyMotion for code splitting

### Phase 4: Homepage & Core Sections
**Rationale:** Homepage is the first impression and most complex page. Section components built here are reused on other pages.
**Delivers:** Complete homepage with hero slideshow, vision, mission, values, partners, service highlights
**Addresses:** Cinematic hero animations, animated statistics, partners section, Joint Ventures
**Uses:** Animation framework from Phase 3, i18n from Phase 1-2

### Phase 5: Content Pages
**Rationale:** With section components and animation patterns established, content pages are straightforward composition.
**Delivers:** Services page, HSE page (crown jewel), About page
**Addresses:** Services listing with 20+ items, HSE dedicated page, leadership showcase
**Architecture component:** Page components composing section and feature components

### Phase 6: Image Gallery
**Rationale:** Gallery requires additional libraries (lightbox, masonry) and image optimization. Isolated complexity.
**Delivers:** Masonry grid gallery with lightbox, lazy loading, optimized images
**Addresses:** 26-image gallery, lightbox navigation
**Avoids:** Gallery without lazy loading pitfall, unoptimized images pitfall
**Stack elements:** yet-another-react-lightbox (new), react-masonry-css (new), vite-plugin-image-optimizer (new)

### Phase 7: Contact & Forms
**Rationale:** Forms require validation patterns and potentially backend integration. Can be frontend-first with mailto: fallback.
**Delivers:** Contact page with office locations, contact form, careers page
**Addresses:** Contact form, 3 office locations, CV submission (initial version)
**Avoids:** File upload validation pitfall (establish patterns even for future backend)

### Phase 8: SEO & Polish
**Rationale:** SEO implementation (hreflang tags, meta translations) should happen after all pages exist. Final polish and testing.
**Delivers:** Complete SEO setup, hreflang tags, Core Web Vitals optimization
**Addresses:** SEO for both languages, page load speed
**Avoids:** Hreflang implementation errors pitfall

### Phase Ordering Rationale

- **Foundation before content:** RTL mistakes in foundation cause rewrites. Research shows 90% of RTL issues are preventable with upfront conventions.
- **Animation framework before animated pages:** Performance and accessibility patterns established once, applied everywhere.
- **Homepage early:** Creates section components reused on other pages; establishes visual language.
- **Gallery isolated:** Additional dependencies (lightbox, masonry) kept separate; image optimization is distinct concern.
- **Forms late:** Can work frontend-first with mailto: links; backend integration is future scope.
- **SEO last:** Requires all pages to exist; systematic implementation across pages.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 6 (Gallery):** Image naming convention for 26 WhatsApp images needs specification; responsive image srcset strategy
- **Phase 7 (Forms):** Backend API design for contact form and CV submission (if not using email service)

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Well-documented in project's I18N.md and TAILWIND.md
- **Phase 3 (Animation):** Well-documented in project's FRAMER-MOTION.md
- **Phase 4-5 (Homepage, Content):** Standard React component composition

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against package.json; all libraries current; minimal additions |
| Features | HIGH | Multiple industry sources; competitor analysis; clear table stakes vs differentiators |
| Architecture | HIGH | Existing codebase matches recommended patterns; documented guides available |
| Pitfalls | HIGH | Verified with Context7, official docs, and multiple reputable sources |

**Overall confidence:** HIGH

### Gaps to Address

- **Image asset migration:** 26 WhatsApp images need renaming and categorization before gallery development. Create naming convention during Phase 6 planning.
- **Arabic content source:** Translations require native Arabic speaker. Confirm translation workflow before Phase 2 begins.
- **Backend scope:** Contact form and CV submission backend deferred. Confirm email service vs API approach during Phase 7 planning.
- **HSE content depth:** Client emphasized HSE as "crown jewel" but content specifics not provided. Gather HSE content requirements during Phase 5 planning.

## Sources

### Primary (HIGH confidence)
- Project reference guides (REACT.md, I18N.md, FRAMER-MOTION.md, TAILWIND.md) - existing codebase documentation
- [yet-another-react-lightbox official docs](https://yet-another-react-lightbox.com/) - library verification
- [react-dropzone official docs](https://react-dropzone.js.org/) - library verification
- [shadcn/ui Sonner docs](https://ui.shadcn.com/docs/components/sonner) - toast implementation
- [Tailwind CSS RTL (Flowbite)](https://flowbite.com/docs/customize/rtl/) - RTL utilities
- [Google Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) - hreflang implementation

### Secondary (MEDIUM confidence)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/) - icon flip guidelines
- [i18next Arabic Pluralization](https://medium.com/swlh/dealing-with-arabic-when-using-i18next-348ed55f7c1a) - Arabic plural forms
- [Framer Motion Performance Tips](https://tillitsdone.com/blogs/framer-motion-performance-tips/) - animation optimization
- [Inclind - Best Oil & Gas Website Designs](https://www.inclind.com/news/best-oil-gas-company-website-designs) - industry benchmarking

### Tertiary (LOW confidence)
- [Arabic Website Font Study (HackerNoon)](https://hackernoon.com/results-font-image-usage-and-performance-trends-across-73-arabic-websites) - font sizing recommendation (validate with native speaker)

---
*Research completed: 2026-01-21*
*Ready for roadmap: yes*
