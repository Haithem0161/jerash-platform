---
phase: 04-services-page
plan: 01
subsystem: ui
tags: [i18n, services, lucide-react, data-model]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: i18n infrastructure with namespace loading
provides:
  - Service and ServiceCategory TypeScript types
  - Complete service data array with 26 services
  - English translations for all services (title, shortDescription, description)
  - Arabic translations for all services (title, shortDescription, description)
  - Category filter labels in both languages
affects: [04-02-services-ui, services page components]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Data file pattern with typed exports (src/data/services.ts)
    - Service translation structure (items.{id}.title/shortDescription/description)

key-files:
  created:
    - src/data/services.ts
    - src/locales/en/services.json
    - src/locales/ar/services.json
  modified:
    - src/lib/i18n.ts

key-decisions:
  - "Service IDs use camelCase matching translation keys"
  - "Arabic translations include transliterated English for technical terms"
  - "shortDescription field added for card previews (under 100 chars)"

patterns-established:
  - "Service data pattern: { id, category, icon } with translations in separate namespace"
  - "Category structure: production (8), wireline (7), consultancy (8), other (3)"

# Metrics
duration: 5min
completed: 2026-01-21
---

# Phase 4 Plan 01: Services Data & Translations Summary

**Type-safe service data model with 26 services across 4 categories, complete English and Arabic translations with professional oil industry terminology**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-21T12:55:36Z
- **Completed:** 2026-01-21T13:00:12Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created Service and ServiceCategory TypeScript types with Lucide icon mapping
- Defined all 26 services from company profile with correct categorization
- Complete English translations with full descriptions from JERASH-PROFILE.md
- Complete Arabic translations with professional oil industry terminology
- Added services namespace to i18n configuration

## Task Commits

Each task was committed atomically:

1. **Task 1: Create service data structure** - `af9905b` (feat)
2. **Task 2: Create English service translations** - `1616d9f` (feat)
3. **Task 3: Create Arabic service translations and update i18n** - `2edd9ac` (feat)

## Files Created/Modified

- `src/data/services.ts` - Service types, data array with 26 services, category helpers
- `src/locales/en/services.json` - Complete English translations for all services
- `src/locales/ar/services.json` - Complete Arabic translations for all services
- `src/lib/i18n.ts` - Added services to ns array for preloading

## Decisions Made

- **Service IDs:** Used camelCase matching translation keys (e.g., `coiledTubing` -> `items.coiledTubing.title`)
- **Arabic technical terms:** Included transliterated English in parentheses for clarity (e.g., "Coiled Tubing" as part of Arabic title)
- **shortDescription field:** Added for card preview UI (under 100 characters each)
- **Icon mapping:** Each service mapped to semantically appropriate Lucide icon

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Service data ready for UI consumption via `import { services } from '@/data/services'`
- Translations loadable via `useTranslation('services')`
- Category filtering available via `getServicesByCategory()`
- Ready for 04-02 (Services page UI components)

---
*Phase: 04-services-page*
*Completed: 2026-01-21*
