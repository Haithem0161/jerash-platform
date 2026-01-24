# Phase 2: Animation Framework - Context

**Gathered:** 2026-01-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish reusable animation patterns — scroll reveals, hover effects, page transitions — that downstream phases will use. This is infrastructure that determines how motion feels across the entire site. Animations must support reduced motion preferences and maintain 60fps performance.

</domain>

<decisions>
## Implementation Decisions

### Motion Personality
- Fast & snappy tempo (~200-300ms duration)
- Professional & polished feel — clean, predictable, confidence-inspiring
- Mirror directions for RTL/LTR — slide-in from right in LTR, from left in RTL
- Default easing: ease-out (starts fast, decelerates)

### Scroll Reveal Style
- Reveal type: Fade up — elements fade in while moving slightly upward
- Trigger point: When 20% visible (elements start animating early)
- Staggered animations — elements animate one after another with slight delay
- Animate once only — stay visible after first reveal, no repeat on re-scroll

### Page Transitions
- Transition type: Fade (simple opacity crossfade)
- Speed: Fast ~200ms
- Scroll position: Always start at top of page after navigation
- Sequential timing — old page fades out, then new page fades in (no overlap)

### Hover/Interaction Feel
- Buttons: Color change only (no lift or scale)
- Cards: Border highlight on hover (no shadow/lift)
- Response speed: Instant ~100ms
- Links: Consistent underline animation on hover (matching nav behavior from Phase 1)

### Claude's Discretion
- Exact easing curves (within ease-out family)
- Stagger delay values
- Specific transform values for fade-up (10px, 20px, etc.)
- How reduced-motion fallbacks are structured

</decisions>

<specifics>
## Specific Ideas

- Motion should convey professionalism appropriate for oil & gas industry
- RTL mirroring is important — Arabic users should feel native directional motion
- Keep it subtle — animation supports content, never distracts from it

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-animation-framework*
*Context gathered: 2026-01-21*
