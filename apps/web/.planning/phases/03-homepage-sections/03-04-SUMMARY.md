---
phase: 03-homepage-sections
plan: 04
subsystem: homepage-assembly
tags: [partners, joint-ventures, services, homepage, i18n]
dependency-graph:
  requires: [03-01, 03-02, 03-03]
  provides: [complete-homepage, services-preview, partners-section, jv-section]
  affects: [04-services-page, 05-hse-page]
tech-stack:
  added: []
  patterns: [barrel-exports, section-composition]
key-files:
  created:
    - src/components/home/PartnersSection.tsx
    - src/components/home/JointVenturesSection.tsx
    - src/components/home/ServicesPreview.tsx
  modified:
    - src/components/home/index.ts
    - src/locales/en/common.json
    - src/locales/ar/common.json
    - src/routes/pages/Home.tsx
decisions:
  - id: section-order
    choice: "Hero -> Vision -> Mission -> Values -> Stats -> Management -> Services -> Partners -> JV"
    reason: "Standard corporate storytelling flow: inspiration, stats, then business relationships"
  - id: logo-placeholders
    choice: "Text placeholders in Partner/JV cards"
    reason: "Ready for logo assets when provided by client"
metrics:
  duration: 4m 23s
  completed: 2026-01-21
---

# Phase 3 Plan 04: Partners, JV, Services, Homepage Assembly Summary

Partners and JV sections with logo placeholders, 8-service icon grid linking to /services, full homepage assembly with 9 sections in logical order.

## What Was Built

### Components Created

**PartnersSection.tsx (39 lines)**
- Featured partner card displaying SLB (Schlumberger)
- Logo placeholder ready for asset addition
- FadeIn animation for scroll reveal
- Centered layout with max-w-md card

**JointVenturesSection.tsx (39 lines)**
- Joint venture card displaying Kweti Energy Services
- Logo placeholder ready for asset addition
- Identical structure to Partners for visual consistency

**ServicesPreview.tsx (70 lines)**
- 8-service icon grid (Water Treatment, Maintenance, Monitoring, Drilling, Coiled Tubing, Safety Training, Chemicals, HSE)
- Responsive grid: 2 cols mobile, 4 cols desktop
- StaggerContainer for cascading reveal animation
- Link to /services with RTL-aware arrow icon
- Hover effects on service cards

### Homepage Assembly

**Home.tsx updated** to render all 9 sections:
1. HeroSlideshow - Full viewport hero with Ken Burns
2. VisionSection - Company vision statement
3. MissionSection - Company mission
4. ValuesSection - 5 core values with icons
5. StatsSection - 3 animated counters
6. ManagementSection - Leadership philosophy
7. ServicesPreview - 8 services with icons
8. PartnersSection - SLB partnership
9. JointVenturesSection - Kweti JV

### Translations Added

**English (common.json):**
- home.partners.title, home.partners.slb.name/description
- home.jointVentures.title, home.jointVentures.kweti.name/description
- home.services.title, seeAll, and 8 service names

**Arabic (common.json):**
- Complete Arabic translations for all above keys
- Services: معالجة المياه، الصيانة، مراقبة العمليات، etc.

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Section order | As listed above | Corporate storytelling: inspiration first, then credentials, then business relationships |
| Logo placeholders | Grey box with "Logo" text | Ready for assets, doesn't block visual progress |
| Services count | 8 representative services | Balanced grid (2x4 on desktop), covers key offerings |
| Link styling | linkHover class + ArrowRight | Consistent with established interaction patterns |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] PartnersSection displays SLB
- [x] JointVenturesSection displays Kweti
- [x] ServicesPreview shows 8 services with icons
- [x] ServicesPreview has working link to /services
- [x] All translations in both en/ar JSON files
- [x] Home.tsx renders all sections in order
- [x] Build passes: `pnpm build`
- [x] Pre-existing lint warning in useMediaQuery.ts (not introduced by this plan)

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 6bc43c0 | feat | Create Partners and JointVentures sections |
| bbd6b70 | feat | Create ServicesPreview with 8-service icon grid |
| 4fa9e48 | feat | Assemble complete homepage with all sections |

## Files Changed

```
src/components/home/
├── PartnersSection.tsx      [+39 lines]
├── JointVenturesSection.tsx [+39 lines]
├── ServicesPreview.tsx      [+70 lines]
└── index.ts                 [modified - added 3 exports]

src/locales/
├── en/common.json           [+26 lines - partners, jv, services]
└── ar/common.json           [+26 lines - Arabic translations]

src/routes/pages/
└── Home.tsx                 [rewritten - 9 section assembly]
```

## Next Phase Readiness

Phase 3 (Homepage Sections) is now complete:
- All 9 homepage sections implemented
- Full bilingual content (EN/AR)
- Animations via FadeIn and StaggerContainer
- Hero slideshow with Ken Burns effect
- Animated statistics counters
- Services preview linking to /services page

**Ready for:**
- Phase 4: Services page (ServicesPreview links here)
- Phase 5: HSE page
- Logo assets from client for Partners/JV sections

**Blockers:**
- None

## Performance Notes

- Bundle size increased from 635KB to 662KB (additional components)
- All new components use lazy FadeIn (viewport-triggered, once-only)
- No additional dependencies added
