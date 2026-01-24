# Phase 1: Foundation & Layout - Research

**Researched:** 2026-01-21
**Domain:** Bilingual (Arabic/English) navigation, RTL/LTR switching, responsive shell
**Confidence:** HIGH

## Summary

This phase establishes the bilingual navigation foundation for the Jerash For Oil Field Services website. The codebase already has a solid foundation with react-i18next configured, basic i18n provider with RTL switching, and a skeleton Header/Footer structure. The research confirms that Tailwind CSS v4's logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) provide the cleanest RTL support without additional plugins.

The key work involves: (1) enhancing the language switcher to be a dropdown per user request, (2) adding fade transitions during language changes, (3) implementing the sticky header with navigation links and underline hover effects, (4) building a mobile hamburger menu with Sheet component, (5) creating a footer with office tabs/accordion, and (6) building a logo loading animation overlay for first session visits.

**Primary recommendation:** Build on existing i18n infrastructure. Use shadcn Sheet for mobile menu, Framer Motion AnimatePresence for all transitions, and sessionStorage to track first visit for loading overlay.

## Standard Stack

The established libraries/tools for this phase (all already installed):

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-i18next | ^16.5.1 | Internationalization | Industry standard for React i18n, already configured |
| i18next-browser-languagedetector | ^8.2.0 | Language detection | Auto-detects from localStorage/navigator |
| framer-motion (motion) | ^12.24.3 | Animations | Best-in-class React animation library |
| tailwindcss | ^4.1.18 | Styling/RTL | Native logical property support |
| zustand | ^5.0.9 | State management | Already in use for UI state |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.562.0 | Icons | Already installed, use for hamburger/language icons |
| @radix-ui/react-dropdown-menu | ^2.1.16 | Dropdown primitive | For language switcher dropdown |
| tw-animate-css | ^1.4.0 | CSS animations | Already integrated in App.css |

### Components to Add (via shadcn CLI)
| Component | Purpose | Command |
|-----------|---------|---------|
| sheet | Mobile navigation drawer | `pnpm dlx shadcn@latest add sheet` |
| tabs | Footer office locations | `pnpm dlx shadcn@latest add tabs` |
| accordion | Alternative to tabs for offices | `pnpm dlx shadcn@latest add accordion` |
| separator | Visual dividers | `pnpm dlx shadcn@latest add separator` |

**Installation:**
```bash
pnpm dlx shadcn@latest add sheet tabs accordion separator
```

## Architecture Patterns

### Recommended Project Structure (extends existing)
```
src/
├── components/
│   ├── common/
│   │   ├── LanguageSwitcher.tsx  # Convert to dropdown
│   │   ├── LoadingOverlay.tsx    # NEW: Logo animation overlay
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx            # Enhance with nav links, mobile menu trigger
│   │   ├── Footer.tsx            # Enhance with office tabs, contact info
│   │   ├── MobileMenu.tsx        # NEW: Sheet-based mobile navigation
│   │   ├── Navigation.tsx        # NEW: Desktop nav with underline hovers
│   │   └── ...
│   └── ui/
│       ├── sheet.tsx             # Add via shadcn
│       ├── tabs.tsx              # Add via shadcn
│       └── ...
├── locales/
│   ├── en/
│   │   └── common.json           # Expand with nav, footer translations
│   └── ar/
│       └── common.json           # Expand with nav, footer translations
├── stores/
│   └── useUIStore.ts             # Already has mobileMenuOpen state
└── hooks/
    └── useFirstVisit.ts          # NEW: sessionStorage hook for loading overlay
```

### Pattern 1: RTL-aware Components with Logical Properties
**What:** Use Tailwind's logical properties instead of physical direction properties
**When to use:** All spacing, positioning, and alignment in layout components
**Example:**
```tsx
// Source: Tailwind CSS v4 docs - logical properties
// Instead of: ml-4 mr-2 pl-6 pr-4 left-0 right-0 text-left
// Use: ms-4 me-2 ps-6 pe-4 start-0 end-0 text-start

// For borders that need directional flipping:
// Instead of: border-l-4 rounded-l-lg
// Use: border-s-4 rounded-s-lg

// Icons that should flip in RTL (arrows, chevrons):
<ChevronRight className="rtl:rotate-180" />
```

### Pattern 2: Language Change with Fade Transition
**What:** Wrap content in AnimatePresence with key based on language
**When to use:** Main content area to create fade effect on language switch
**Example:**
```tsx
// Source: Framer Motion docs - AnimatePresence
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

function PageContent({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={i18n.language}  // Triggers animation on language change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Pattern 3: Dropdown Language Switcher
**What:** Use DropdownMenu for language selection per user decision
**When to use:** Header language switcher component
**Example:**
```tsx
// Source: shadcn/ui dropdown-menu, user decision from CONTEXT.md
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

const languages = {
  en: 'English',
  ar: 'عربي',
}

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 me-2" />
          {languages[i18n.language as keyof typeof languages]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={cn(i18n.language === code && 'bg-accent')}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Pattern 4: Mobile Menu with Sheet
**What:** Use shadcn Sheet component for off-canvas mobile navigation
**When to use:** Mobile viewport hamburger menu
**Example:**
```tsx
// Source: shadcn/ui sheet, Framer Motion for hamburger animation
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('common.menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="start" className="w-[300px] rtl:left-auto rtl:right-0">
        {/* Navigation links */}
      </SheetContent>
    </Sheet>
  )
}
```

### Pattern 5: Session-based Loading Overlay
**What:** Show logo animation only on first visit per session
**When to use:** Initial page load, tracked via sessionStorage
**Example:**
```tsx
// Source: Framer Motion AnimatePresence, sessionStorage pattern
function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem('hasVisited')
  })

  const markVisited = useCallback(() => {
    sessionStorage.setItem('hasVisited', 'true')
    setIsFirstVisit(false)
  }, [])

  return { isFirstVisit, markVisited }
}

function LoadingOverlay() {
  const { isFirstVisit, markVisited } = useFirstVisit()
  const [showLoading, setShowLoading] = useState(isFirstVisit)

  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setShowLoading(false)
        markVisited()
      }, 1500)  // 1.5 second duration per user decision
      return () => clearTimeout(timer)
    }
  }, [isFirstVisit, markVisited])

  return (
    <AnimatePresence>
      {showLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="/Jerash-logo-color.png"
            alt="Jerash"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]  // Smooth easing
            }}
            className="w-48 h-auto"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Pattern 6: Footer with Office Tabs
**What:** Use Tabs component for 3 office locations
**When to use:** Footer office information section
**Example:**
```tsx
// Source: shadcn/ui tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function OfficeLocations() {
  const { t } = useTranslation()

  return (
    <Tabs defaultValue="basrah">
      <TabsList>
        <TabsTrigger value="basrah">{t('footer.offices.basrah.name')}</TabsTrigger>
        <TabsTrigger value="erbil">{t('footer.offices.erbil.name')}</TabsTrigger>
        <TabsTrigger value="baghdad">{t('footer.offices.baghdad.name')}</TabsTrigger>
      </TabsList>
      <TabsContent value="basrah">
        {/* Office details */}
      </TabsContent>
      {/* ... other offices */}
    </Tabs>
  )
}
```

### Anti-Patterns to Avoid
- **Physical direction classes:** Don't use `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right` - use logical equivalents instead
- **Hardcoded text:** Never put any visible text directly in JSX - always use translation keys
- **Separate RTL stylesheets:** Don't create separate RTL CSS - Tailwind logical properties handle this automatically
- **Manual direction checks:** Don't write `if (language === 'ar')` for styling - let CSS handle it via `dir="rtl"` attribute
- **Animating layout properties:** Don't animate `width`, `height`, `left`, `top` - use `transform` and `opacity` only

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RTL layout switching | Manual CSS direction rules | Tailwind logical properties + `dir` attribute | Tailwind v4 handles this automatically |
| Language persistence | Custom localStorage logic | i18next-browser-languagedetector (already configured) | Already implemented in lib/i18n.ts |
| Mobile menu drawer | Custom slide-in panel | shadcn Sheet component | Built on Radix, accessible, animated |
| Dropdown menu | Custom dropdown implementation | shadcn DropdownMenu (already installed) | Accessible, keyboard navigable |
| Tab navigation | Custom tab logic | shadcn Tabs component | Accessible, handles focus management |
| Exit animations | Manual setTimeout/cleanup | Framer Motion AnimatePresence | Handles React tree removal properly |

**Key insight:** The codebase already has most infrastructure. The work is enhancement, not ground-up building.

## Common Pitfalls

### Pitfall 1: RTL-specific Icon Flipping
**What goes wrong:** Directional icons (arrows, chevrons) point wrong way in RTL
**Why it happens:** Icons are designed for LTR and don't auto-flip
**How to avoid:** Add `rtl:rotate-180` class to directional icons
**Warning signs:** Arrows pointing left when they should point right in Arabic

### Pitfall 2: Animation Direction in RTL
**What goes wrong:** Slide animations go opposite direction expected
**Why it happens:** Hardcoded `x: -100` or `translateX(-100%)` values
**How to avoid:** Use CSS logical properties or check `i18n.dir()` for animation direction
**Warning signs:** Mobile menu sliding from wrong side

### Pitfall 3: Font Loading FOUT (Flash of Unstyled Text)
**What goes wrong:** Arabic text briefly shows with wrong font before Arabic font loads
**Why it happens:** Arabic fonts are heavier and load after page renders
**How to avoid:** Preload Arabic font in index.html, use font-display: swap
**Warning signs:** Visible font change after page loads when in Arabic

### Pitfall 4: Language Dropdown Position in RTL
**What goes wrong:** Dropdown aligns to wrong side in RTL mode
**Why it happens:** Using `align="right"` instead of `align="end"`
**How to avoid:** Always use logical alignment (`align="end"` or `align="start"`)
**Warning signs:** Dropdown overlapping other elements or cut off

### Pitfall 5: Hamburger Menu Side in RTL
**What goes wrong:** Mobile menu slides from left in RTL (should be right)
**Why it happens:** Sheet side is hardcoded to "left"
**How to avoid:** Use `side={i18n.dir() === 'rtl' ? 'right' : 'left'}` or CSS-based solution
**Warning signs:** Menu appearing from unexpected side in Arabic

### Pitfall 6: SessionStorage SSR Issues
**What goes wrong:** Hydration mismatch with loading overlay
**Why it happens:** Server doesn't have sessionStorage, client does
**How to avoid:** Check `typeof window !== 'undefined'` before accessing sessionStorage, or use useState with useEffect
**Warning signs:** React hydration warnings in console

## Code Examples

Verified patterns from official sources:

### Underline Hover Effect for Nav Links
```tsx
// Source: Tailwind CSS hover effects
// User decision: "Underline animation on hover for nav links"
import { NavLink } from 'react-router'

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/services', key: 'nav.services' },
  { to: '/hse', key: 'nav.hse' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/careers', key: 'nav.careers' },
]

function Navigation() {
  const { t } = useTranslation()

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => cn(
            'relative py-2 text-sm font-medium transition-colors',
            'hover:text-primary',
            // Underline effect
            'after:absolute after:bottom-0 after:start-0 after:h-0.5',
            'after:w-0 after:bg-primary after:transition-all after:duration-300',
            'hover:after:w-full',
            isActive && 'text-primary after:w-full'
          )}
        >
          {t(link.key)}
        </NavLink>
      ))}
    </nav>
  )
}
```

### Sticky Header Pattern
```tsx
// Source: Tailwind CSS sticky positioning
// User decision: "Sticky header - stays visible at top as user scrolls"
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo - automatically flips position in RTL due to flexbox */}
          <Logo />

          {/* Desktop Navigation */}
          <Navigation />

          {/* Actions: Language + Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <MobileMenuTrigger />
          </div>
        </div>
      </Container>
    </header>
  )
}
```

### RTL-aware Hamburger Animation
```tsx
// Source: Framer Motion path morphing
// Animated hamburger icon that morphs to X
const hamburgerVariants = {
  closed: {
    top: { d: 'M4 6h16' },
    middle: { opacity: 1 },
    bottom: { d: 'M4 18h16' },
  },
  open: {
    top: { d: 'M6 18L18 6' },
    middle: { opacity: 0 },
    bottom: { d: 'M6 6l12 12' },
  },
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <motion.path
        variants={hamburgerVariants.top}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      />
      <motion.path
        d="M4 12h16"
        variants={hamburgerVariants.middle}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      />
      <motion.path
        variants={hamburgerVariants.bottom}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      />
    </svg>
  )
}
```

### Translation File Structure
```json
// src/locales/en/common.json - expanded structure
{
  "common": {
    "siteName": "Jerash",
    "allRightsReserved": "All rights reserved.",
    "menu": "Menu",
    "loading": "Loading..."
  },
  "nav": {
    "home": "Home",
    "services": "Services",
    "hse": "HSE",
    "gallery": "Gallery",
    "contact": "Contact",
    "careers": "Careers"
  },
  "footer": {
    "quickLinks": "Quick Links",
    "about": "About Us",
    "aboutText": "Jerash For Oil Field Services...",
    "offices": {
      "title": "Our Offices",
      "basrah": {
        "name": "Basrah",
        "address": "...",
        "phone": "...",
        "email": "..."
      },
      "erbil": {
        "name": "Erbil",
        "address": "...",
        "phone": "...",
        "email": "..."
      },
      "baghdad": {
        "name": "Baghdad",
        "address": "...",
        "phone": "...",
        "email": "..."
      }
    },
    "poBox": "P.O. Box: ...",
    "social": {
      "linkedin": "LinkedIn",
      "followUs": "Follow Us"
    }
  },
  "language": {
    "en": "English",
    "ar": "عربي"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ltr:ml-4 rtl:mr-4` | `ms-4` | Tailwind v3.3 (2023) | 50% less RTL utility classes |
| `framer-motion` import | `motion/react` import | Framer Motion v11 (2024) | Smaller bundle, tree-shakeable |
| Custom RTL detection | `i18n.dir()` | Always available | Built into i18next |
| Manual exit animations | AnimatePresence | Framer Motion v2+ | Automatic cleanup, no memory leaks |

**Deprecated/outdated:**
- `exitBeforeEnter` prop: Replaced with `mode="wait"` in AnimatePresence
- Physical direction utilities for RTL: Use logical properties instead
- Separate RTL stylesheets: Modern Tailwind handles this automatically

## Open Questions

Things that couldn't be fully resolved:

1. **Arabic Font Choice**
   - What we know: IBM Plex Sans Arabic and Noto Sans Arabic are recommended for web
   - What's unclear: Which font Jerash brand guidelines specify, if any
   - Recommendation: Default to IBM Plex Sans Arabic (professional, pairs well with sans-serif), confirm with client or check brand guidelines

2. **Social Media Platforms**
   - What we know: LinkedIn is mentioned as possible platform
   - What's unclear: Which social platforms Jerash actually uses
   - Recommendation: Per CONTEXT.md, this is Claude's discretion - implement LinkedIn only initially, add others if discovered

3. **Loading Overlay Background**
   - What we know: User wants "solid/branded background"
   - What's unclear: Exact color/gradient specification
   - Recommendation: Per CONTEXT.md, this is Claude's discretion - use brand primary color or white background

## Sources

### Primary (HIGH confidence)
- Project codebase `/src/lib/i18n.ts` - existing i18n configuration verified
- Project codebase `/src/components/layout/Header.tsx` - existing structure verified
- Project guides `/I18N.md`, `/FRAMER-MOTION.md`, `/TAILWIND.md`, `/SHADCN.md` - authoritative project patterns
- CONTEXT.md user decisions - locked implementation choices

### Secondary (MEDIUM confidence)
- [Tailwind CSS v3.3 RTL Support](https://tailwindcss.com/blog/tailwindcss-v3-3) - logical properties documentation
- [Motion/Framer Motion AnimatePresence](https://motion.dev/docs/react-animate-presence) - exit animation patterns
- [shadcn/ui Sheet Component](https://ui.shadcn.com/docs/components/sheet) - mobile menu drawer
- [Zustand Persist Middleware](https://zustand.docs.pmnd.rs/middlewares/persist) - state persistence patterns

### Tertiary (LOW confidence)
- [Arabic Font Recommendations](https://ahmedelramlawy.com/10-arabic-fonts-every-ux-designer-should-know-in-2025/) - font pairing suggestions
- [Hamburger Animation Patterns](https://dev.to/wiommi/animate-a-hamburger-menu-with-framer-motion-50ml) - community patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and configured
- Architecture: HIGH - extends existing patterns in codebase
- Pitfalls: HIGH - verified against codebase structure and Tailwind/i18next docs
- Code examples: HIGH - based on project guides and official documentation

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (30 days - stable libraries, established patterns)
