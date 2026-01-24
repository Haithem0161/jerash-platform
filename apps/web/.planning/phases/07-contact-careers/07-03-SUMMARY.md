---
phase: 07-contact-careers
plan: 03
subsystem: business-relationships
tags: [partners, joint-ventures, pages, i18n]

dependency-graph:
  requires: [01-02, 03-04]
  provides: [partners-page, jv-page, partner-data-structure]
  affects: [08-01]

tech-stack:
  added: []
  patterns: [translation-key-data-pattern, logo-fallback-pattern]

file-tracking:
  key-files:
    created:
      - src/components/partners/data/partners.ts
      - src/components/partners/PartnerCard.tsx
      - src/components/joint-ventures/data/joint-ventures.ts
      - src/components/joint-ventures/JointVentureCard.tsx
      - src/routes/pages/Partners.tsx
      - src/routes/pages/JointVentures.tsx
      - src/locales/en/partners.json
      - src/locales/ar/partners.json
      - public/images/partners/placeholder.txt
    modified:
      - src/routes/index.tsx
      - src/lib/i18n.ts

decisions:
  - key: partner-data-uses-translation-keys
    choice: Translation keys in data, not raw strings
    reason: Ready for CMS/API migration, consistent with i18n pattern
  - key: jv-website-fallback
    choice: "Coming Soon" text when no website
    reason: Better UX than hiding the link area entirely
  - key: grid-layout-expansion-ready
    choice: md:grid-cols-2 lg:grid-cols-3
    reason: Single item centers, scales to 3+ partners naturally

metrics:
  duration: 2m 6s
  completed: 2026-01-22
---

# Phase 07 Plan 03: Partners & Joint Ventures Pages Summary

**One-liner:** Two separate pages at /partners (SLB) and /joint-ventures (Kweti) with translation-key-based data structure ready for expansion.

## What Was Built

### Partner/JV Data Structures
- `Partner` and `JointVenture` TypeScript interfaces with translation key references
- Static data arrays ready for easy extension when adding more partners
- Logo paths point to /images/partners/ directory with placeholder documentation

### Profile Card Components
- `PartnerCard` and `JointVentureCard` with consistent styling
- Logo image with onError fallback to placeholder box
- Company name and description from translation keys
- External website link with new tab behavior (ExternalLink icon)
- JointVenture cards show "Coming Soon" when no website configured
- Hover shadow effect for interactivity feedback

### Pages
- `/partners` route with SLB as featured partner
- `/joint-ventures` route with Kweti as featured JV
- Both use responsive grid (1/2/3 columns) for future expansion
- FadeIn animations on headers and staggered cards
- SEO meta tags via react-helmet-async

### Translations
- New `partners.json` namespace for en/ar
- SEO titles and descriptions for both pages
- Company profiles with name and description
- UI strings: "Visit Website", "Coming Soon"

## Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| Data structure approach | Translation keys in data | Ready for CMS/API migration, consistent i18n pattern |
| Missing website handling | "Coming Soon" text | Better UX than hiding link area |
| Grid columns | md:2, lg:3 | Single item centers, scales naturally |

## Deviations from Plan

None - plan executed exactly as written.

## Test Evidence

```bash
# Build verification
pnpm build  # Success, no TypeScript errors

# File line counts meet minimums
Partners.tsx: 50 lines (min 30)
JointVentures.tsx: 50 lines (min 30)
PartnerCard.tsx: 60 lines (min 25)
JointVentureCard.tsx: 64 lines (min 25)

# Data exports verified
grep "slb" partners.ts  # Match found
grep "kweti" joint-ventures.ts  # Match found
```

## Next Phase Readiness

Ready for:
- 07-04: Contact page forms (if planned)
- 07-05: Careers page with job listings (if planned)
- Adding more partners/JVs by extending data arrays
- Replacing placeholder logos in /images/partners/

Blockers: None
