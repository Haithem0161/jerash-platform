---
phase: 03-homepage-sections
plan: 02
subsystem: homepage
tags: [sections, animations, i18n, layout]

dependency_graph:
  requires:
    - 02-01 (FadeIn, StaggerContainer animation components)
    - 01-01 (Container layout component)
  provides:
    - Section wrapper component for consistent spacing
    - VisionSection, MissionSection, ValuesSection components
    - Bilingual translations for corporate identity content
  affects:
    - 03-03 (will use Section wrapper)
    - 03-04 (will use Section wrapper)
    - Future pages (reusable section pattern)

tech_stack:
  added: []
  patterns:
    - 60/40 grid layout with alternating image positions
    - Section wrapper with Container integration
    - Value cards with icon and staggered animation

key_files:
  created:
    - src/components/layout/Section.tsx
    - src/components/home/VisionSection.tsx
    - src/components/home/MissionSection.tsx
    - src/components/home/ValuesSection.tsx
  modified:
    - src/locales/en/common.json
    - src/locales/ar/common.json
    - src/components/home/index.ts

decisions:
  - id: section-spacing
    choice: py-16 md:py-20
    reason: Consistent vertical rhythm across all sections
  - id: grid-layout
    choice: 5-column grid (3+2 split)
    reason: Achieves 60/40 ratio for text-image layout
  - id: values-grid
    choice: 1/2/3 column responsive grid
    reason: Adapts well from mobile to desktop

metrics:
  duration: 2m 46s
  completed: 2026-01-21
---

# Phase 03 Plan 02: Vision/Mission/Values Summary

Section wrapper with consistent spacing, plus Vision, Mission, and Values sections using FadeIn and StaggerContainer animations.

## What Was Built

### Section.tsx Wrapper
- Reusable section component with py-16 md:py-20 spacing
- `fullWidth` prop to bypass Container constraint when needed
- Accepts `id` for anchor navigation

### VisionSection
- 60/40 text-image layout using 5-column grid (3 text, 2 image)
- Text on leading side with FadeIn direction="up"
- Image on trailing side with FadeIn direction="left"
- Uses team photo from WhatsApp images

### MissionSection
- Same 60/40 layout but with positions flipped
- Image on leading side (ordered first on lg)
- Text on trailing side (ordered second on lg)
- Subtle bg-muted/50 background for visual separation

### ValuesSection
- 5 company core values displayed as icon cards
- Icons from lucide-react: Shield, Award, Scale, Users, Lightbulb
- StaggerContainer/StaggerItem for reveal animation
- Responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop
- Cards with hover:border-primary transition

### Translations
- English and Arabic translations for vision, mission content
- 5 value descriptions (safety, excellence, integrity, teamwork, innovation)
- Content sourced from JERASH-PROFILE.md

## Commits

| Hash | Message |
|------|---------|
| 79c8cff | feat(03-02): create Section wrapper and Vision/Mission components |
| aa70bca | feat(03-02): create ValuesSection with icon cards |
| 1c23efd | feat(03-02): add Vision/Mission/Values translations and barrel export |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] Section.tsx exists with fullWidth prop support
- [x] VisionSection, MissionSection, ValuesSection components created
- [x] All components use FadeIn or StaggerContainer animations
- [x] Translations added to both en/common.json and ar/common.json
- [x] Barrel export updated with all new components
- [x] Build passes: `pnpm build`
- [x] Lint: Pre-existing errors only (useMediaQuery.ts, button.tsx - noted in STATE.md)

## Next Phase Readiness

Ready for 03-03 (Stats Section) - Section wrapper pattern established for reuse.
