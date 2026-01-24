---
phase: 05-hse-page
plan: 01
subsystem: ui
tags: [react, i18n, framer-motion, tailwind, hse, bilingual, animations]

# Dependency graph
requires:
  - phase: 02-animation-framework
    provides: StaggerContainer, StaggerItem animation components
  - phase: 01-foundation
    provides: i18n configuration, Section and Container layout components
provides:
  - HSE page foundation with bilingual content (Arabic/English)
  - Full-screen hero section with gradient overlay pattern
  - Numbered commitment list with stagger animation
  - /hse route accessible
affects: [05-02-hse-page, gallery, visual-design]

# Tech tracking
tech-stack:
  added: []
  patterns: [full-screen hero with gradient overlay, numbered list UI, bilingual HSE content]

key-files:
  created:
    - src/locales/en/hse.json
    - src/locales/ar/hse.json
    - src/routes/pages/HSE.tsx
    - src/components/hse/HSEHero.tsx
    - src/components/hse/CommitmentList.tsx
  modified:
    - src/lib/i18n.ts
    - src/routes/index.tsx

key-decisions:
  - "HSE namespace added to i18n configuration"
  - "Single Shield icon for commitment section (not per-point icons)"
  - "Numbered list uses subtle muted numbers focusing on text content"

patterns-established:
  - "Full-screen hero: h-screen with bg-gradient overlay for text readability"
  - "Numbered list: padded numbers (01-10) with text-muted-foreground/50 for subtlety"
  - "Commitment points use StaggerContainer for sequential reveal animation"

# Metrics
duration: 1m 50s
completed: 2026-01-21
---

# Phase 05 Plan 01: HSE Page Foundation Summary

**HSE page with bilingual content, full-screen hero with gradient overlay, and 10 numbered commitment points using stagger animation**

## Performance

- **Duration:** 1m 50s
- **Started:** 2026-01-21T18:03:07Z
- **Completed:** 2026-01-21T18:04:57Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- HSE page accessible at /hse route with SEO support
- Full-screen hero section with dramatic gradient overlay (WCAG 4.5:1 contrast)
- All 10 HSE commitment points displayed in numbered list format
- Bilingual content (English and Arabic) with RTL support
- Staggered reveal animation for commitment points on scroll

## Task Commits

Each task was committed atomically:

1. **Task 1: Create HSE i18n translation files** - `9eeb205` (feat)
   - English HSE translations (hero, 10 commitments, metrics)
   - Arabic HSE translations with RTL support
   - Added 'hse' namespace to i18n configuration

2. **Tasks 2 & 3: Create HSE page with hero and commitments** - `6270417` (feat)
   - HSE page component with SEO
   - Full-screen hero with gradient overlay
   - CommitmentList with numbered points and stagger animation
   - /hse route added to router

**Plan metadata:** Pending (will be committed with STATE.md update)

## Files Created/Modified

Created:
- `src/locales/en/hse.json` - English HSE content (hero, commitments, metrics)
- `src/locales/ar/hse.json` - Arabic HSE content with RTL translations
- `src/routes/pages/HSE.tsx` - HSE page component with SEO
- `src/components/hse/HSEHero.tsx` - Full-screen hero with gradient overlay
- `src/components/hse/CommitmentList.tsx` - Numbered commitment list with stagger animation

Modified:
- `src/lib/i18n.ts` - Added 'hse' namespace to i18n config
- `src/routes/index.tsx` - Added /hse route

## Decisions Made

**1. Single Shield icon for commitment section**
- Used one Shield icon at section header instead of per-point icons
- Follows CONTEXT.md decision: "Single HSE icon for the whole section, not per-point icons"
- Keeps visual focus on text content

**2. Subtle numbered bullets**
- Used `text-muted-foreground/50` for number opacity
- Numbers padded to 2 digits (01-10) with `tabular-nums` for alignment
- Follows CONTEXT.md decision: "Subtle numbered bullets — focus on text content, not large accent numbers"

**3. Gradient overlay pattern**
- Used `bg-gradient-to-b from-black/60 via-black/40 to-black/60` for text readability
- Ensures WCAG 4.5:1 contrast ratio over background image
- Follows RESEARCH.md best practice for hero sections

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**1. Dependencies not installed**
- **Issue:** pnpm build failed with "node_modules missing"
- **Resolution:** Ran `pnpm install` to install dependencies
- **Impact:** No impact on plan execution, standard development setup

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Plan 05-02 (HSE Page Enhancements):
- HSE page structure complete with hero and commitment list
- Bilingual content layer established
- Animation components (StaggerContainer) working
- Route accessible at /hse

**Ready for additions:**
- Field images with parallax scroll effect
- Safety metrics with animated counters
- Additional visual enhancements

**Note:** Background image placeholder (`/images/hse-hero.jpg`) will need actual HSE field image in Plan 05-02.

---
*Phase: 05-hse-page*
*Completed: 2026-01-21*
