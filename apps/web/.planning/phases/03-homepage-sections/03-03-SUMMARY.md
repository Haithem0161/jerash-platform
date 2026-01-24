---
phase: 03-homepage-sections
plan: 03
subsystem: homepage
tags: [animation, counter, i18n, motion, react]

dependency-graph:
  requires: [02-01, 02-02]
  provides: [AnimatedCounter, StatsSection, ManagementSection]
  affects: [03-04, 06]

tech-stack:
  added: []
  patterns:
    - useMotionValue for performant animation
    - useInView with once:true for scroll-triggered effects
    - 60/40 grid layout for content sections

key-files:
  created:
    - src/components/animations/AnimatedCounter.tsx
    - src/components/home/StatsSection.tsx
    - src/components/home/ManagementSection.tsx
  modified:
    - src/components/animations/index.ts
    - src/components/home/index.ts
    - src/locales/en/common.json
    - src/locales/ar/common.json

decisions:
  - counter-pattern: useMotionValue | Avoids React re-renders on every frame
  - trigger-threshold: amount 0.5 | Counter starts when 50% visible
  - stats-values: placeholder | 15+ years, 500+ projects, 200+ employees

metrics:
  duration: 2m 30s
  completed: 2026-01-21
---

# Phase 3 Plan 3: Stats and Management Sections Summary

**One-liner:** Scroll-triggered animated counters using useMotionValue with 60/40 management philosophy section.

## What Changed

### AnimatedCounter Component
Created a reusable scroll-triggered counter component that:
- Uses `useMotionValue` to animate numbers without React re-renders
- Triggers only once when 50% of element is visible via `useInView`
- Supports prefix/suffix for number formatting (e.g., "+" suffix)
- 2 second easeOut animation by default
- Properly cleans up animation controls on unmount

### StatsSection Component
Displays company statistics with animated counters:
- Years of Experience: 15+
- Projects Completed: 500+
- Team Members: 200+
- Uses StaggerContainer for sequential reveal
- Subtle background (`bg-muted/50`) for visual separation

### ManagementSection Component
Leadership philosophy with 60/40 layout:
- Text content on leading side (3 columns)
- Team image on trailing side (2 columns)
- FadeIn animations with directional awareness
- RTL-aware using logical properties

### Translations
Added to both English and Arabic:
- `home.stats.yearsExperience`
- `home.stats.projectsCompleted`
- `home.stats.employees`
- `home.management.title`
- `home.management.content`

## Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Counter pattern | useMotionValue | Avoids React re-renders on every animation frame |
| Trigger threshold | 50% visibility | Balance between early trigger and ensuring visibility |
| Stat values | Placeholder | 15+, 500+, 200+ - update with real data from client |

## Deviations from Plan

None - plan executed exactly as written.

## Files Created/Modified

**Created:**
- `src/components/animations/AnimatedCounter.tsx` - Scroll-triggered counter
- `src/components/home/StatsSection.tsx` - Statistics grid
- `src/components/home/ManagementSection.tsx` - Leadership philosophy

**Modified:**
- `src/components/animations/index.ts` - Added AnimatedCounter export
- `src/components/home/index.ts` - Added section exports
- `src/locales/en/common.json` - Stats and management translations
- `src/locales/ar/common.json` - Arabic translations

## Verification Results

- [x] AnimatedCounter.tsx uses useMotionValue (not setState)
- [x] AnimatedCounter exported from animations/index.ts
- [x] StatsSection shows 3 stats with count-up animation
- [x] ManagementSection displays philosophy with image
- [x] Translations added to both en/common.json and ar/common.json
- [x] Build passes: `pnpm build`
- [x] Lint has pre-existing issues only (useMediaQuery.ts, button.tsx)

## Next Phase Readiness

Ready for Phase 3 Plan 4 (Partners/JointVentures) or Homepage Assembly.

**Prerequisites met:**
- AnimatedCounter available for any future animated numbers
- StatsSection and ManagementSection ready for homepage integration
- All translations in place for AR/EN

**Blockers:**
- Stat values are placeholders - update with real company data when available
