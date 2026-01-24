---
phase: 08
plan: 01
subsystem: seo
tags: [seo, meta-tags, hreflang, structured-data, json-ld, og-image, i18n]
dependency_graph:
  requires: []
  provides: [seo-component-enhanced, bilingual-meta-tags, organization-schema, og-images]
  affects: [08-02, 08-03]
tech_stack:
  added: []
  patterns: [json-ld-structured-data, hreflang-x-default, og-locale-alternate]
key_files:
  created:
    - src/lib/structured-data.ts
  modified:
    - src/components/common/SEO.tsx
    - src/routes/pages/Home.tsx
    - src/routes/pages/Services.tsx
    - src/routes/pages/HSE.tsx
    - src/routes/pages/Gallery.tsx
    - src/routes/pages/Contact.tsx
    - src/routes/pages/Careers.tsx
    - src/routes/pages/Partners.tsx
    - src/routes/pages/JointVentures.tsx
    - src/locales/en/common.json
    - src/locales/ar/common.json
    - src/locales/en/gallery.json
    - src/locales/ar/gallery.json
    - src/locales/en/contact.json
    - src/locales/ar/contact.json
    - src/locales/en/careers.json
    - src/locales/ar/careers.json
    - src/locales/en/partners.json
    - src/locales/ar/partners.json
decisions:
  - id: hreflang-x-default
    choice: Use hreflang x-default only (no separate /ar/ /en/ tags)
    reason: Single-URL multilingual architecture where language is client-toggled via localStorage
  - id: og-locale-iraq
    choice: Use ar_IQ for Arabic locale instead of ar_SA
    reason: Iraq market targeting as specified in context
metrics:
  duration: ~15 minutes
  completed: 2026-01-22
---

# Phase 8 Plan 1: SEO Meta Tags & Structured Data Summary

Enhanced SEO with hreflang x-default, bilingual meta tags, Organization JSON-LD, and og:image per page.

## What Was Built

### SEO Component Enhancements (src/components/common/SEO.tsx)
- Added `hreflang="x-default"` link tag for single-URL multilingual discovery
- Updated `og:locale` to use `ar_IQ` for Iraq market targeting
- Added `og:locale:alternate` meta tag for language alternatives
- Added `structuredData` prop for JSON-LD injection
- Ensured og:image uses absolute URLs
- Updated default values: SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_IMAGE

### Organization JSON-LD (src/lib/structured-data.ts)
- Created Organization schema with:
  - Company name, URL, logo
  - Basrah address (PO Box 101, IQ)
  - Contact point supporting English and Arabic

### Bilingual SEO Translations
Added SEO-specific translations to common.json for Home, Services, HSE pages:
- English: Professional titles emphasizing Iraq operations and HSE
- Arabic: Culturally adapted (not direct translation) for Iraqi market

Updated existing namespace SEO translations:
- Gallery: Better title/description for field operations
- Contact: Office locations emphasized
- Careers: Industry career focus
- Partners/JointVentures: Strategic alliances messaging

### Page Updates (all 8 pages)
Each page now includes:
- Unique bilingual title and description via translations
- Appropriate og:image for social sharing
- URL prop for canonical/hreflang generation
- Homepage includes Organization structured data

| Page | og:image |
|------|----------|
| Home | /WhatsApp Image 2026-01-09 at 4.37.40 PM.jpeg |
| Services | /images/gallery/jerash-site-01.jpg |
| HSE | /images/hse/hse-hero.jpg |
| Gallery | /images/gallery/jerash-site-05.jpg |
| Contact | /Jerash-logo-color.png |
| Careers | /images/gallery/jerash-site-10.jpg |
| Partners | /images/gallery/jerash-site-15.jpg |
| JointVentures | /images/gallery/jerash-site-20.jpg |

## Commits

| Hash | Message |
|------|---------|
| e1e37ec | feat(08-01): enhance SEO component with hreflang and structured data |
| e295ef7 | feat(08-01): add bilingual SEO translations and og:image to all pages |

## Decisions Made

### Hreflang Implementation for Single-URL Multilingual Site
- **Decision:** Use hreflang x-default only, no separate /ar/ and /en/ URLs
- **Context:** This site serves both Arabic and English from the same URLs (language toggled client-side via localStorage)
- **Rationale:** Google recommends x-default for universal URLs; separate hreflang tags require server-side rendering or URL-based routing which this SPA doesn't have
- **Alternative considered:** Adding /en/ and /ar/ route prefixes would require significant routing changes

### og:locale for Iraq Market
- **Decision:** Use ar_IQ instead of ar_SA
- **Context:** Site primarily serves Iraqi oil industry
- **Rationale:** More accurate regional targeting for search engines and social platforms

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- [x] Build succeeds: `pnpm build` passes
- [x] SEO component includes hreflang x-default tag
- [x] SEO component supports structuredData prop
- [x] Homepage includes Organization JSON-LD
- [x] All 8 pages have og:image props
- [x] og:locale shows ar_IQ for Arabic, en_US for English
- [x] TypeScript compiles without errors

## Next Phase Readiness

Ready for 08-02 (Performance) and 08-03 (Accessibility) plans.

**Blockers:** None
**Concerns:** None
