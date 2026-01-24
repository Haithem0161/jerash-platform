---
phase: 05-hse-page
plan: 02
subsystem: ui
tags: [react, framer-motion, parallax, animations, hse, counters]

# Dependency graph
requires:
  - phase: 05-hse-page
    plan: 01
    provides: HSE page foundation with hero and commitment list
  - phase: 02-animation-framework
    provides: AnimatedCounter component for metrics
  - phase: 01-foundation
    provides: Section and Container layout components
provides:
  - Complete HSE "crown jewel" page with all visual enhancements
  - ParallaxImage component with spring-based scroll effect
  - SafetyMetrics section with animated counters
  - 3 parallax image breaks interspersed between content
affects: [gallery, visual-design-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [parallax scroll effect, scroll-linked animations, spring easing, animated counters on scroll]

key-files:
  created:
    - src/components/hse/ParallaxImage.tsx
    - src/components/hse/SafetyMetrics.tsx
    - public/images/hse/placeholder.txt
    - public/images/hse/hse-hero.jpg (placeholder)
    - public/images/hse/ppe-equipment.jpg (placeholder)
    - public/images/hse/team-safety.jpg (placeholder)
    - public/images/hse/safety-signs.jpg (placeholder)
  modified:
    - src/routes/pages/HSE.tsx

key-decisions:
  - "Parallax intensity default: 100px with spring easing (stiffness: 300, damping: 30)"
  - "3 parallax image breaks positioned between content sections"
  - "Safety metrics use same placeholder pattern as homepage stats (pending client data)"
  - "Created minimal 1px placeholder images for development (to be replaced with actual field photos)"

patterns-established:
  - "ParallaxImage: useScroll -> useTransform -> useSpring for smooth performance"
  - "Container overflow-hidden with 120% height image for parallax movement range"
  - "Native lazy loading on images below fold for performance"
  - "Metrics positioned at page bottom as final impression"

# Metrics
duration: 1m 52s
completed: 2026-01-21
---

# Phase 05 Plan 02: HSE Page Visual Enhancements Summary

**Complete HSE page with parallax field images (spring-based scroll effects) and animated safety metrics counters at bottom**

## Performance

- **Duration:** 1m 52s
- **Started:** 2026-01-21T18:07:39Z
- **Completed:** 2026-01-21T18:09:31Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- ParallaxImage component with configurable intensity and spring easing
- SafetyMetrics section with 3 animated counters (incident-free hours, training hours, certified personnel)
- Complete HSE page assembled with hero -> commitments -> 3 parallax images -> metrics flow
- Smooth parallax scroll effect using Framer Motion's scroll-linked animations
- Native lazy loading for performance optimization
- Placeholder images created for development (ready for actual field photos)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ParallaxImage component** - `6bc7b6c` (feat)
   - Reusable parallax image component using useScroll, useTransform, useSpring
   - Spring easing (stiffness: 300, damping: 30) for smooth performance
   - Configurable intensity prop (default: 100px range)
   - GPU-accelerated transform animation

2. **Task 2: Create SafetyMetrics component** - `f8e4648` (feat)
   - Safety metrics section with 3 animated counters
   - Uses AnimatedCounter component for count-up animation on scroll
   - StaggerContainer for sequential reveal
   - Placeholder values (1M+, 50K+, 95%) pending client data

3. **Task 3: Assemble complete HSE page** - `53349d0` (feat)
   - Updated HSE page with all sections in correct order
   - 3 ParallaxImage breaks interspersed between content
   - SafetyMetrics at bottom as final impression
   - Created placeholder images (1px JPEGs) for development

**Plan metadata:** Pending (will be committed with STATE.md update)

## Files Created/Modified

Created:
- `src/components/hse/ParallaxImage.tsx` - Parallax image component with spring-based scroll effect
- `src/components/hse/SafetyMetrics.tsx` - Safety metrics with animated counters
- `public/images/hse/placeholder.txt` - Image requirements and selection notes
- `public/images/hse/hse-hero.jpg` - Placeholder (1px JPEG for development)
- `public/images/hse/ppe-equipment.jpg` - Placeholder (1px JPEG for development)
- `public/images/hse/team-safety.jpg` - Placeholder (1px JPEG for development)
- `public/images/hse/safety-signs.jpg` - Placeholder (1px JPEG for development)

Modified:
- `src/routes/pages/HSE.tsx` - Assembled complete page with all sections

## Decisions Made

**1. Parallax intensity and spring settings**
- Default intensity: 100px range (±100px movement)
- Spring easing: stiffness 300, damping 30
- Provides subtle, professional parallax feel (not gimmicky)
- Follows CONTEXT.md requirement for "subtle and professional"

**2. Three parallax image breaks**
- Positioned between content sections (hero -> commitments -> images -> metrics)
- Each in its own Section with Container for proper spacing
- Follows CONTEXT.md specification: "3-4 image breaks throughout the page"

**3. Safety metrics placeholder values**
- Incident-free hours: 1,000,000+
- Training hours: 50,000+
- Certified personnel: 95%
- Same pattern as homepage stats (Plan 03-03 decision)
- Marked for client data verification

**4. Minimal placeholder images for development**
- Created 1px JPEG placeholders (minimal file size)
- Allows development and testing without blocking on asset selection
- placeholder.txt documents image requirements and selection criteria

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components built and integrated successfully on first attempt.

## User Setup Required

**Image asset selection required:**
- Select 4 HSE-related field images from the 26 WhatsApp images
- Rename and place in `public/images/hse/`:
  - `hse-hero.jpg` - Dramatic field shot for hero background (1920x1080+)
  - `ppe-equipment.jpg` - PPE and safety equipment (1200x800+)
  - `team-safety.jpg` - Team following safety protocols (1200x800+)
  - `safety-signs.jpg` - Safety signage and procedures (1200x800+)
- Compress to under 500KB each for performance
- See `public/images/hse/placeholder.txt` for full requirements

**Safety metrics data verification:**
- Verify or update incident-free hours (currently 1,000,000+)
- Verify or update training hours (currently 50,000+)
- Verify or update certified personnel percentage (currently 95%)
- Update in `src/components/hse/SafetyMetrics.tsx` metrics array

## Next Phase Readiness

HSE Page (Phase 5) is now COMPLETE:
- Full-screen hero with gradient overlay ✓
- 10 numbered commitment points with stagger animation ✓
- 3 parallax image breaks with smooth scroll effect ✓
- Animated safety metrics at bottom ✓

**Ready for:**
- Phase 6 (Gallery) - Can reuse ParallaxImage pattern for gallery displays
- Visual design polish - HSE "crown jewel" page sets visual standard

**Technical patterns established:**
- Scroll-linked animations with spring easing (reusable for other pages)
- Parallax image component (reusable for gallery and other visual sections)
- AnimatedCounter pattern proven (homepage stats + HSE metrics)

**Outstanding dependencies:**
- Actual field images from 26 WhatsApp image set (blocks visual verification)
- Client verification of safety metrics values (doesn't block functionality)

---
*Phase: 05-hse-page*
*Completed: 2026-01-21*
