# Phase 9: Tech Debt Closure - Research

**Researched:** 2026-01-23
**Domain:** Content placeholders, configuration, accessibility
**Confidence:** HIGH

## Summary

This phase addresses accumulated tech debt from the v1 milestone audit. The debt consists of three categories: (1) placeholder images for HSE and partner/JV logos, (2) placeholder content including contact info, LinkedIn URL, and safety metrics, and (3) configuration and accessibility warnings in the build.

All tech debt items have been located with exact file paths and line numbers. The fixes are straightforward replacements with real assets/values provided by the client, plus minor code adjustments for accessibility compliance.

**Primary recommendation:** Execute fixes in dependency order - images first (no code changes needed), then content updates (translation files + Footer), then configuration/a11y fixes (code changes). This allows visual verification at each step.

## Tech Debt Inventory by Category

### Category 1: Placeholder Images

| Item | File Path | Current State | Required Fix |
|------|-----------|---------------|--------------|
| HSE Hero | `/public/images/hse/hse-hero.jpg` | 160 bytes (1x1 pixel) | Replace with real field photo (1920x1080) |
| PPE Equipment | `/public/images/hse/ppe-equipment.jpg` | 160 bytes (1x1 pixel) | Replace with real PPE photo (1200x800) |
| Team Safety | `/public/images/hse/team-safety.jpg` | 160 bytes (1x1 pixel) | Replace with real team photo (1200x800) |
| Safety Signs | `/public/images/hse/safety-signs.jpg` | 160 bytes (1x1 pixel) | Replace with real signage photo (1200x800) |
| SLB Logo | `/public/images/partners/slb-logo.png` | **Missing** (shows fallback) | Add actual SLB logo (200x80 PNG transparent) |
| Kweti Logo | `/public/images/partners/kweti-logo.png` | **Missing** (shows fallback) | Add actual Kweti logo (200x80 PNG transparent) |

**Note:** Gallery images at `/public/images/gallery/jerash-site-*.jpg` (26 files, 284 bytes each) are also placeholders but were NOT flagged in the audit as blocking.

### Category 2: Placeholder Content

| Item | File Path | Line(s) | Current Value | Required Fix |
|------|-----------|---------|---------------|--------------|
| Basrah Phone | `src/locales/en/common.json` | 44 | `"+964 XXX XXX XXXX"` | Real phone number |
| Basrah Email | `src/locales/en/common.json` | 45 | `"basrah@jerash.com"` | Verify or update |
| Erbil Phone | `src/locales/en/common.json` | 50 | `"+964 XXX XXX XXXX"` | Real phone number |
| Erbil Email | `src/locales/en/common.json` | 51 | `"erbil@jerash.com"` | Verify or update |
| Baghdad Phone | `src/locales/en/common.json` | 56 | `"+964 XXX XXX XXXX"` | Real phone number |
| Baghdad Email | `src/locales/en/common.json` | 57 | `"baghdad@jerash.com"` | Verify or update |
| PO Box | `src/locales/en/common.json` | 60 | `"P.O. Box: XXXXX"` | Real PO Box number |
| LinkedIn URL | `src/components/layout/Footer.tsx` | 107 | `href="#"` | Real LinkedIn company URL |
| Safety: Incident-Free Hours | `src/components/hse/SafetyMetrics.tsx` | 8 | `1000000` (displays "1M+") | Client-verified value |
| Safety: Training Hours | `src/components/hse/SafetyMetrics.tsx` | 9 | `50000` (displays "50K+") | Client-verified value |
| Safety: Certified Personnel | `src/components/hse/SafetyMetrics.tsx` | 10 | `95` (displays "95%") | Client-verified value |

**Arabic Translation Mirror:** Same placeholder values exist in `src/locales/ar/common.json` at identical line numbers and must be updated in parallel.

### Category 3: Configuration & Accessibility Warnings

| Issue | File Path | Line(s) | Problem | Fix |
|-------|-----------|---------|---------|-----|
| i18n namespace warning | `src/lib/i18n.ts` | 31 | Missing `careers`, `contact`, `gallery` | Add to `ns` array |
| jsx-a11y: anchor-is-valid | `src/components/layout/Footer.tsx` | 106-114 | `href="#"` placeholder | Replace with real URL or use button |
| jsx-a11y: no-noninteractive-element-interactions | `src/components/gallery/GalleryImage.tsx` | 58 | `onClick` on `motion.div` | Add `role="button"` and `tabIndex={0}` |
| jsx-a11y: no-noninteractive-element-interactions | `src/components/partners/PartnerCard.tsx` | 30 | `img` with `onError` handler | No fix needed (onError is not interactive) |
| jsx-a11y: no-noninteractive-element-interactions | `src/components/joint-ventures/JointVentureCard.tsx` | 30 | `img` with `onError` handler | No fix needed (onError is not interactive) |
| HSE Hero wrong path | `src/components/hse/HSEHero.tsx` | 13 | `/images/hse-hero.jpg` (missing `/hse/`) | Fix path to `/images/hse/hse-hero.jpg` |

## Architecture: File Locations Map

### Images Directory Structure
```
public/images/
├── hse/                      # HSE page images (4 placeholders)
│   ├── hse-hero.jpg         # 160 bytes - needs replacement
│   ├── ppe-equipment.jpg    # 160 bytes - needs replacement
│   ├── team-safety.jpg      # 160 bytes - needs replacement
│   ├── safety-signs.jpg     # 160 bytes - needs replacement
│   └── placeholder.txt      # Docs: image specs
├── partners/                 # Partner/JV logos (empty)
│   ├── slb-logo.png         # MISSING - needs addition
│   ├── kweti-logo.png       # MISSING - needs addition
│   └── placeholder.txt      # Docs: logo specs
└── gallery/                  # Gallery images (26 placeholders, not blocking)
```

### Code Files Requiring Changes
```
src/
├── components/
│   ├── hse/
│   │   ├── HSEHero.tsx           # Line 13: fix image path
│   │   └── SafetyMetrics.tsx     # Lines 8-10: update metric values
│   ├── gallery/
│   │   └── GalleryImage.tsx      # Lines 40-44: add a11y attributes
│   └── layout/
│       └── Footer.tsx            # Line 107: replace LinkedIn href
├── lib/
│   └── i18n.ts                   # Line 31: add namespaces
└── locales/
    ├── en/
    │   └── common.json           # Lines 44-60: contact placeholders
    └── ar/
        └── common.json           # Lines 44-60: contact placeholders (mirror)
```

## Don't Hand-Roll

| Problem | Existing Solution | Why |
|---------|-------------------|-----|
| Image optimization | Use properly sized/compressed originals | Browser handles lazy loading already in place |
| Logo fallback | Already implemented in PartnerCard/JointVentureCard | `onError={() => setLogoError(true)}` with fallback div |
| Counter animation | AnimatedCounter component | Already handles formatting (K+, M+, %) |

## Common Pitfalls

### Pitfall 1: Forgetting Arabic Translation Files
**What goes wrong:** Updating only `en/common.json` leaves Arabic with placeholder values
**Why it happens:** Easy to forget bilingual requirement
**How to avoid:** Always update both `en/` and `ar/` files in same commit
**Warning signs:** Arabic language toggle shows "XXX" values

### Pitfall 2: Image Path Inconsistency
**What goes wrong:** HSEHero.tsx already has wrong path (`/images/hse-hero.jpg` vs `/images/hse/hse-hero.jpg`)
**Why it happens:** Copy-paste error during development
**How to avoid:** Verify all image paths match actual file locations
**Warning signs:** Broken images in browser, 404s in network tab

### Pitfall 3: Assuming onError is Interactive
**What goes wrong:** Trying to "fix" jsx-a11y warnings on `<img onError={...}>`
**Why it happens:** Misreading ESLint warnings - onError is not user-interactive
**How to avoid:** Only the GalleryImage onClick needs accessibility fix
**Warning signs:** Unnecessary code changes

### Pitfall 4: Breaking i18n Lazy Loading
**What goes wrong:** Adding namespaces causes eager loading of all translations
**Why it happens:** i18next can load eagerly or lazily based on config
**How to avoid:** The resourcesToBackend plugin already handles lazy loading - adding to ns array just suppresses warnings
**Warning signs:** Larger initial bundle, slower page load

## Code Examples

### Fix 1: i18n Namespace Registration (src/lib/i18n.ts:31)
```typescript
// Before (current)
ns: ['common', 'services', 'hse', 'partners'],

// After (add missing namespaces)
ns: ['common', 'services', 'hse', 'partners', 'careers', 'contact', 'gallery'],
```

### Fix 2: LinkedIn URL (src/components/layout/Footer.tsx:106-114)
```typescript
// Before (current)
<a
  href="#"
  target="_blank"
  rel="noopener noreferrer"
  ...
>

// After (with real URL)
<a
  href="https://www.linkedin.com/company/jerash-oil-field-services"
  target="_blank"
  rel="noopener noreferrer"
  ...
>
```

### Fix 3: GalleryImage Accessibility (src/components/gallery/GalleryImage.tsx:40-44)
```typescript
// Before (current)
<motion.div
  variants={itemVariants}
  className="mb-2 cursor-pointer group relative"
  onClick={onClick}
>

// After (with a11y attributes)
<motion.div
  variants={itemVariants}
  className="mb-2 cursor-pointer group relative"
  onClick={onClick}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  role="button"
  tabIndex={0}
>
```

### Fix 4: HSEHero Image Path (src/components/hse/HSEHero.tsx:13)
```typescript
// Before (current - wrong path)
style={{ backgroundImage: "url('/images/hse-hero.jpg')" }}

// After (correct path)
style={{ backgroundImage: "url('/images/hse/hse-hero.jpg')" }}
```

### Fix 5: Contact Info Pattern (src/locales/en/common.json)
```json
// Before (placeholder)
"basrah": {
  "name": "Basrah",
  "address": "Basrah, Iraq",
  "phone": "+964 XXX XXX XXXX",
  "email": "basrah@jerash.com"
}

// After (real values - example pattern)
"basrah": {
  "name": "Basrah",
  "address": "Basrah, Iraq",
  "phone": "+964 780 123 4567",
  "email": "basrah@jerash-ofs.com"
}
```

## Verification Commands

### Build Verification
```bash
# Full build with no warnings (success criteria 8)
pnpm build 2>&1 | grep -E "warning|error" || echo "Build clean"

# Lint check for a11y warnings
pnpm lint 2>&1 | grep "jsx-a11y" | wc -l  # Should be 0
```

### Visual Verification
```bash
# Start dev server
pnpm dev

# Check in browser:
# 1. /hse - All 4 images should display (not broken)
# 2. /partners - SLB logo should display (not "Logo" placeholder)
# 3. /joint-ventures - Kweti logo should display (not "Logo" placeholder)
# 4. Footer tabs - Phone/email should show real values
# 5. Footer social - LinkedIn icon should link to real page
# 6. Console - No i18n namespace warnings
```

### Image File Verification
```bash
# Check HSE images are real (not 160 bytes)
ls -la public/images/hse/*.jpg
# Each should be > 10KB for real photos

# Check partner logos exist
ls -la public/images/partners/*.png
# Should see slb-logo.png and kweti-logo.png
```

## Dependencies and Ordering

### Plan 09-01: Replace Placeholder Images
**Dependencies:** None (can start immediately)
**Blocks:** Visual verification of HSE page
**Files changed:** 6 image files (add/replace)

### Plan 09-02: Update Placeholder Content
**Dependencies:** None (can parallel with 09-01)
**Blocks:** Contact functionality verification
**Files changed:**
- `src/locales/en/common.json`
- `src/locales/ar/common.json`
- `src/components/layout/Footer.tsx` (LinkedIn URL)
- `src/components/hse/SafetyMetrics.tsx` (metric values)

### Plan 09-03: Fix Configuration and Accessibility
**Dependencies:** 09-02 (LinkedIn fix removes one a11y warning)
**Blocks:** Build passing with zero warnings
**Files changed:**
- `src/lib/i18n.ts`
- `src/components/gallery/GalleryImage.tsx`
- `src/components/hse/HSEHero.tsx` (path fix)

## Open Questions

1. **Safety Metrics Values**
   - What we know: Current values are 1M+ hours, 50K+ training hours, 95% certified
   - What's unclear: Are these accurate or purely placeholder estimates?
   - Recommendation: Plan should flag for client verification, document as "verified by client" or "marked as estimate"

2. **Email Domain**
   - What we know: Current pattern is `{city}@jerash.com`
   - What's unclear: Is this the real domain or should it be `jerash-ofs.com` or similar?
   - Recommendation: Verify correct email domain with client

3. **Gallery Images**
   - What we know: 26 placeholder images (284 bytes each) not flagged as blocking
   - What's unclear: Should they be replaced in this phase?
   - Recommendation: Out of scope for Phase 9 unless client provides

## Sources

### Primary (HIGH confidence)
- Codebase inspection: All file paths and line numbers verified by reading actual source files
- v1-MILESTONE-AUDIT.md: Tech debt inventory from milestone audit
- ESLint output: Current warning list from `pnpm lint`

### Secondary (MEDIUM confidence)
- placeholder.txt files: Image specifications from placeholder documentation

## Metadata

**Confidence breakdown:**
- File locations: HIGH - All paths verified by direct file reading
- Code changes: HIGH - Exact line numbers confirmed
- Client data: LOW - Actual contact info and metrics need client input

**Research date:** 2026-01-23
**Valid until:** Until all placeholder assets are provided by client
