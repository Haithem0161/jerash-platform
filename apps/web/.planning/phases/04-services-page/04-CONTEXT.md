# Phase 4: Services Page - Context

**Gathered:** 2026-01-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse and explore all 20+ oil field services organized by category. Services display in 4 categories (Production, Wireline, Consultancy, Other) with filtering and expandable detail cards. All content in both Arabic and English.

</domain>

<decisions>
## Implementation Decisions

### Card Design & Layout
- Grid layout with 4 cards per row on desktop (responsive down to 1 on mobile)
- Each card shows: icon + title + short description (1-2 lines preview)
- Flat cards with borders, no shadows
- Border color change on hover (brand color highlight)

### Category Filtering
- Horizontal tabs at top: "All | Production | Wireline | Consultancy | Other"
- "All" as default tab, showing all services
- Animated underline indicator slides to active tab (consistent with nav style)
- Staggered reveal animation when filter changes (cards appear one-by-one)

### Expand/Detail Behavior
- Modal/dialog overlay when card is clicked
- Modal contains: icon in header, service title, full description, close button
- Simple content — no related services or contact CTA
- Dismissible by clicking backdrop or pressing Escape

### Page Structure
- No hero section — straight to content
- Prominent "Our Services" / "خدماتنا" title above tabs
- Category tab order: All | Production | Wireline | Consultancy | Other
- 4 cards per row desktop, responsive grid

### Claude's Discretion
- Exact icon selection for each service
- Responsive breakpoints for grid columns
- Modal animation style
- Tab bar styling details
- Service short description truncation approach

</decisions>

<specifics>
## Specific Ideas

- Underline indicator on tabs should animate/slide like the nav menu underlines from Phase 1
- Staggered reveal should match the animation patterns established in Phase 2/3
- Flat bordered cards keep visual consistency with the clean, professional aesthetic

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-services-page*
*Context gathered: 2026-01-21*
