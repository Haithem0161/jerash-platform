# Phase 8: Polish & SEO - Context

**Gathered:** 2026-01-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Production-ready site with SEO optimization, performance tuning, and accessibility compliance. This phase makes the site discoverable by search engines, fast for users on varying connection speeds, and usable by people with disabilities. No new features — refinement of what's already built.

</domain>

<decisions>
## Implementation Decisions

### Meta content strategy
- Tone: Professional & technical — emphasize expertise and service capabilities
- Page titles/descriptions: "Jerash For Oil Field Services | Production Operations & Wireline Solutions" style
- Open Graph images: Per-page images (HSE shows safety imagery, Services shows equipment, etc.)
- Arabic content: Culturally adapted, not just translated — adjust phrasing for Arabic market expectations
- Keywords: Both industry terms ("oil field services", "wireline", "well services", "HSE") AND location terms ("Iraq", "Basrah", "Kurdistan", "Middle East")

### Image optimization approach
- Format strategy: AVIF + WebP + JPEG fallback chain using `<picture>` element
- Build-time generation: Use vite-imagetools to generate variants at build (no CDN dependency)
- srcset breakpoints: Standard set — 640, 768, 1024, 1280
- Quality level: Balanced 75-80% compression
- Lazy loading: Conservative — only gallery images lazy-load, hero/above-fold images load immediately
- Placeholders: Skeleton boxes (already established pattern from gallery)
- Hero preloading: Add `<link rel="preload">` for above-fold hero images on each page
- Gallery: Generate all 8 variants per image (4 sizes × 2 formats) for optimal delivery
- Note: Real client images are already in place — no placeholders to replace

### Performance targets
- Core Web Vitals: All equal priority (LCP, CLS, INP)
- Target connection: Fast 3G (1.6 Mbps) — works for users with poor connections in Iraq
- Code splitting: Component-level splitting for heavy components (gallery lightbox, forms)
- Hero slideshow: Preload first two images for smooth initial transition
- Service worker: Basic caching for static assets (CSS, JS, fonts) — not full PWA
- Third-party scripts: Defer all third-party (analytics) until main content is interactive
- Animations: Strategic will-change hints for hero slideshow and gallery grid
- Gallery virtualization: Virtual scroll for 26 images — only render visible images in DOM
- Web Vitals monitoring: Report real user metrics to analytics endpoint

### Accessibility scope
- WCAG level: 2.2 AA (latest standard with focus appearance requirements)
- Focus states: Ring outline (focus-visible:ring-2) in brand color
- Skip links: Multiple — skip to main content, skip to nav, skip to footer
- Testing: Automated only (axe-core/Lighthouse accessibility audit)

### Claude's Discretion
- Critical CSS inlining — evaluate if CSS is a bottleneck and implement if beneficial
- Exact hreflang implementation approach
- Semantic HTML improvements where needed
- Color contrast adjustments if any fail WCAG AA

</decisions>

<specifics>
## Specific Ideas

- Hero image preloading: Preload first two slideshow images for guaranteed smooth transition
- Arabic SEO: Cultural adaptation means adjusting phrasing for regional presence, not just translation
- Performance baseline: Target Fast 3G (1.6 Mbps) as worst-case scenario for Iraqi users
- Gallery: Virtual scroll implementation keeps DOM light with 26 images

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-polish-seo*
*Context gathered: 2026-01-22*
