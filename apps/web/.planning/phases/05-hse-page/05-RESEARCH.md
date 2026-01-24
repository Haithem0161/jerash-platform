# Phase 5: HSE Page (Crown Jewel) - Research

**Researched:** 2026-01-21
**Domain:** Full-screen hero section, parallax scroll effects, animated counters, numbered commitment list, HSE/safety page design
**Confidence:** HIGH

## Summary

Research focused on implementing a professional HSE page that serves as the "crown jewel" of the Jerash website. Investigation covered full-screen hero sections with dramatic imagery, parallax scroll effects for contained field images, numbered vertical list patterns for commitment points, and animated counter components for safety metrics.

The standard approach combines a full-screen hero with overlay text (using dark gradient overlays for readability), Framer Motion's `useScroll` + `useTransform` for parallax effects on contained images, staggered reveal animations for commitment points using existing `StaggerContainer` components, and the existing `AnimatedCounter` component for metrics display at page bottom.

Key findings indicate that parallax should use spring-based easing (not 1:1 scroll mapping) for smooth performance, hero overlays should maintain WCAG contrast ratios (4.5:1 minimum), and numbered lists work best with subtle visual hierarchy focusing on content rather than decorative numbers.

**Primary recommendation:** Reuse existing animation infrastructure (AnimatedCounter, StaggerContainer, FadeIn components from Phase 2), implement parallax via `useScroll` with element-specific tracking and spring easing, and structure the page as: full-screen hero → numbered commitment list with stagger animation → interspersed parallax field images → animated metrics at bottom.

## Standard Stack

The project already has established libraries and patterns from prior phases.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion (Framer Motion) | Latest | Scroll-triggered animations, parallax effects, counters | Already integrated in Phase 2, provides `useScroll`, `useTransform`, `useSpring` for parallax |
| react-i18next | Latest | Bilingual content (Arabic/English) | Already configured for RTL support, HSE content needs translation |
| Tailwind CSS v4 | Latest | Styling with @theme directive | Project standard, responsive design, dark mode support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | Latest | Icons (HSE icon for commitment section) | Existing icon library, lightweight SVG icons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Framer Motion parallax | CSS-only parallax | Framer Motion provides finer control, spring-based easing, and accessibility support (reduced motion) |
| Custom counter animation | CSS counter animation | Existing `AnimatedCounter` component uses `useMotionValue` pattern, avoids React re-renders |
| react-intersection-observer | Framer Motion `whileInView` | Project already uses Framer Motion patterns, no need for additional dependency |

**Installation:**
No new packages required - all dependencies already installed from prior phases.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── routes/pages/
│   └── HSE.tsx              # Main HSE page component
├── components/
│   ├── hse/
│   │   ├── HSEHero.tsx      # Full-screen hero with commitment statement
│   │   ├── CommitmentList.tsx # Numbered list of 10 commitment points
│   │   ├── ParallaxImage.tsx  # Reusable parallax image component
│   │   └── SafetyMetrics.tsx  # Animated counter metrics section
│   ├── animations/          # Existing: AnimatedCounter, StaggerContainer, FadeIn
│   └── layout/              # Existing: Section, Container
├── locales/
│   ├── en/
│   │   └── hse.json         # English HSE content
│   └── ar/
│       └── hse.json         # Arabic HSE content (needs translation)
└── public/
    └── hse/                 # Organized HSE field images (PPE, safety signs, team)
```

### Pattern 1: Full-Screen Hero with Dramatic Overlay
**What:** Full viewport height hero section with background image, dark gradient overlay, and prominent text
**When to use:** Page entry point, immediate visual impact for "crown jewel" positioning
**Example:**
```tsx
// Source: Project decision (CONTEXT.md) + Web research on hero best practices
export function HSEHero() {
  const { t } = useTranslation()

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hse/hero-safety-field.jpeg')" }}
      />

      {/* Dark Gradient Overlay for text readability (WCAG 4.5:1 contrast) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Hero Text */}
      <div className="absolute inset-0 flex items-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              {t('hse.hero.commitment')}
            </h1>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}
```

### Pattern 2: Parallax Scroll on Contained Images
**What:** Element-specific scroll tracking with `useScroll` and `useTransform`, spring easing for smoothness
**When to use:** 3-4 image breaks between content sections, subtle parallax effect
**Example:**
```tsx
// Source: Framer Motion docs + Web research on parallax best practices
import { useRef } from 'react'
import { useScroll, useTransform, useSpring, motion } from 'motion/react'

export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)

  // Track scroll progress for this specific element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] // Start when element enters, end when it leaves
  })

  // Transform scroll progress to parallax offset
  // Range: -100px to 100px creates subtle movement
  const rawY = useTransform(scrollYProgress, [0, 1], [100, -100])

  // Apply spring easing for smoothness (prevents stuttering on fast scroll)
  const y = useSpring(rawY, { stiffness: 300, damping: 30 })

  return (
    <div ref={ref} className="relative h-96 overflow-hidden rounded-lg">
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
```

### Pattern 3: Numbered Vertical List with Staggered Reveal
**What:** Numbered commitment points with staggered fade-up animation using existing `StaggerContainer`
**When to use:** The 10 HSE commitment points, focus on content not decorative numbers
**Example:**
```tsx
// Source: Existing StaggerContainer pattern + Web research on numbered list UI
export function CommitmentList() {
  const { t } = useTranslation()
  const commitments = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <Section>
      <Container>
        <StaggerContainer className="space-y-6">
          {commitments.map((num) => (
            <StaggerItem key={num} className="flex gap-4">
              {/* Subtle numbered bullet */}
              <span className="text-2xl font-bold text-muted-foreground/50">
                {num.toString().padStart(2, '0')}
              </span>
              {/* Focus on text content */}
              <p className="flex-1 text-lg leading-relaxed">
                {t(`hse.commitments.${num}`)}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  )
}
```

### Pattern 4: Animated Metrics with Existing Counter Component
**What:** Reuse `AnimatedCounter` from Phase 2 for safety statistics at page bottom
**When to use:** Final impression section, metrics prove safety culture
**Example:**
```tsx
// Source: Existing AnimatedCounter component from Phase 2
import { AnimatedCounter } from '@/components/animations'

const metrics = [
  { key: 'incidentFreeHours', value: 1000000, suffix: '+' },
  { key: 'trainingHours', value: 50000, suffix: '+' },
  { key: 'certifiedEmployees', value: 95, suffix: '%' },
]

export function SafetyMetrics() {
  const { t } = useTranslation()

  return (
    <Section className="bg-muted/50">
      <Container>
        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {metrics.map((metric) => (
            <StaggerItem key={metric.key} className="text-center">
              <div className="text-5xl font-bold md:text-6xl">
                <AnimatedCounter to={metric.value} suffix={metric.suffix} />
              </div>
              <p className="mt-2 text-lg text-muted-foreground">
                {t(`hse.metrics.${metric.key}`)}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  )
}
```

### Anti-Patterns to Avoid
- **1:1 scroll mapping for parallax:** Causes stuttering on fast scroll - always use spring easing (`useSpring`)
- **Full-width edge-to-edge parallax images:** Context decision specifies contained images with rounded corners
- **Per-point icons for commitment list:** Context decision specifies single HSE icon for whole section
- **Metrics at page top:** Context decision places metrics at bottom as final impression
- **Animated properties other than transform/opacity:** Triggers layout recalc, kills performance - stick to GPU-accelerated properties

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animated counter from 0 to N | Custom setInterval counter | Existing `AnimatedCounter` component | Uses `useMotionValue` to avoid React re-renders, includes `useInView` for scroll trigger, supports prefix/suffix |
| Parallax scroll effect | CSS transform on scroll event | Framer Motion `useScroll` + `useTransform` + `useSpring` | Handles performance, spring easing prevents stuttering, respects `prefers-reduced-motion` |
| Staggered list animations | Manual delay calculation | Existing `StaggerContainer` + `StaggerItem` | Built-in stagger timing (0.1s between items), integrates with MotionProvider reduced motion support |
| Scroll-triggered fade-in | Intersection Observer + state | Existing `FadeIn` component | RTL-aware, consistent timing (0.3s), already integrated with MotionProvider |
| Reduced motion support | Manual media query checks | Global `MotionProvider` from Phase 2 | Centralized `reducedMotion="user"` config, applies to all motion components automatically |

**Key insight:** Phase 2 established comprehensive animation infrastructure. HSE page should compose existing components rather than reinventing animation patterns. This ensures consistency, accessibility (reduced motion), and performance across the site.

## Common Pitfalls

### Pitfall 1: Poor Text Contrast on Hero Image
**What goes wrong:** White text over light background areas becomes unreadable, fails WCAG accessibility
**Why it happens:** Relying on image darkness alone without overlay, or using uniform overlay that doesn't account for image composition
**How to avoid:** Use gradient overlay (`bg-gradient-to-b from-black/60 via-black/40 to-black/60`) targeting both top and bottom, test with Lighthouse accessibility audit
**Warning signs:** Text difficult to read on mobile, accessibility audit failures, low contrast ratio (<4.5:1)

### Pitfall 2: Parallax Performance Issues on Mobile
**What goes wrong:** Janky scrolling, high CPU usage, battery drain on mobile devices
**Why it happens:** Using too many parallax elements, not using spring easing, animating non-transform properties
**How to avoid:** Limit to 3-4 parallax images max per page, always use `useSpring` for smoothness, only animate `transform: translateY()` (GPU-accelerated)
**Warning signs:** Scroll framerate drops below 60fps, mobile devices get warm, scroll feels "sticky"

### Pitfall 3: Numbered List Visual Hierarchy Confusion
**What goes wrong:** Large decorative numbers compete with content for attention, list becomes hard to scan
**Why it happens:** Making numbers too prominent (large font, bright colors) instead of subtle guides
**How to avoid:** Use `text-muted-foreground/50` for number opacity, keep numbers small relative to content text (2xl vs lg), focus visual weight on commitment text
**Warning signs:** Users skip reading and just look at numbers, numbers feel like "badges" rather than organization

### Pitfall 4: Animated Counters Re-render on Every Frame
**What goes wrong:** Counter animation causes component to re-render 60 times per second, kills performance
**Why it happens:** Using React state instead of Framer Motion's `useMotionValue` which exists outside React's render cycle
**How to avoid:** Always use the existing `AnimatedCounter` component which uses `useMotionValue` + `useTransform` pattern
**Warning signs:** DevTools shows excessive re-renders during counter animation, other elements on page feel sluggish

### Pitfall 5: Missing Lazy Loading for Hero and Field Images
**What goes wrong:** All images load immediately on page entry, slow initial page load, poor Lighthouse performance score
**Why it happens:** Not using `loading="lazy"` attribute, loading high-res images without optimization
**How to avoid:** Use native `loading="lazy"` for field images (not hero - it's above fold), consider responsive `srcset` for different screen sizes, compress images to <500KB
**Warning signs:** Slow page load on 3G networks, Lighthouse performance score <90, large network payload

### Pitfall 6: Ignoring RTL Layout for Arabic Content
**What goes wrong:** Numbered list and parallax animations feel backwards in Arabic, text alignment broken
**Why it happens:** Not accounting for RTL layout in animation directions and number placement
**How to avoid:** Use `FadeIn` component (already RTL-aware), use Tailwind `start`/`end` instead of `left`/`right`, test with Arabic language active
**Warning signs:** Numbers appear on wrong side in Arabic, animations move in unexpected directions

### Pitfall 7: Violating Established Section Spacing
**What goes wrong:** Inconsistent vertical rhythm breaks visual flow from homepage to HSE page
**Why it happens:** Not using existing `Section` component with standard `py-16 md:py-20` spacing
**How to avoid:** Wrap all non-hero sections in `<Section>` component, only override spacing for specific design intent
**Warning signs:** Page feels cramped or overly spacious compared to homepage, visual rhythm feels "off"

## Code Examples

Verified patterns from official sources and existing project code:

### Full HSE Page Component Structure
```tsx
// Source: Project structure pattern from Phase 2, existing page components
import { HSEHero } from '@/components/hse/HSEHero'
import { CommitmentList } from '@/components/hse/CommitmentList'
import { ParallaxImage } from '@/components/hse/ParallaxImage'
import { SafetyMetrics } from '@/components/hse/SafetyMetrics'
import { Section } from '@/components/layout/Section'
import { SEO } from '@/components/common/SEO'

export default function HSEPage() {
  return (
    <>
      <SEO
        title="Health, Safety & Environment"
        description="Jerash's commitment to safety excellence and HSE standards"
      />

      {/* Full-screen hero */}
      <HSEHero />

      {/* Commitment points section */}
      <Section>
        <CommitmentList />
      </Section>

      {/* First parallax image break */}
      <Section>
        <ParallaxImage src="/hse/ppe-equipment.jpeg" alt="PPE safety equipment" />
      </Section>

      {/* Additional content sections with interspersed parallax images */}
      {/* ... 2-3 more ParallaxImage breaks ... */}

      {/* Safety metrics at bottom (final impression) */}
      <SafetyMetrics />
    </>
  )
}
```

### Responsive Hero Text with Safe Zones
```tsx
// Source: Web research on hero section best practices, responsive typography
<div className="absolute inset-0 flex items-center">
  <Container>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="max-w-3xl text-white"
    >
      {/* Responsive text sizing: 2xl → 3xl → 4xl → 5xl → 6xl */}
      <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
        {t('hse.hero.commitment')}
      </h1>
      <p className="mt-4 text-lg md:text-xl text-white/90">
        {t('hse.hero.subtitle')}
      </p>
    </motion.div>
  </Container>
</div>
```

### Translation File Structure
```json
// Source: Existing i18n setup from Phase 1, I18N.md guide
// src/locales/en/hse.json
{
  "hero": {
    "commitment": "Our Commitment to Safety Excellence",
    "subtitle": "At Jerash, safety isn't just a priority—it's our foundation"
  },
  "commitments": {
    "1": "Zero harm philosophy - every team member returns home safely",
    "2": "Continuous training and certification for all field personnel",
    // ... 8 more commitment points
  },
  "metrics": {
    "incidentFreeHours": "Incident-Free Hours",
    "trainingHours": "Training Hours Completed",
    "certifiedEmployees": "Certified Safety Personnel"
  }
}

// src/locales/ar/hse.json
// NOTE: Requires native Arabic speaker for translation review (per context)
{
  "hero": {
    "commitment": "[Arabic translation needed]",
    "subtitle": "[Arabic translation needed]"
  }
}
```

### Parallax Image with Accessibility
```tsx
// Source: Framer Motion docs + accessibility best practices
export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y = useSpring(rawY, { stiffness: 300, damping: 30 })

  return (
    <div ref={ref} className="relative h-96 overflow-hidden rounded-lg">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy" // Native lazy loading for images below fold
        style={{ y }}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS-only parallax with `background-attachment: fixed` | Framer Motion `useScroll` + `useTransform` + `useSpring` | 2023-2024 | Better performance, smooth spring easing, respects reduced motion, works reliably on mobile |
| Intersection Observer + React state for scroll animations | Framer Motion `whileInView` with `viewport` prop | 2024 (Framer Motion v10+) | Simpler API, automatic cleanup, integrates with MotionConfig for reduced motion |
| Uniform dark overlay on hero images | Gradient overlays with multiple stops | 2025-2026 trend | Better text readability across image composition, more sophisticated visual design |
| Large accent numbers for numbered lists | Subtle muted numbers, content-focused | 2025-2026 design trend | Improved readability, less visual noise, better information hierarchy |
| Counter animations with `setInterval` | `useMotionValue` + `useTransform` | Framer Motion best practice | Avoids React re-renders, smoother 60fps animation, cleaner code |

**Deprecated/outdated:**
- **CSS `background-attachment: fixed` for parallax:** Poor mobile support, causes repaint issues, can't control easing
- **react-intersection-observer for scroll triggers:** Framer Motion's `whileInView` is more concise and integrates with existing MotionProvider
- **Manual reduced motion queries:** Global `MotionProvider` with `reducedMotion="user"` handles this automatically

## Open Questions

Things that couldn't be fully resolved:

1. **HSE field image selection and categorization**
   - What we know: 26 WhatsApp images exist in `public/` folder, need 3-4 for parallax breaks
   - What's unclear: Which images show PPE/safety equipment vs team-in-action, image quality/resolution suitability for hero
   - Recommendation: Review images during planning, categorize into `/public/hse/` subfolders (hero/, ppe/, team/, safety-signs/), select highest quality for hero background

2. **Exact HSE commitment points content**
   - What we know: 10 commitment points from company profile document exist
   - What's unclear: Exact wording of each point, whether they need editing for web presentation
   - Recommendation: Add to i18n files during planning, mark for Arabic translation review (per context note)

3. **Safety metrics actual data**
   - What we know: Need both incident-focused AND training-focused metrics (per context decision)
   - What's unclear: Actual numbers for incident-free hours, training hours, certification percentages
   - Recommendation: Use placeholder values in code (e.g., 1000000, 50000, 95), mark for client data verification

4. **Parallax intensity preference**
   - What we know: Context specifies "subtle and professional, not gimmicky"
   - What's unclear: Exact range preference (currently using -100px to 100px)
   - Recommendation: Start with ±100px range, make adjustable via component prop for easy iteration

## Sources

### Primary (HIGH confidence)
- Project codebase (`.planning/phases/02-animation-framework/`, existing components)
- FRAMER-MOTION.md - Animation patterns and best practices
- TAILWIND.md - Styling utilities and responsive patterns
- I18N.md - Bilingual content structure and RTL support
- Existing `AnimatedCounter` component (src/components/animations/AnimatedCounter.tsx)
- Existing `StaggerContainer` component (src/components/animations/StaggerContainer.tsx)
- Existing `FadeIn` component (src/components/animations/FadeIn.tsx)
- Phase 2 decisions on section spacing (py-16 md:py-20) and animation patterns

### Secondary (MEDIUM confidence)
- [React scroll animation — scroll-linked & parallax | Motion](https://motion.dev/docs/react-scroll-animations) - Official Framer Motion parallax documentation
- [Hero Section Design: Best Practices & Examples for 2026](https://www.perfectafternoon.com/2025/hero-section-design/) - 2026 hero design trends, overlay techniques
- [Designing Accessible Text Over Images: Best Practices](https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/) - WCAG contrast requirements, overlay patterns
- [Website Hero Section Best Practices + Examples](https://prismic.io/blog/website-hero-section) - Safe zones, viewport sizing guidance
- [25 Construction Website Examples in 2026](https://openasset.com/resources/construction-website-examples/) - HSE page design patterns from construction industry

### Tertiary (LOW confidence)
- [Build a Smooth Parallax Scroll with Framer Motion](https://blog.olivierlarose.com/tutorials/smooth-parallax-scroll) - Third-party tutorial on parallax patterns (verify techniques against official Motion docs)
- [Spring-based Parallax with Framer motion](https://samuelkraft.com/blog/spring-parallax-framer-motion-guide) - Community guide on spring easing for parallax
- [React Intersection Observer - A Practical Guide](https://www.builder.io/blog/react-intersection-observer) - Alternative approach (project uses Framer Motion `whileInView` instead)
- [React image optimization: Best techniques](https://uploadcare.com/blog/react-image-optimization-techniques/) - Image lazy loading best practices
- [Creating Accessible UI Animations](https://www.smashingmagazine.com/2023/11/creating-accessible-ui-animations/) - Reduced motion and performance guidance

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Project already has all dependencies from Phase 2, no new installations needed
- Architecture: HIGH - Patterns verified against existing codebase and FRAMER-MOTION.md guide
- Parallax implementation: MEDIUM-HIGH - Motion docs confirm patterns, community examples support spring easing approach
- Hero section design: HIGH - Multiple authoritative sources on 2026 best practices, WCAG compliance verified
- Numbered list UI: MEDIUM - Design research from multiple sources, aligned with context decisions
- Pitfalls: HIGH - Derived from existing component patterns, performance best practices, accessibility requirements

**Research date:** 2026-01-21
**Valid until:** 2026-02-28 (30 days for stable web technologies, Framer Motion v11 expected but patterns remain compatible)
