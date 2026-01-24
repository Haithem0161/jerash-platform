# Phase 4: Services Page - Research

**Researched:** 2026-01-21
**Domain:** React filterable cards, modal dialogs, category tabs, bilingual content
**Confidence:** HIGH

## Summary

This phase implements a services listing page with 26+ services organized into 4 categories (Production, Wireline, Consultancy, Other). Users can filter by category using horizontal tabs with an animated underline indicator, view service cards in a responsive grid, and click cards to open a modal with detailed descriptions.

The implementation leverages existing codebase patterns: Radix UI Dialog (already installed), Framer Motion animations (established variants), StaggerContainer/StaggerItem for grid reveals, and the i18n structure for bilingual content. The key new patterns are: animated tab underline using `layoutId`, `AnimatePresence` with `mode="popLayout"` for filter transitions, and a controlled Dialog component.

**Primary recommendation:** Use shadcn Dialog component with Radix UI primitives for the modal, Framer Motion `layoutId` for the sliding tab indicator, and `AnimatePresence` with `mode="popLayout"` for smooth grid filtering animations.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @radix-ui/react-dialog | 1.1.15 | Modal dialogs | Already installed, accessible by default, handles focus trapping |
| motion/react | 12.24.3 | Animations | Already used, provides AnimatePresence for filtering |
| react-i18next | 16.5.1 | Translations | Already configured with Arabic pluralization |
| lucide-react | 0.562.0 | Service icons | Already used, 1000+ icons available |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn Dialog | - | Pre-styled modal | Add via `pnpm dlx shadcn@latest add dialog` |
| @radix-ui/react-tabs | 1.1.13 | Already installed | Could use for tab primitives, but custom solution preferred for animated underline |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom animated tabs | Radix Tabs | Radix Tabs harder to animate underline; custom gives more control |
| shadcn Dialog | Custom modal | shadcn provides consistent styling, accessibility built-in |
| AnimatePresence popLayout | CSS transitions | CSS can't handle exit animations when items removed from DOM |

**Installation:**
```bash
# Add shadcn Dialog component (uses existing @radix-ui/react-dialog)
pnpm dlx shadcn@latest add dialog
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── routes/pages/
│   └── Services.tsx                 # Services page route component
├── components/services/
│   ├── ServicesGrid.tsx             # Grid container with filter + cards
│   ├── ServiceCard.tsx              # Individual service card
│   ├── ServiceModal.tsx             # Service detail modal
│   ├── CategoryTabs.tsx             # Animated category filter tabs
│   └── index.ts                     # Barrel export
├── data/
│   └── services.ts                  # Service data (typed, with icon mappings)
└── locales/
    ├── en/
    │   └── services.json            # English service translations
    └── ar/
        └── services.json            # Arabic service translations
```

### Pattern 1: Animated Category Tabs with layoutId
**What:** Sliding underline indicator that animates between active tabs
**When to use:** Category filters where visual continuity matters
**Example:**
```typescript
// Source: https://buildui.com/recipes/animated-tabs
import { motion } from 'motion/react'
import { useState } from 'react'

const categories = [
  { id: 'all', labelKey: 'services.categories.all' },
  { id: 'production', labelKey: 'services.categories.production' },
  { id: 'wireline', labelKey: 'services.categories.wireline' },
  { id: 'consultancy', labelKey: 'services.categories.consultancy' },
  { id: 'other', labelKey: 'services.categories.other' },
] as const

type CategoryId = typeof categories[number]['id']

function CategoryTabs({
  activeCategory,
  onCategoryChange
}: {
  activeCategory: CategoryId
  onCategoryChange: (id: CategoryId) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-1" role="tablist">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          role="tab"
          aria-selected={activeCategory === category.id}
          className={cn(
            'relative px-4 py-2 text-sm font-medium transition-colors',
            activeCategory === category.id
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {activeCategory === category.id && (
            <motion.span
              layoutId="category-underline"
              className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {t(category.labelKey)}
        </button>
      ))}
    </div>
  )
}
```

### Pattern 2: Filtered Grid with AnimatePresence
**What:** Grid items animate in/out when filter changes
**When to use:** Any filterable list/grid
**Example:**
```typescript
// Source: https://motion.dev/docs/react-animate-presence
import { motion, AnimatePresence } from 'motion/react'

function ServicesGrid({ services, activeCategory }: Props) {
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory)

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      style={{ position: 'relative' }} // Required for popLayout
    >
      <AnimatePresence mode="popLayout">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05, // Stagger effect
            }}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
```

### Pattern 3: Controlled Dialog with Service Data
**What:** Modal receives service data via state, not trigger
**When to use:** When modal trigger is separate from data source
**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/components/dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ServiceModalProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ServiceModal({ service, open, onOpenChange }: ServiceModalProps) {
  const { t, i18n } = useTranslation()
  const rtl = isRTL(i18n.language)

  if (!service) return null

  const Icon = service.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className={cn('flex items-center gap-3', rtl && 'flex-row-reverse')}>
            <Icon className="h-8 w-8 text-primary" />
            <DialogTitle>{t(`services.items.${service.id}.title`)}</DialogTitle>
          </div>
          <DialogDescription>
            {t(`services.items.${service.id}.description`)}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

### Anti-Patterns to Avoid
- **Using index as key in filtered lists:** Always use stable IDs (service.id) for AnimatePresence to track correctly
- **Inline onClick handlers that create new functions:** Extract to useCallback for React Compiler optimization
- **Nested AnimatePresence:** One AnimatePresence per animated list is sufficient
- **Animating width/height directly:** Use scale transform instead for GPU acceleration

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal accessibility | Custom focus trap, ARIA | Radix Dialog | Focus management, screen reader, keyboard nav handled |
| Tab keyboard navigation | Custom arrow key handlers | Radix Tabs or custom with ARIA | Complex edge cases (RTL, wrap-around) |
| Exit animations | CSS display: none | AnimatePresence | CSS can't animate elements being removed |
| Layout shifts during filter | Manual position calculations | motion layout + popLayout | FLIP animation handled automatically |

**Key insight:** Radix UI primitives handle accessibility edge cases (focus restoration, scroll lock, screen reader announcements) that take weeks to implement correctly.

## Common Pitfalls

### Pitfall 1: AnimatePresence mode="popLayout" Without Relative Parent
**What goes wrong:** Exit animations jump or don't animate
**Why it happens:** popLayout uses position: absolute; needs relative parent
**How to avoid:** Always set `style={{ position: 'relative' }}` on parent motion.div
**Warning signs:** Items jump to wrong position during exit

### Pitfall 2: layoutId Not Unique Across Components
**What goes wrong:** Multiple underlines animate to wrong positions
**Why it happens:** layoutId is global; same ID used in different components
**How to avoid:** Prefix with component name: `layoutId="category-tabs-underline"`
**Warning signs:** Underline appears in wrong component on tab switch

### Pitfall 3: Dialog Content Without DialogTitle
**What goes wrong:** Console error, accessibility warning
**Why it happens:** Radix Dialog requires title for aria-labelledby
**How to avoid:** Always include DialogTitle (use VisuallyHidden if not visible)
**Warning signs:** "Dialog.Title is a required part" console error

### Pitfall 4: Stagger Delay Accumulates on Filter Change
**What goes wrong:** Last items take too long to appear (26 items * 0.1s = 2.6s)
**Why it happens:** Delay based on array index
**How to avoid:** Cap stagger at reasonable amount: `delay: Math.min(index * 0.05, 0.5)`
**Warning signs:** User perceives lag after filter change

### Pitfall 5: RTL Tab Order Incorrect
**What goes wrong:** Visual order doesn't match DOM order in RTL
**Why it happens:** CSS flex-direction not accounting for RTL
**How to avoid:** Use `gap` for spacing (auto-reverses), not manual margins
**Warning signs:** Tab navigation order wrong in Arabic

## Code Examples

Verified patterns from official sources:

### Service Data Structure
```typescript
// src/data/services.ts
import type { LucideIcon } from 'lucide-react'
import {
  Droplet, Wrench, Gauge, Factory, Cog, Pipette,
  Cable, TestTube, Zap, Layers, ClipboardCheck,
  Truck, BookOpen, HardHat, Fuel, FileSearch,
  Ship, Target, Settings, FlaskConical, Package,
  GraduationCap, Boxes, Flame, Activity, Compass
} from 'lucide-react'

export type ServiceCategory = 'production' | 'wireline' | 'consultancy' | 'other'

export interface Service {
  id: string
  category: ServiceCategory
  icon: LucideIcon
}

export const services: Service[] = [
  // Production Services (8)
  { id: 'coiledTubing', category: 'production', icon: Cog },
  { id: 'drillingFluid', category: 'production', icon: Droplet },
  { id: 'cementing', category: 'production', icon: Layers },
  { id: 'nitrogen', category: 'production', icon: FlaskConical },
  { id: 'filtration', category: 'production', icon: Pipette },
  { id: 'pipelines', category: 'production', icon: Cable },
  { id: 'waterProduction', category: 'production', icon: Droplet },
  { id: 'artificialLift', category: 'production', icon: Target },

  // Wireline Services (7)
  { id: 'wirelineLogging', category: 'wireline', icon: Activity },
  { id: 'wellTesting', category: 'wireline', icon: TestTube },
  { id: 'stimulationPumping', category: 'wireline', icon: Zap },
  { id: 'thruTubing', category: 'wireline', icon: Wrench },
  { id: 'slickline', category: 'wireline', icon: Cable },
  { id: 'completions', category: 'wireline', icon: Settings },
  { id: 'scaffolding', category: 'wireline', icon: Boxes },

  // Consultancy Services (8)
  { id: 'importMachinery', category: 'consultancy', icon: Truck },
  { id: 'importChemicals', category: 'consultancy', icon: FlaskConical },
  { id: 'importGasStation', category: 'consultancy', icon: Fuel },
  { id: 'processing', category: 'consultancy', icon: Factory },
  { id: 'customsClearance', category: 'consultancy', icon: ClipboardCheck },
  { id: 'explosives', category: 'consultancy', icon: Flame },
  { id: 'inspection', category: 'consultancy', icon: FileSearch },
  { id: 'training', category: 'consultancy', icon: GraduationCap },

  // Other Services (3)
  { id: 'fuelStations', category: 'other', icon: Fuel },
  { id: 'mudLogging', category: 'other', icon: Gauge },
  { id: 'integratedDrilling', category: 'other', icon: Compass },
]
```

### Translation File Structure
```json
// src/locales/en/services.json
{
  "title": "Our Services",
  "categories": {
    "all": "All",
    "production": "Production",
    "wireline": "Wireline",
    "consultancy": "Consultancy",
    "other": "Other"
  },
  "items": {
    "coiledTubing": {
      "title": "Coiled Tubing",
      "shortDescription": "Advanced coiled tubing services for well intervention",
      "description": "Comprehensive coiled tubing services including well cleanouts, nitrogen lifting, acidizing, and fracturing operations. Our experienced crews operate state-of-the-art equipment to deliver safe and efficient solutions."
    },
    "drillingFluid": {
      "title": "Drilling Fluid",
      "shortDescription": "Custom drilling fluid solutions for optimal performance",
      "description": "Complete drilling fluid services including mud engineering, testing, and supply. We provide water-based, oil-based, and synthetic-based systems tailored to your specific drilling conditions."
    }
    // ... remaining 24 services
  }
}
```

### Service Card Component
```typescript
// src/components/services/ServiceCard.tsx
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Service } from '@/data/services'

interface ServiceCardProps {
  service: Service
  onClick: () => void
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const { t } = useTranslation('services')
  const Icon = service.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border p-6 text-center',
        'transition-colors duration-200',
        'hover:border-primary hover:bg-muted/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'w-full'
      )}
    >
      <Icon className="h-10 w-10 text-primary" />
      <span className="font-medium">{t(`items.${service.id}.title`)}</span>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {t(`items.${service.id}.shortDescription`)}
      </p>
    </button>
  )
}
```

### Complete Services Page
```typescript
// src/routes/pages/Services.tsx
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/layout/Section'
import { FadeIn } from '@/components/animations/FadeIn'
import { CategoryTabs } from '@/components/services/CategoryTabs'
import { ServicesGrid } from '@/components/services/ServicesGrid'
import { ServiceModal } from '@/components/services/ServiceModal'
import { services, type Service, type ServiceCategory } from '@/data/services'
import { SEO } from '@/components/common/SEO'

type FilterCategory = ServiceCategory | 'all'

export default function ServicesPage() {
  const { t } = useTranslation('services')
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleServiceClick = useCallback((service: Service) => {
    setSelectedService(service)
    setModalOpen(true)
  }, [])

  const handleCategoryChange = useCallback((category: FilterCategory) => {
    setActiveCategory(category)
  }, [])

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory)

  return (
    <>
      <SEO
        title={t('title')}
        description={t('description')}
      />
      <Section>
        <FadeIn className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            {t('title')}
          </h1>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-8">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </FadeIn>

        <ServicesGrid
          services={filteredServices}
          onServiceClick={handleServiceClick}
        />
      </Section>

      <ServiceModal
        service={selectedService}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion package | motion/react import | Motion v12 | Same API, new import path |
| CSS transitions for filters | AnimatePresence mode="popLayout" | 2023 | Proper exit animations |
| Manual ARIA for dialogs | Radix UI Dialog | Established | Built-in accessibility |
| @react-spring/web | Framer Motion | Project choice | Single animation library |

**Deprecated/outdated:**
- Using `LayoutGroup` unnecessarily: Only needed when coordinating layout between separate DOM trees
- `mode="wait"` for filter grids: Use `mode="popLayout"` for smoother transitions
- Custom focus trapping: Radix handles this automatically

## Open Questions

Things that couldn't be fully resolved:

1. **Service Icon Selection**
   - What we know: Lucide has general icons (Cog, Wrench, Pipette, etc.)
   - What's unclear: Best icon mapping for specialized oil field services
   - Recommendation: Use metaphorical icons (Cog for Coiled Tubing, Droplet for Drilling Fluid), finalize during implementation

2. **Short Description Length**
   - What we know: Cards show 1-2 lines preview with `line-clamp-2`
   - What's unclear: Exact character count for Arabic vs English
   - Recommendation: Test with longest service description, adjust line-clamp if needed

## Sources

### Primary (HIGH confidence)
- Codebase: `/src/components/animations/variants.ts` - Established animation timing
- Codebase: `/src/components/home/ServicesPreview.tsx` - Card pattern reference
- Codebase: `/src/lib/i18n.ts` - RTL detection pattern
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog) - Dialog component API
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) - Accessibility features

### Secondary (MEDIUM confidence)
- [Build UI Animated Tabs](https://buildui.com/recipes/animated-tabs) - layoutId pattern for sliding indicator
- [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence) - popLayout mode for filter animations
- [Lucide Icons](https://lucide.dev/icons/) - Available icon set

### Tertiary (LOW confidence)
- Various Medium articles on AnimatePresence patterns - general guidance only

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project
- Architecture: HIGH - Follows existing codebase patterns
- Pitfalls: MEDIUM - Based on documented issues, not project-specific testing
- Animation patterns: HIGH - Verified with official sources and existing codebase

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (30 days - stable patterns)
