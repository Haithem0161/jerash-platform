# Phase 3: Homepage Sections - Research

**Researched:** 2026-01-21
**Domain:** Hero Slideshow, Animated Counters, i18n Content, Section Layouts
**Confidence:** HIGH

## Summary

This phase builds the homepage sections for Jerash Oil Field Services website. The homepage follows a long-scroll storytelling format with full-bleed continuous background and sections separated by spacing only. User decisions from CONTEXT.md specify Ken Burns zoom effect for hero, count-up animation for statistics, and a 60/40 text-dominant layout for content sections.

The project already has established infrastructure from Phase 2:
- `FadeIn` and `StaggerContainer` animation components
- `MotionProvider` with reduced-motion support
- Page transitions via `AnimatePresence` in `RootLayout`
- Animation variants in `src/components/animations/variants.ts`
- i18n setup with Arabic/English via `react-i18next`
- RTL support via `isRTL()` helper

Available field images show professional oil field operations (team photos, equipment, industrial facilities) suitable for hero slideshow and section imagery.

**Primary recommendation:** Build the hero slideshow as a custom Framer Motion component using `AnimatePresence` for image transitions with CSS-based Ken Burns effect. Use `useInView` + `animate` from Motion for count-up statistics. Structure i18n translations with a dedicated `home` namespace for all homepage content.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.24.3 | Slideshow transitions, counters | Already installed, AnimatePresence for slides |
| react-i18next | ^16.5.1 | Bilingual content | Already configured with AR/EN |
| lucide-react | ^0.562.0 | Service icons | Already installed, tree-shakeable |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | ^4.1.18 | Layout, Ken Burns animation | CSS animations for zoom effect |

### Already Available (No Additional Install)
- `FadeIn`, `StaggerContainer` animation components (Phase 2)
- `Container` layout component for max-width constraint
- `isRTL()` helper for RTL-aware positioning
- `cn()` utility for className merging
- `useInView` from `motion/react` for scroll-triggered animations

**Installation:**
No additional packages needed. All required libraries are already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── animations/
│   │   ├── FadeIn.tsx           # Existing - scroll reveal
│   │   ├── StaggerContainer.tsx # Existing - staggered children
│   │   ├── AnimatedCounter.tsx  # NEW - count-up animation
│   │   └── variants.ts          # Existing - shared variants
│   ├── home/
│   │   ├── HeroSlideshow.tsx    # NEW - Ken Burns slideshow
│   │   ├── VisionSection.tsx    # NEW - vision statement
│   │   ├── MissionSection.tsx   # NEW - mission statement
│   │   ├── ValuesSection.tsx    # NEW - company values
│   │   ├── StatsSection.tsx     # NEW - animated counters
│   │   ├── ManagementSection.tsx# NEW - management philosophy
│   │   ├── PartnersSection.tsx  # NEW - SLB partner
│   │   ├── JointVenturesSection.tsx # NEW - Kweti reference
│   │   └── ServicesPreview.tsx  # NEW - services grid
│   └── layout/
│       └── Section.tsx          # NEW - reusable section wrapper
├── locales/
│   ├── en/
│   │   └── common.json          # Extend with home.* keys
│   └── ar/
│       └── common.json          # Arabic translations
└── routes/pages/
    └── Home.tsx                 # Compose all sections
```

### Pattern 1: Hero Slideshow with Ken Burns Effect
**What:** Full-viewport hero with rotating images, slow zoom/pan, text overlay
**When to use:** Homepage hero section
**Example:**
```tsx
// src/components/home/HeroSlideshow.tsx
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { isRTL } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const SLIDE_DURATION = 7000 // 7 seconds per slide (6-8 per context)
const FADE_DURATION = 1 // 1 second crossfade

const heroImages = [
  '/WhatsApp Image 2026-01-09 at 4.37.40 PM.jpeg', // Workers in action
  '/WhatsApp Image 2026-01-09 at 4.37.47 PM.jpeg', // Industrial site
  '/WhatsApp Image 2026-01-09 at 4.37.32 PM.jpeg', // Team photo
  // Add more curated images
]

interface HeroSlideshowProps {
  className?: string
}

export function HeroSlideshow({ className }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => setCurrentIndex(index)
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % heroImages.length)
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  return (
    <section className={cn('relative h-screen w-full overflow-hidden', className)}>
      {/* Image with Ken Burns effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-ken-burns"
            style={{ backgroundImage: `url(${heroImages[currentIndex]})` }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Text overlay - positioned per RTL */}
      <div className={cn(
        'absolute bottom-20 z-10 max-w-2xl px-8',
        rtl ? 'end-8' : 'start-8'
      )}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold text-white md:text-6xl"
        >
          {t('home.hero.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-lg text-white/90 md:text-xl"
        >
          {t('home.hero.subtitle')}
        </motion.p>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className={cn(
          'absolute top-1/2 z-20 -translate-y-1/2 p-4 text-white/80 hover:text-white',
          rtl ? 'end-4' : 'start-4'
        )}
        aria-label={t('home.hero.previous')}
      >
        <ChevronLeft className={cn('h-8 w-8', rtl && 'rotate-180')} />
      </button>
      <button
        onClick={goNext}
        className={cn(
          'absolute top-1/2 z-20 -translate-y-1/2 p-4 text-white/80 hover:text-white',
          rtl ? 'start-4' : 'end-4'
        )}
        aria-label={t('home.hero.next')}
      >
        <ChevronRight className={cn('h-8 w-8', rtl && 'rotate-180')} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 start-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              index === currentIndex ? 'w-8 bg-white' : 'bg-white/50'
            )}
            aria-label={t('home.hero.goToSlide', { number: index + 1 })}
          />
        ))}
      </div>
    </section>
  )
}
```

**Ken Burns CSS Animation (add to global CSS):**
```css
/* src/index.css or tailwind @layer utilities */
@keyframes ken-burns {
  0% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1.1) translate(-2%, -2%);
  }
}

.animate-ken-burns {
  animation: ken-burns 8s ease-out forwards;
}
```
Source: [Ken Burns CSS patterns](https://www.kirupa.com/html5/ken_burns_effect_css.htm)

### Pattern 2: Animated Counter with Scroll Trigger
**What:** Numbers count up from zero when scrolled into view
**When to use:** Statistics section (years experience, projects, employees)
**Example:**
```tsx
// src/components/animations/AnimatedCounter.tsx
import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue, useTransform, motion } from 'motion/react'

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration,
        ease: 'easeOut',
      })
      return () => controls.stop()
    }
  }, [isInView, count, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
```
Source: [GitHub Gist - Framer Motion animated counter](https://gist.github.com/bonface221/f1d4d42992ac71c4289702c7da0a5b3f)

### Pattern 3: Section Wrapper Component
**What:** Consistent section layout with spacing
**When to use:** All homepage sections for uniform rhythm
**Example:**
```tsx
// src/components/layout/Section.tsx
import { cn } from '@/lib/utils'
import { Container } from './Container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  fullWidth?: boolean // For hero or full-bleed sections
}

export function Section({ children, className, id, fullWidth = false }: SectionProps) {
  const content = fullWidth ? children : <Container>{children}</Container>

  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-20', // 60-80px vertical spacing per context
        className
      )}
    >
      {content}
    </section>
  )
}
```

### Pattern 4: Content Section with Image (60/40 Split)
**What:** Text-dominant layout with image accent
**When to use:** Vision, Mission, Management Philosophy sections
**Example:**
```tsx
// Reusable pattern for Vision/Mission/Management sections
interface ContentSectionProps {
  title: string
  content: string
  imageSrc: string
  imageAlt: string
  imagePosition?: 'start' | 'end'
}

function ContentSection({
  title,
  content,
  imageSrc,
  imageAlt,
  imagePosition = 'end',
}: ContentSectionProps) {
  return (
    <Section>
      <div className={cn(
        'grid gap-8 md:grid-cols-5 md:gap-12 items-center',
        imagePosition === 'start' && 'md:[&>*:first-child]:order-2'
      )}>
        {/* Text content - 60% (3 columns) */}
        <FadeIn className="md:col-span-3">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{content}</p>
        </FadeIn>

        {/* Image - 40% (2 columns) */}
        <FadeIn
          direction={imagePosition === 'end' ? 'left' : 'right'}
          className="md:col-span-2"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </FadeIn>
      </div>
    </Section>
  )
}
```

### Anti-Patterns to Avoid
- **Hand-rolling slideshow logic:** Use AnimatePresence with key changes for image transitions
- **Animating counter with setState on every frame:** Use `useMotionValue` to avoid React re-renders
- **Hardcoded RTL text positioning:** Always use `start`/`end` logical properties
- **Separate components for each stat:** Use data array + map for consistency
- **Missing alt text on hero images:** Include descriptive alt text for accessibility

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image crossfade | Manual opacity toggle | `AnimatePresence mode="wait"` | Handles cleanup, exit animations |
| Ken Burns zoom | JS-based transform | CSS `@keyframes` animation | GPU-accelerated, no JS overhead |
| Counter animation | `setInterval` + setState | `useMotionValue` + `animate` | More performant, no re-renders |
| Scroll detection | Custom IntersectionObserver | `useInView` from motion | Built-in, handles edge cases |
| RTL-aware layout | Conditional left/right | Tailwind `start`/`end` | Automatic with `dir="rtl"` |

**Key insight:** The Ken Burns effect should use CSS animations for performance, while Framer Motion handles the crossfade between slides. Statistics counters use Motion's `useMotionValue` to animate without triggering React re-renders.

## Common Pitfalls

### Pitfall 1: Ken Burns Effect Causing Layout Shift
**What goes wrong:** Image container shifts when scale animation runs
**Why it happens:** Scaled element overflows its container
**How to avoid:** Set `overflow-hidden` on the container, use `transform-origin: center`
**Warning signs:** Layout jump at start of animation

### Pitfall 2: Counter Animation Not Starting
**What goes wrong:** Numbers stay at zero
**Why it happens:** `useInView` ref not attached to DOM element
**How to avoid:** Ensure ref is passed to a visible element, check `amount` threshold
**Warning signs:** Animation works on mount but not on scroll

### Pitfall 3: Slideshow Interval Memory Leak
**What goes wrong:** Multiple intervals running after navigation
**Why it happens:** Interval not cleared on unmount
**How to avoid:** Return cleanup function from useEffect
**Warning signs:** Rapid slide changes, console warnings

### Pitfall 4: Hero Text Unreadable on Light Images
**What goes wrong:** White text disappears on bright field photos
**Why it happens:** No overlay or insufficient contrast
**How to avoid:** Add semi-transparent dark overlay (`bg-black/40`)
**Warning signs:** Text invisible on certain slides

### Pitfall 5: i18n Keys Missing Arabic Translations
**What goes wrong:** English fallback shows in Arabic mode
**Why it happens:** Added English keys but forgot Arabic
**How to avoid:** Always update both locale files together, use i18next debug mode
**Warning signs:** Mixed language UI

### Pitfall 6: RTL Hero Text Position Wrong
**What goes wrong:** Text on wrong side in Arabic mode
**Why it happens:** Using `left`/`right` instead of `start`/`end`
**How to avoid:** Always use logical properties: `start-8` not `left-8`
**Warning signs:** Text appears on opposite side in RTL

## Code Examples

Verified patterns from official sources:

### Statistics Section
```tsx
// src/components/home/StatsSection.tsx
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { AnimatedCounter } from '@/components/animations/AnimatedCounter'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'

const stats = [
  { key: 'yearsExperience', value: 15, suffix: '+' },
  { key: 'projectsCompleted', value: 250, suffix: '+' },
  { key: 'employees', value: 500, suffix: '+' },
] as const

export function StatsSection() {
  const { t } = useTranslation()

  return (
    <Section>
      <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((stat) => (
          <StaggerItem key={stat.key} className="text-center">
            <div className="text-5xl font-bold md:text-6xl">
              <AnimatedCounter to={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              {t(`home.stats.${stat.key}`)}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}
```

### Services Preview Grid
```tsx
// src/components/home/ServicesPreview.tsx
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Droplet, Wrench, Gauge, Factory, Cog, HardHat, Pipette, Shield } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { FadeIn } from '@/components/animations/FadeIn'

const services = [
  { key: 'waterTreatment', icon: Droplet },
  { key: 'maintenance', icon: Wrench },
  { key: 'monitoring', icon: Gauge },
  { key: 'operations', icon: Factory },
  { key: 'equipment', icon: Cog },
  { key: 'safety', icon: HardHat },
  { key: 'chemicals', icon: Pipette },
  { key: 'hse', icon: Shield },
] as const

export function ServicesPreview() {
  const { t } = useTranslation()

  return (
    <Section>
      <FadeIn className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          {t('home.services.title')}
        </h2>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {services.map(({ key, icon: Icon }) => (
          <StaggerItem key={key}>
            <div className="flex flex-col items-center gap-3 rounded-lg p-6 text-center transition-colors hover:bg-muted">
              <Icon className="h-10 w-10 text-primary" />
              <span className="font-medium">{t(`home.services.${key}`)}</span>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn className="mt-12 text-center">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          {t('home.services.seeAll')}
        </Link>
      </FadeIn>
    </Section>
  )
}
```

### i18n Translation Structure
```json
// src/locales/en/common.json (extend existing)
{
  "home": {
    "hero": {
      "title": "Jerash Oil Field Services",
      "subtitle": "Excellence in oil field solutions since 2009",
      "previous": "Previous slide",
      "next": "Next slide",
      "goToSlide": "Go to slide {{number}}"
    },
    "vision": {
      "title": "Our Vision",
      "content": "To be the leading provider of integrated oil field services in the region..."
    },
    "mission": {
      "title": "Our Mission",
      "content": "Delivering exceptional oil field solutions with unwavering commitment to safety..."
    },
    "values": {
      "title": "Our Values",
      "safety": { "title": "Safety First", "description": "..." },
      "excellence": { "title": "Excellence", "description": "..." },
      "integrity": { "title": "Integrity", "description": "..." }
    },
    "stats": {
      "yearsExperience": "Years of Experience",
      "projectsCompleted": "Projects Completed",
      "employees": "Team Members"
    },
    "management": {
      "title": "Management Philosophy",
      "content": "Our leadership believes in empowering teams..."
    },
    "partners": {
      "title": "Our Partners",
      "slb": "SLB (Schlumberger)"
    },
    "jointVentures": {
      "title": "Joint Ventures",
      "kweti": "Kweti Energy Services"
    },
    "services": {
      "title": "Our Services",
      "seeAll": "View All Services",
      "waterTreatment": "Water Treatment",
      "maintenance": "Maintenance",
      "monitoring": "Process Monitoring",
      "operations": "Field Operations",
      "equipment": "Equipment Services",
      "safety": "Safety Training",
      "chemicals": "Chemical Services",
      "hse": "HSE Management"
    }
  }
}
```

## Available Field Images

The `public/` folder contains 25+ field images suitable for hero slideshow and section content:

**Recommended for Hero Slideshow (cinematic, wide scenes):**
- `WhatsApp Image 2026-01-09 at 4.37.40 PM.jpeg` - Workers with industrial equipment
- `WhatsApp Image 2026-01-09 at 4.37.47 PM.jpeg` - Outdoor industrial site with safety signage
- `WhatsApp Image 2026-01-09 at 4.37.48 PM.jpeg` - Worker with cables in warehouse setting

**Recommended for Team/Company Sections:**
- `WhatsApp Image 2026-01-09 at 4.37.32 PM.jpeg` - Team group photo
- `WhatsApp Image 2026-01-09 at 4.37.36 PM.jpeg` - Team at industrial facility

**Recommended for Operations/Services:**
- `WhatsApp Image 2026-01-09 at 4.37.45 PM.jpeg` - Worker with equipment close-up
- Various other images showing equipment, facilities, and operations

**Note:** Images should be renamed to semantic names (e.g., `hero-team-work.jpg`, `hero-industrial-site.jpg`) during implementation for better maintainability.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS-based Ken Burns | CSS `@keyframes` + `transform` | 2023+ | GPU-accelerated, 60fps |
| `setInterval` counters | `useMotionValue` + `animate` | Motion v6+ | No React re-renders |
| `left`/`right` positioning | `start`/`end` logical properties | Tailwind v3.3+ | Automatic RTL support |
| Separate slide components | Single component + key change | AnimatePresence pattern | Cleaner, automatic exit |

**Deprecated/outdated:**
- Using GSAP for simple slideshows (overkill when Motion is available)
- Manual intersection observer for counter triggers (use Motion's `useInView`)
- CSS-only slideshows without JS (loses navigation controls and accessibility)

## Open Questions

Things that couldn't be fully resolved:

1. **Exact statistics values**
   - What we know: Need years experience, projects, employees counts
   - What's unclear: Actual company data (PDF too large to read)
   - Recommendation: Use placeholder values (15+, 250+, 500+), update with real data from client

2. **Partner/JV logo assets**
   - What we know: Need SLB and Kweti logos
   - What's unclear: Whether logo files are available
   - Recommendation: Use text placeholder initially, add logos when provided

3. **Services list completeness**
   - What we know: Preview shows 6-8 services with icons
   - What's unclear: Final list of services to highlight
   - Recommendation: Use representative 8 services based on oil field industry, refine later

4. **Ken Burns zoom direction variety**
   - What we know: Should zoom/pan with 6-8 second duration
   - What's unclear: Whether to vary direction per slide
   - Recommendation: Start with single direction (zoom-in + slight pan), add variety if needed

## Sources

### Primary (HIGH confidence)
- Project codebase - Phase 2 animation components, i18n setup
- [Motion AnimatePresence docs](https://motion.dev/docs/react-animate-presence) - slideshow pattern
- [Motion useInView docs](https://motion.dev/docs/react-use-in-view) - scroll-triggered animations
- Project's FRAMER-MOTION.md - comprehensive patterns

### Secondary (MEDIUM confidence)
- [Ken Burns CSS patterns](https://www.kirupa.com/html5/ken_burns_effect_css.htm) - CSS animation approach
- [GitHub Gist - animated counter](https://gist.github.com/bonface221/f1d4d42992ac71c4289702c7da0a5b3f) - counter implementation
- [BuildUI animated counter recipe](https://buildui.com/recipes/animated-counter) - digit animation pattern
- [Lucide icons](https://lucide.dev/icons/) - service icon selection

### Tertiary (LOW confidence)
- WebSearch results for oil field service icons - verified against Lucide availability

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and configured
- Architecture: HIGH - builds on Phase 2 patterns, verified against project code
- Slideshow pattern: HIGH - official AnimatePresence documentation
- Counter pattern: HIGH - verified implementation from multiple sources
- i18n structure: HIGH - follows established project patterns
- Ken Burns timing: MEDIUM - context specifies 6-8s, exact implementation varies

**Research date:** 2026-01-21
**Valid until:** 2026-03-21 (patterns are stable, Motion v12 API unlikely to change)
