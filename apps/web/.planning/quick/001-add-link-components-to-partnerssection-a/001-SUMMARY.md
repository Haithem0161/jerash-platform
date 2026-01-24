---
phase: quick
plan: 001
subsystem: ui
tags: [react-router, i18n, navigation, homepage]

# Dependency graph
requires:
  - phase: 07-content
    provides: Partners and Joint Ventures pages exist
provides:
  - View All links from homepage sections to detail pages
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [ServicesPreview link pattern reused]

key-files:
  created: []
  modified:
    - src/components/home/PartnersSection.tsx
    - src/components/home/JointVenturesSection.tsx
    - src/locales/en/common.json
    - src/locales/ar/common.json

key-decisions:
  - "Follow ServicesPreview pattern exactly for consistency"

patterns-established:
  - "Homepage preview sections include View All links with RTL-aware arrows"

# Metrics
duration: 2min
completed: 2026-01-23
---

# Quick Task 001: Add Link Components to Homepage Sections Summary

**Added View All navigation links to PartnersSection and JointVenturesSection following ServicesPreview pattern with RTL arrow rotation**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-23T12:00:00Z
- **Completed:** 2026-01-23T12:02:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Added bilingual translation keys for "View All Partners" and "View All Joint Ventures"
- PartnersSection now links to /partners page
- JointVenturesSection now links to /joint-ventures page
- Arrow icons respect RTL direction (rotate-180 in Arabic)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add translation keys for View All links** - `f83a330` (feat)
2. **Task 2: Add Link component to PartnersSection** - `4176f7b` (feat)
3. **Task 3: Add Link component to JointVenturesSection** - `fa61516` (feat)

## Files Created/Modified
- `src/locales/en/common.json` - Added home.partners.seeAll and home.jointVentures.seeAll keys
- `src/locales/ar/common.json` - Added Arabic translations for seeAll keys
- `src/components/home/PartnersSection.tsx` - Added Link, ArrowRight, RTL detection, View All link
- `src/components/home/JointVenturesSection.tsx` - Added Link, ArrowRight, RTL detection, View All link

## Decisions Made
- Follow ServicesPreview pattern exactly for consistency across homepage sections
- Use react-router Link (not react-router-dom) per codebase convention
- Arrow icon rotates 180 degrees in RTL mode using cn utility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - pre-existing lint warnings unrelated to this task.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Homepage sections now fully connected to detail pages
- Integration gap from milestone audit resolved

---
*Quick Task: 001*
*Completed: 2026-01-23*
