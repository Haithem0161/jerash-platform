---
phase: 01-foundation-layout
plan: 01
subsystem: i18n
tags:
  - i18n
  - react-i18next
  - framer-motion
  - shadcn
  - dropdown
  - loading-overlay

dependency_graph:
  requires: []
  provides:
    - "dropdown-language-switcher"
    - "loading-overlay-component"
    - "first-visit-hook"
    - "language-fade-transition"
    - "nav-footer-translations"
  affects:
    - "01-02-PLAN.md"
    - "01-03-PLAN.md"

tech_stack:
  added: []
  patterns:
    - "sessionStorage for first-visit tracking"
    - "AnimatePresence for language change fade"
    - "motion.div keyed on i18n.language"

key_files:
  created:
    - src/hooks/useFirstVisit.ts
    - src/components/common/LoadingOverlay.tsx
  modified:
    - src/locales/en/common.json
    - src/locales/ar/common.json
    - src/components/common/LanguageSwitcher.tsx
    - src/components/layout/RootLayout.tsx
    - src/components/common/index.ts
    - src/hooks/index.ts

decisions:
  - key: "language-switcher-style"
    choice: "dropdown-menu"
    reason: "Per CONTEXT.md - more accessible and cleaner UX than toggle buttons"
  - key: "loading-overlay-trigger"
    choice: "sessionStorage-based"
    reason: "Shows once per session, not per page load - better UX"

metrics:
  duration: "2m 10s"
  completed: "2026-01-21"
---

# Phase 01 Plan 01: i18n Enhancement & Loading Overlay Summary

**One-liner:** Dropdown language switcher with Globe icon, expanded nav/footer translations, sessionStorage-based loading overlay with logo animation, and content fade on language change.

## What Was Built

### 1. Expanded Translation Files
Added comprehensive translation keys for navigation and footer in both English and Arabic:
- `nav.*` keys: home, services, hse, gallery, contact, careers
- `footer.*` keys: quickLinks, aboutTitle, aboutText, officesTitle, offices (basrah/erbil/baghdad with name/address/phone/email), poBox, followUs
- `language.*` keys: select, en, ar
- `common.*` additions: menu, loading

### 2. Dropdown Language Switcher
Converted `LanguageSwitcher.tsx` from button toggle to shadcn `DropdownMenu`:
- Globe icon trigger with current language name
- Menu items show "English" and "عربي" (text only, no flags)
- Active language highlighted with accent background
- Positioned with `align="end"` for RTL-aware alignment

### 3. Loading Overlay Component
Created `LoadingOverlay.tsx` with Jerash logo animation:
- Full-screen fixed overlay (z-[100])
- Logo animates: scale 0.8 -> 1.0, opacity 0 -> 1 over 0.6s
- Overlay fades out after 1s delay
- Uses `AnimatePresence` for exit animation

### 4. First Visit Hook
Created `useFirstVisit.ts` for session-based visit tracking:
- Reads/writes `hasVisited` key in sessionStorage
- Returns `{ isFirstVisit, markVisited }`
- SSR-safe with `typeof window` check

### 5. Language Change Fade Transition
Updated `RootLayout.tsx`:
- Wraps main content in `AnimatePresence mode="wait"`
- `motion.main` keyed on `i18n.language`
- 0.2s fade transition on language change

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 1584f20 | feat | Expand i18n translations and convert LanguageSwitcher to dropdown |
| 0a400b7 | feat | Add language change fade transition and loading overlay |

## Verification Results

- [x] `pnpm build` succeeds
- [x] Translation coverage: All nav/footer keys exist in both en/ar JSON files
- [x] DropdownMenu used in LanguageSwitcher
- [x] sessionStorage used in useFirstVisit
- [x] AnimatePresence used in LoadingOverlay
- [x] useFirstVisit hook connected to LoadingOverlay
- [x] LoadingOverlay rendered in RootLayout
- [x] i18n.changeLanguage called on language selection

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Ready for 01-02-PLAN.md (Header & Navigation):
- All nav translation keys in place
- LanguageSwitcher ready for Header integration
- LoadingOverlay rendering correctly
- Language change transition working

No blockers identified.
