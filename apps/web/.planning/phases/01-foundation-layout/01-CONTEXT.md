# Phase 1: Foundation & Layout - Context

**Gathered:** 2026-01-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Bilingual navigation shell with RTL/LTR switching. Users can toggle between Arabic/English, navigate through responsive header/footer, and experience a branded logo animation on first visit. Layout direction automatically matches selected language.

</domain>

<decisions>
## Implementation Decisions

### Language Switcher Design
- Dropdown selector (not text buttons or flags)
- Positioned in header right corner
- Text only — "English" and "عربي" — no flag icons
- Fade transition when switching languages (brief fade out/in as content and direction change)
- Language preference persists across sessions

### Header/Nav Structure
- Sticky header — stays visible at top as user scrolls
- Logo on left side (automatically flips to right in RTL mode)
- Navigation links: Home, Services, HSE, Gallery, Contact, Careers
- Underline animation on hover for nav links
- Hamburger menu on mobile

### Footer Content Layout
- Full footer with multiple sections: office info, quick links, about snippet, copyright
- 3 office locations (Basrah, Erbil, Baghdad) displayed as tabs or accordion — click to expand each
- Include social media icons (LinkedIn, etc. if available)
- Light footer matching page background with subtle separator
- PO Box information included

### Logo Loading Animation
- Fade in with scale effect — logo fades in while growing slightly
- Shows only on first visit per session (skipped on subsequent navigation)
- Duration: 1-2 seconds (medium timing)
- Full overlay loading screen — logo animates on solid/branded background, then reveals page

### Claude's Discretion
- Exact timing curves for fade transitions
- Mobile menu animation style
- Social media platforms to include (based on what Jerash actually uses)
- Exact spacing and typography choices
- Loading overlay background color/gradient

</decisions>

<specifics>
## Specific Ideas

- Language dropdown should feel clean and unobtrusive — simple text, no visual noise
- Header should feel corporate but not dated — modern sticky behavior with classic underline hovers
- Footer tabs for offices keep things organized without overwhelming — user clicks to see office they need
- Logo animation sets professional tone on first impression — not flashy, just polished

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-layout*
*Context gathered: 2026-01-21*
