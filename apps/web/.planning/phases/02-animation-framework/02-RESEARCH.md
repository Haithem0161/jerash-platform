# Phase 2: Animation Framework - Research

**Researched:** 2026-01-21
**Domain:** Framer Motion / Motion, React 19, Scroll Animations, Accessibility
**Confidence:** HIGH

## Summary

This phase establishes the animation infrastructure for the entire site. Motion (formerly Framer Motion) v12 is already installed in the project and provides all necessary features for scroll-triggered reveals, page transitions, hover effects, and reduced motion support.

The project already has:
- `framer-motion` / `motion` v12.24.3 installed
- Basic AnimatePresence on RootLayout for language changes
- LoadingOverlay with entry/exit animations
- `usePrefersReducedMotion` hook already built
- CSS transitions on nav links with RTL-aware underline animation
- RTL detection via `i18n.dir()` and `isRTL()` helper

The primary work involves creating reusable animation components that:
1. Implement fade-up scroll reveal with staggered children
2. Add proper page transitions keyed to route changes
3. Standardize hover effects per the context decisions
4. Wire up MotionConfig for global reduced motion support

**Primary recommendation:** Use `MotionConfig` with `reducedMotion="user"` at app root to globally handle accessibility. Create a small set of reusable animation wrapper components (`FadeIn`, `StaggerContainer`, `PageTransition`) rather than repeating animation props throughout components.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.24.3 | Animation library | Already installed, mature, React-first API |
| react-router | ^7.11.0 | Client-side routing | Already installed, provides `useLocation` for route keys |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | ^4.1.18 | Transition utilities | Already installed, use for simple color transitions |

### Already Available (No Additional Install)
- `usePrefersReducedMotion` hook exists at `src/hooks/useMediaQuery.ts`
- `isRTL()` helper exists at `src/lib/i18n.ts`
- `AnimatePresence` already wrapping `<Outlet>` in RootLayout

**Installation:**
No additional packages needed. All required libraries are already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── animations/
│       ├── FadeIn.tsx           # Single element fade-up reveal
│       ├── StaggerContainer.tsx # Parent for staggered child reveals
│       ├── PageTransition.tsx   # Route change animation wrapper
│       ├── MotionProvider.tsx   # MotionConfig wrapper with reducedMotion
│       └── variants.ts          # Shared variant definitions
├── hooks/
│   └── useMediaQuery.ts         # Already has usePrefersReducedMotion
└── lib/
    └── motion-features.ts       # LazyMotion features (optional optimization)
```

### Pattern 1: MotionConfig Provider
**What:** Global motion configuration with automatic reduced motion support
**When to use:** Wrap entire app once to handle accessibility globally
**Example:**
```tsx
// src/components/animations/MotionProvider.tsx
import { MotionConfig } from 'motion/react'

interface MotionProviderProps {
  children: React.ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.2 }}>
      {children}
    </MotionConfig>
  )
}
```
Source: [Motion MotionConfig docs](https://motion.dev/motion/motion-config/)

### Pattern 2: Scroll Reveal with whileInView
**What:** Elements fade in and move up when scrolling into view
**When to use:** All section content, cards, headings, images
**Example:**
```tsx
// src/components/animations/FadeIn.tsx
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { isRTL } from '@/lib/i18n'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up'
}: FadeInProps) {
  const { i18n } = useTranslation()
  const rtl = isRTL(i18n.language)

  // Mirror horizontal directions for RTL
  const getOffset = () => {
    const offset = 20 // px
    switch (direction) {
      case 'up': return { y: offset }
      case 'down': return { y: -offset }
      case 'left': return { x: rtl ? -offset : offset }
      case 'right': return { x: rtl ? offset : -offset }
    }
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...getOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}
```
Source: [Motion whileInView docs](https://motion.dev/docs/react-motion-component)

### Pattern 3: Staggered Children
**What:** Container that staggers animation of children
**When to use:** Lists, grids, multiple cards appearing together
**Example:**
```tsx
// src/components/animations/StaggerContainer.tsx
import { motion } from 'motion/react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// For children - wrap each child element
export function StaggerItem({ children, className }: StaggerContainerProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
```
Source: [Motion Variants docs](https://motion.dev/docs/react-motion-component)

### Pattern 4: Page Transitions with React Router
**What:** Fade transition between route changes
**When to use:** Wrap Outlet in RootLayout
**Example:**
```tsx
// src/components/layout/RootLayout.tsx
import { Outlet, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'

export function RootLayout() {
  const location = useLocation()

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}
```
Source: [AnimatePresence docs](https://motion.dev/docs/react-animate-presence)

**Key insight:** Use `location.pathname` as key for route changes. Use `onExitComplete` callback to scroll to top after exit animation completes. Currently the code keys on `i18n.language` which handles language changes but not route changes.

### Pattern 5: Hover Effects (CSS-only for Performance)
**What:** Color/border changes on interactive elements
**When to use:** Buttons, cards, links
**Example:**
```tsx
// Buttons: color change only - use Tailwind
<Button className="transition-colors duration-100 hover:bg-primary/90">
  Click me
</Button>

// Cards: border highlight on hover - use Tailwind
<div className="border border-transparent transition-colors duration-100 hover:border-primary">
  Card content
</div>

// For motion-based hover (if needed):
<motion.button
  whileHover={{ backgroundColor: 'var(--primary)' }}
  transition={{ duration: 0.1 }}
>
  Button
</motion.button>
```

**Recommendation from context:** Use CSS transitions for hover effects (100ms), not Motion. CSS is more performant for simple color/border changes.

### Anti-Patterns to Avoid
- **Animating width/height:** Causes layout thrashing. Use `scale` or `clipPath` instead.
- **Animating top/left/right/bottom:** Use `transform: translate()` via x/y props.
- **Using motion component for simple hovers:** Use CSS `transition-colors` for color changes.
- **Mixing motion and regular components in AnimatePresence children:** Only direct children can exit-animate.
- **Forgetting key prop in AnimatePresence:** Exit animations won't work without unique keys.
- **Over-animating:** Too many animations distract from content (especially for oil & gas industry).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered reveal | Custom IntersectionObserver | `whileInView` + `viewport` | Built-in, handles edge cases, works with AnimatePresence |
| Reduced motion detection | Custom media query listener | `MotionConfig reducedMotion="user"` | Automatically disables transform animations, keeps opacity |
| Page exit animations | Manual unmount delays | `AnimatePresence mode="wait"` | Handles cleanup, timing, multiple children |
| Spring physics | Duration/easing math | `type: "spring"` | Physics-based feels natural, handles interrupts |
| Staggered lists | Manual delay calculation | `staggerChildren` in variants | Handles dynamic lists, direction, timing |

**Key insight:** Motion handles all the timing, cleanup, and edge cases. The only hand-rolled code should be the variant definitions and wrapper components.

## Common Pitfalls

### Pitfall 1: Exit Animations Not Working
**What goes wrong:** Elements disappear instantly instead of animating out
**Why it happens:** Missing `key` prop, not a direct child of AnimatePresence, or conditional logic outside AnimatePresence
**How to avoid:**
- Always add `key` prop to conditionally rendered motion elements
- Wrap the conditional in AnimatePresence, not the other way around
- Ensure motion element is direct child (not wrapped in another component without forwarding)
**Warning signs:** Console warnings about keys, sudden disappearance on route change

### Pitfall 2: Performance Jank on Scroll Reveals
**What goes wrong:** Animations stutter, especially on mobile
**Why it happens:** Animating layout-triggering properties (width, height, margin)
**How to avoid:** Only animate `opacity`, `transform` (x, y, scale, rotate), `filter`, `clipPath`
**Warning signs:** Frame drops visible in DevTools Performance tab, CPU spikes

### Pitfall 3: RTL Animation Direction Wrong
**What goes wrong:** "Slide from right" animates from left in Arabic
**Why it happens:** Hardcoded x values without RTL check
**How to avoid:** Mirror x-axis animations when `i18n.dir() === 'rtl'`
**Warning signs:** Animations feel "backwards" in Arabic mode

### Pitfall 4: Reduced Motion Breaks Layout
**What goes wrong:** Elements in wrong position when animations disabled
**Why it happens:** Elements start at `initial` position but never animate to `animate`
**How to avoid:** Use `MotionConfig reducedMotion="user"` which keeps opacity but disables transform. Or check `usePrefersReducedMotion()` and skip `initial` entirely.
**Warning signs:** Elements appear off-screen or invisible with reduced motion enabled

### Pitfall 5: Page Transition Scroll Position
**What goes wrong:** New page starts at scroll position of previous page
**Why it happens:** Browser maintains scroll position, exit animation delays new render
**How to avoid:** Use `onExitComplete={() => window.scrollTo(0, 0)}` on AnimatePresence
**Warning signs:** User sees middle of page after navigation

### Pitfall 6: Bundle Size Bloat
**What goes wrong:** Main bundle includes all Motion features
**Why it happens:** Using `motion` component includes ~34kb of features
**How to avoid:** Use `LazyMotion` with `domAnimation` (~15kb) if bundle size critical. For this project, current size is acceptable.
**Warning signs:** Lighthouse performance warnings about bundle size

## Code Examples

Verified patterns from official sources:

### Shared Variants (variants.ts)
```typescript
// src/components/animations/variants.ts
import type { Variants, Transition } from 'motion/react'

// Default transitions matching context decisions
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
}

export const fastTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
}

export const instantTransition: Transition = {
  duration: 0.1,
  ease: 'linear',
}

// Fade up (default reveal)
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
}

// Fade only (for page transitions)
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: fastTransition },
  exit: { opacity: 0, transition: fastTransition },
}

// Stagger container
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}
```

### Complete RootLayout with Proper Page Transitions
```tsx
// src/components/layout/RootLayout.tsx
import { Outlet, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { LoadingOverlay } from '@/components/common/LoadingOverlay'

export function RootLayout() {
  const location = useLocation()
  const { i18n } = useTranslation()

  // Combine pathname and language for unique key
  const pageKey = `${location.pathname}-${i18n.language}`

  return (
    <>
      <LoadingOverlay />
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <AnimatePresence
          mode="wait"
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <motion.main
            key={pageKey}
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  )
}
```

### RTL-Aware Directional Animation Hook
```tsx
// src/hooks/useDirectionalAnimation.ts
import { useTranslation } from 'react-i18next'
import { isRTL } from '@/lib/i18n'

type Direction = 'left' | 'right' | 'up' | 'down'

export function useDirectionalOffset(direction: Direction, offset: number = 20) {
  const { i18n } = useTranslation()
  const rtl = isRTL(i18n.language)

  switch (direction) {
    case 'up':
      return { y: offset }
    case 'down':
      return { y: -offset }
    case 'left':
      // "from left" means opposite in RTL
      return { x: rtl ? offset : -offset }
    case 'right':
      // "from right" means opposite in RTL
      return { x: rtl ? -offset : offset }
  }
}
```

### Hover Effect Utilities (CSS-based per context)
```tsx
// Tailwind classes for hover effects per context decisions

// Buttons: color change only
const buttonHover = "transition-colors duration-100 hover:bg-primary/90"

// Cards: border highlight
const cardHover = "border border-transparent transition-colors duration-100 hover:border-primary"

// Links: underline animation (already implemented in Navigation.tsx)
const linkHover = [
  'after:absolute after:bottom-0 after:start-0',
  'after:h-0.5 after:bg-primary',
  'after:w-0 hover:after:w-full',
  'after:transition-all after:duration-300',
].join(' ')
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package name | `motion` package name | 2024 | Both still work, import from `motion/react` |
| Custom IntersectionObserver | `whileInView` + `viewport` | Motion 4.0+ | Built-in, more reliable |
| Manual reduced motion hooks | `MotionConfig reducedMotion="user"` | Motion 6.0+ | Automatic, global |
| `motion` component full bundle | `LazyMotion` + `m` component | Motion 4.0+ | Optional ~50% size reduction |

**Current (Motion v12):**
- Import from `motion/react` (or `framer-motion` still works)
- `MotionConfig` for global settings including `reducedMotion`
- `whileInView` with `viewport` options for scroll triggers
- `AnimatePresence` with `mode="wait"` for sequential transitions
- Use `domAnimation` bundle (~15kb) vs full bundle (~34kb) if size matters

**Not needed:**
- GSAP ScrollTrigger (Motion handles it)
- react-intersection-observer (Motion uses it internally)
- Custom reduced motion context (MotionConfig handles it)

## Open Questions

Things that couldn't be fully resolved:

1. **LazyMotion optimization priority**
   - What we know: Full bundle is ~34kb, LazyMotion with domAnimation is ~15kb
   - What's unclear: Whether bundle size is a concern for this project
   - Recommendation: Start without LazyMotion; optimize later if Lighthouse flags it

2. **Hero "bold cinematic" animation specifics (ANIM-03)**
   - What we know: Hero section needs special emphasis
   - What's unclear: Exact definition of "bold cinematic" - larger scale? parallax? sequence?
   - Recommendation: Implement as slightly longer duration (500ms) fade-up with larger offset (40px), refine based on feedback

## Sources

### Primary (HIGH confidence)
- Project's FRAMER-MOTION.md guide - comprehensive patterns and API
- Project's existing code - RootLayout, LoadingOverlay patterns
- [Motion official docs](https://motion.dev/docs/react-motion-component) - current API reference

### Secondary (MEDIUM confidence)
- [egghead.io scroll animations](https://egghead.io/blog/how-to-animate-elements-when-in-view-on-scroll-with-framer-motion) - whileInView patterns
- [LogRocket scroll animations](https://blog.logrocket.com/react-scroll-animations-framer-motion/) - viewport configuration
- [Motion accessibility guide](https://motion.dev/docs/react-accessibility) - reduced motion patterns
- [React Router scroll restoration discussions](https://github.com/remix-run/react-router/discussions/10411) - page transition + scroll

### Tertiary (LOW confidence)
- WebSearch results for RTL animation patterns - verified against i18n.ts implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - already installed and used in project
- Architecture: HIGH - patterns verified against project's FRAMER-MOTION.md
- Pitfalls: HIGH - derived from official docs and common patterns
- RTL mirroring: MEDIUM - logical inference, verify during implementation

**Research date:** 2026-01-21
**Valid until:** 2026-03-21 (Motion v12 is stable, patterns unlikely to change)
