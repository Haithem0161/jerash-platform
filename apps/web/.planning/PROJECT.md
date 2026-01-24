# Jerash For Oil Field Services Website

## What This Is

A bilingual (Arabic/English) corporate website for Jerash For Oil Field Services, an Iraqi oil & gas services company operating across Basrah, Erbil, and Baghdad. The site showcases the company's identity, 26 professional services, and strong HSE commitment through a modern, formal design with bold cinematic animations. It features a complete services catalog, photo gallery, contact forms, and career portal — standing out from typical "boring" industry websites while maintaining professionalism.

## Core Value

**Showcase Jerash's commitment to safety (HSE) and professional excellence** — the HSE section is the crown jewel; everything else supports the impression of a trustworthy, safety-first oil services partner.

## Current State

**Version:** v1.0 MVP (shipped 2026-01-23)
**Codebase:** 5,945 lines TypeScript, React 19 + Vite
**Tech stack:** React, TypeScript, Tailwind CSS, Framer Motion, react-i18next, React Router, shadcn/ui

## Requirements

### Validated

- ✓ Bilingual support (Arabic/English) with proper RTL layout switching — v1.0
- ✓ Homepage with hero slideshow, vision, mission, values, management philosophy — v1.0
- ✓ Dedicated HSE page with comprehensive safety commitment content — v1.0
- ✓ Services page showcasing 26 services across 4 categories — v1.0
- ✓ Image gallery with masonry grid layout and lightbox — v1.0
- ✓ Partners section (SLB as initial) — v1.0
- ✓ Joint Ventures section (Kweti as initial) — v1.0
- ✓ General contact/inquiry form with validation — v1.0
- ✓ Careers page with CV submission (frontend ready) — v1.0
- ✓ Contact information with 3 office locations — v1.0
- ✓ Footer with PO Box 28211 Baghdad — v1.0
- ✓ Bold cinematic animations (Framer Motion) — v1.0
- ✓ Mobile-responsive design — v1.0
- ✓ SEO optimization with hreflang for both languages — v1.0
- ✓ Accessibility compliance (skip links, focus styles, semantic HTML) — v1.0

### Active

- [ ] Backend API for form submissions (Fastify)
- [ ] Admin panel for content management
- [ ] CV database with admin review interface
- [ ] Real contact info (phone numbers, emails) — pending client
- [ ] Real partner/JV logos — pending client assets
- [ ] LinkedIn company URL — pending client

### Out of Scope

- Blog/news section — Client explicitly excluded; requires ongoing content
- E-commerce/payments — Not applicable to oilfield services
- User accounts/login — Not needed for company profile site
- Live chat/chatbot — Client didn't request; overkill for this site
- Social media feed integration — Not requested; often looks neglected
- Stock photography — Must use client's real field images only
- Auto-playing audio — Universally disliked; unprofessional
- Real-time chat — Not applicable for B2B company profile

## Context

**Company Background:**
- Full name: Jerash For Oil Field Services
- Operating in Iraq (Basrah site, Erbil office, Baghdad office)
- Services: Production Services, Wireline Logging, Consultancy Support, Fuel Station Maintenance, Mud Logging, Integrated Drilling
- Partners: SLB (Schlumberger)
- Joint Ventures: Kweti Company

**v1.0 Shipped (2026-01-23):**
- 9 phases, 24 plans completed
- All core features functional
- Tech debt: placeholder images/content (blocked on client assets)
- Backend deferred to v2

## Constraints

- **Tech Stack**: React 19, TypeScript, Vite, Tailwind, Framer Motion (already established)
- **Package Manager**: pnpm only
- **Bilingual**: Full Arabic RTL support required
- **Backend**: Frontend-first, API integration deferred to v2
- **Content**: All content from provided company profile document
- **Assets**: Must use client-provided images (rename and organize)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid site structure | Rich homepage + dedicated detail pages balances engagement with findability | ✓ Good |
| Fastify backend later | Client preference; allows frontend to progress independently | — Pending |
| Bold cinematic animations | Client explicitly rejected "boring" competitor sites | ✓ Good |
| HSE as dedicated page | Client emphasized HSE importance; deserves prominent standalone section | ✓ Good |
| Masonry grid + hero slideshow | Client wants both grid gallery and curated hero images | ✓ Good |
| Ken Burns effect for hero | CSS keyframes provide smooth continuous zoom without React re-renders | ✓ Good |
| Single-URL multilingual | Client-side language toggle vs separate /ar/ /en/ paths reduces complexity | ✓ Good |
| PWA with service worker | Offline capability and performance caching for field users | ✓ Good |
| Code splitting by page | Balance initial load (193KB) vs route-level lazy loading | ✓ Good |
| jsx-a11y as warnings | Surface issues without blocking builds | ✓ Good |

---
*Last updated: 2026-01-23 after v1.0 milestone*
