---
phase: 07-contact-careers
plan: 02
subsystem: ui
tags: [react-dropzone, zod, react-hook-form, careers, file-upload]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: animation components, layout components, i18n setup
  - phase: 07-01
    provides: Contact page patterns, form component patterns
provides:
  - Careers page with job listings and CV upload
  - react-dropzone file upload pattern
  - Zod schema for multi-layer file validation
  - Job data structure for future CMS integration
affects: [admin-dashboard, job-management]

# Tech tracking
tech-stack:
  added: [react-dropzone]
  patterns: [dropzone-hook-form integration, file validation with MIME+extension+size]

key-files:
  created:
    - src/routes/pages/Careers.tsx
    - src/components/careers/CVUploadForm.tsx
    - src/components/careers/JobCard.tsx
    - src/components/careers/JobDetailModal.tsx
    - src/components/careers/JobListings.tsx
    - src/components/careers/schemas/cv-upload-schema.ts
    - src/components/careers/data/jobs.ts
    - src/locales/en/careers.json
    - src/locales/ar/careers.json
  modified:
    - src/routes/index.tsx

key-decisions:
  - "CVDropzone extracted as separate component to satisfy React hooks rules"
  - "Multi-layer file validation: MIME type + extension + size checks"
  - "5 static jobs covering Engineering, HSE, Operations, Finance, Technical Services"
  - "Translation keys in Zod schema for bilingual validation messages"

patterns-established:
  - "File upload: useDropzone in separate component, pass file via props to form"
  - "Zod file validation: instanceof(File) with refine() for type/size/extension"

# Metrics
duration: 7min
completed: 2026-01-22
---

# Phase 7 Plan 2: Careers Page Summary

**Careers page with job listings grid, job detail modal, and CV upload form using react-dropzone with multi-layer Zod file validation**

## Performance

- **Duration:** 7 min
- **Started:** 2026-01-22T18:43:59Z
- **Completed:** 2026-01-22T18:50:30Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Job listings grid with 5 static positions (Engineering, HSE, Operations, Finance, Technical)
- Job detail modal with full description and Apply button that scrolls to CV form
- CV upload form with drag-and-drop dropzone supporting PDF, Word, and images
- Multi-layer file validation (MIME type, extension, size limit 10MB)
- Bilingual support with Arabic/English translations for all content

## Task Commits

Each task was committed atomically:

1. **Task 1: Install react-dropzone and create CV upload schema with job data** - `2d1ddd7` (feat)
2. **Task 2: Create CVUploadForm, JobCard, JobDetailModal, JobListings, and Careers page** - `5709a95` (feat)
3. **Fix: Extract CVDropzone component** - `de1c743` (fix)

## Files Created/Modified
- `src/routes/pages/Careers.tsx` - Careers page with SEO and responsive layout
- `src/components/careers/CVUploadForm.tsx` - CV submission form with dropzone
- `src/components/careers/JobCard.tsx` - Individual job card component
- `src/components/careers/JobDetailModal.tsx` - Job detail modal with Apply button
- `src/components/careers/JobListings.tsx` - Job cards grid with stagger animation
- `src/components/careers/schemas/cv-upload-schema.ts` - Zod schema for file validation
- `src/components/careers/data/jobs.ts` - Static job data with translation keys
- `src/locales/en/careers.json` - English translations
- `src/locales/ar/careers.json` - Arabic translations
- `src/routes/index.tsx` - Added /careers route

## Decisions Made
- **CVDropzone extraction:** React hooks rules require useDropzone to be called in a component, not inside Controller render callback. Extracted to separate CVDropzone component.
- **File validation approach:** Multi-layer validation (MIME type + extension + size) provides defense in depth against MIME spoofing.
- **Job data structure:** Translation keys instead of inline text allows bilingual support and future CMS integration.
- **Apply button behavior:** Closes modal and scrolls to CV form per CONTEXT.md specification.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed useDropzone called inside render callback**
- **Found during:** Task 2 verification (lint check)
- **Issue:** ESLint rules-of-hooks error: useDropzone cannot be called inside Controller render callback
- **Fix:** Extracted CVDropzone as separate component, passing file via props
- **Files modified:** src/components/careers/CVUploadForm.tsx
- **Verification:** Build and lint pass
- **Committed in:** de1c743 (separate fix commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for React hooks rules compliance. No scope creep.

## Issues Encountered
None - plan executed with one bug fix for hooks rules.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Careers page functional at /careers route
- CV form simulates submission (logs to console)
- Ready for backend integration when SMTP/API is implemented
- Job data structured for future CMS/database migration

---
*Phase: 07-contact-careers*
*Completed: 2026-01-22*
