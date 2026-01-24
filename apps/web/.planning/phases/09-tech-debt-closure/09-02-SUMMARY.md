---
phase: 09-tech-debt-closure
plan: 02
subsystem: content
tags: [i18n, translations, hse, contact-info, tech-debt]

# Dependency graph
requires:
  - phase: 05-hse-page
    provides: HSE page structure and SafetyMetrics component
  - phase: 01-foundation
    provides: Footer component and translation files
provides:
  - Verified P.O. Box number (28211) in both languages
  - Documented TODO markers for remaining contact placeholders
  - Clean HSE page without unverified metrics
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@deprecated JSDoc for hidden components pending data"
    - "TODO comments documenting placeholder values"

key-files:
  created: []
  modified:
    - src/locales/en/common.json
    - src/locales/ar/common.json
    - src/components/layout/Footer.tsx
    - src/components/hse/SafetyMetrics.tsx
    - src/routes/pages/HSE.tsx

key-decisions:
  - "P.O. Box confirmed as 28211 from client image"
  - "Contact phones/emails kept as placeholders with TODO comments"
  - "LinkedIn kept as href='#' with TODO comment"
  - "SafetyMetrics removed from HSE page - values not from company profile"

patterns-established:
  - "@deprecated JSDoc: Use for components temporarily hidden pending real data"
  - "TODO comments: Document what real data is needed and where to add it"

# Metrics
duration: 2min
completed: 2026-01-22
---

# Phase 9 Plan 2: Update Placeholder Content Summary

**P.O. Box updated to 28211, SafetyMetrics removed from HSE (unverified data), TODO comments added for remaining placeholders**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-22T21:32:10Z
- **Completed:** 2026-01-22T21:33:48Z
- **Tasks:** 4 (checkpoint + 3 auto tasks)
- **Files modified:** 5

## Accomplishments
- Updated P.O. Box from XXXXX to 28211 (client-verified value) in both English and Arabic translation files
- Added 4 TODO comments in Footer.tsx documenting remaining placeholder values
- Removed SafetyMetrics component from HSE page render (values were fabricated, not from company profile)
- Added @deprecated JSDoc to SafetyMetrics.tsx explaining why it's hidden and how to re-enable

## Task Commits

Each task was committed atomically:

1. **Task 1: Checkpoint decision** - User provided P.O. Box value and decision on placeholders
2. **Tasks 2-3: Update translation files and Footer** - `10a96b2` (fix)
3. **Task 4: Remove SafetyMetrics from HSE** - `a4b15c1` (fix)

## Files Created/Modified
- `src/locales/en/common.json` - P.O. Box updated to 28211
- `src/locales/ar/common.json` - P.O. Box updated to 28211
- `src/components/layout/Footer.tsx` - Added 4 TODO comments for placeholders
- `src/components/hse/SafetyMetrics.tsx` - Added @deprecated JSDoc, preserved for future use
- `src/routes/pages/HSE.tsx` - Removed SafetyMetrics render, added TODO comment

## Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| P.O. Box value | 28211 | Confirmed from client-provided company profile image |
| Phone placeholders | Keep +964 XXX XXX XXXX | Client to provide real numbers |
| Email placeholders | Keep @jerash.com | Domain correct, specific addresses pending |
| LinkedIn URL | Keep href="#" | Company LinkedIn page URL not provided |
| Safety metrics | Remove from render | Values (1M+ hours, 50K+ training, 95% certified) were fabricated in Phase 5, not from company profile |

## Deviations from Plan

None - plan executed with user's checkpoint decision.

## Issues Encountered

None - straightforward execution following user's decision.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Remaining tech debt for 09-03:**
- Fix i18n namespace registration warnings
- Fix jsx-a11y accessibility warnings
- Clean up any remaining linting issues

**Still pending (not Phase 9):**
- Real office phone numbers from client
- Real office email addresses from client
- Company LinkedIn page URL
- Verified safety metrics for SafetyMetrics re-enablement

---
*Phase: 09-tech-debt-closure*
*Completed: 2026-01-22*
