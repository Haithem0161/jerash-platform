# Domain Pitfalls

**Domain:** Bilingual Arabic/English corporate website with bold animations (Oil & Gas sector)
**Researched:** 2026-01-21
**Confidence:** HIGH (verified with Context7, official docs, and multiple sources)

---

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

---

### Pitfall 1: Mirror-Flip Everything for RTL

**What goes wrong:** Developers assume RTL is just "flip everything horizontally" -- reversing all layouts, icons, and components. This produces broken, unnatural interfaces where media player controls point wrong, universal icons get flipped unnecessarily, and navigation feels disorienting.

**Why it happens:** Conflation of text direction with visual direction. Arabic text flows RTL, but that does not mean all visual elements should mirror.

**Consequences:**
- Play/pause buttons pointing wrong direction (they indicate tape direction, not reading direction)
- Search, settings, user icons flipped when they should stay universal
- Progress bars and timelines that confuse users
- Professional Arabic speakers immediately spot the amateur mistakes

**Prevention:**
- **Flip:** Directional icons (arrows, chevrons, navigation), navigation drawers (left to right side), button order in dialogs (Confirm on left for RTL)
- **Do NOT flip:** Media controls, checkmarks, universal symbols (search, user, settings, home), brand logos, images with text
- Create an explicit "RTL Flip" decision matrix for all icons during design phase
- Test with native Arabic speakers before launch

**Detection (warning signs):**
- No documented icon-flipping guidelines
- Designer unfamiliar with Arabic interfaces
- Using `rtl:-scale-x-100` on everything instead of selectively

**Phase:** Phase 1 (Foundation) - establish RTL component guidelines upfront

**Sources:**
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [Weglot RTL Design Guide](https://www.weglot.com/blog/rtl-web)

---

### Pitfall 2: Arabic Pluralization Hardcoded for English

**What goes wrong:** Using simple singular/plural logic (1 vs many) for Arabic, resulting in grammatically incorrect text that sounds broken to native speakers.

**Why it happens:** English has 2 plural forms. Arabic has 6 (zero, one, two, few, many, other). i18next handles this automatically, but only if translations include all forms.

**Consequences:**
- "5 message" instead of proper Arabic plural form
- "2 items" missing the dual form entirely
- Professional credibility damaged; appears machine-translated
- Users in MENA region perceive lower quality

**Prevention:**
```json
// WRONG - English pattern applied to Arabic
{
  "items_one": "عنصر واحد",
  "items_other": "{{count}} عناصر"
}

// CORRECT - All 6 Arabic plural forms
{
  "items_zero": "لا عناصر",
  "items_one": "عنصر واحد",
  "items_two": "عنصران",
  "items_few": "{{count}} عناصر",    // 3-10
  "items_many": "{{count}} عنصراً",   // 11-99
  "items_other": "{{count}} عنصر"    // 100+
}
```
- Review ALL translation files for proper plural forms
- Use native Arabic translator, not Google Translate
- Create translation template that enforces all 6 forms

**Detection (warning signs):**
- Translation files have only `_one` and `_other` suffixes for Arabic
- No native Arabic speaker on the review process
- Pluralized strings show numbers 0, 1, 2, 3, 50, 100 identically

**Phase:** Phase 2 (i18n Setup) - must be correct from initial translation file creation

**Sources:**
- [i18next Arabic Pluralization](https://medium.com/swlh/dealing-with-arabic-when-using-i18next-348ed55f7c1a)
- Project's I18N.md guide (lines 246-277)

---

### Pitfall 3: Animating Layout-Triggering Properties

**What goes wrong:** Using Framer Motion to animate `width`, `height`, `top`, `left`, `margin`, `padding` -- properties that force browser layout recalculation every frame.

**Why it happens:** It feels intuitive to animate size/position directly. Framer Motion accepts any property, so developers don't realize some trigger expensive reflows.

**Consequences:**
- Stuttering, janky animations (especially on mobile)
- 15-30fps instead of 60fps
- High CPU usage, battery drain
- Shared layout transitions thrashing (visible as long purple bars in DevTools)
- "Bold cinematic animations" become "laggy amateur animations"

**Prevention:**
```tsx
// WRONG - Layout-triggering
<motion.div
  animate={{ width: "100%", height: 300, left: 50 }}
/>

// CORRECT - GPU-accelerated transform
<motion.div
  animate={{ scaleX: 1, scaleY: 1, x: 50 }}
/>
```
- Only animate: `transform` (x, y, scale, rotate), `opacity`, `filter`, `clipPath`
- Never animate: width, height, top/left/right/bottom, margin, padding
- For size changes, use `layout` prop which optimizes automatically
- Use DevTools Performance panel to verify no layout thrashing

**Detection (warning signs):**
- Animation code contains `width`, `height`, or positional properties
- Mobile testing shows stuttering
- DevTools shows long purple "Layout" bars during animation

**Phase:** Phase 3 (Animation Framework) - establish patterns before building animations

**Sources:**
- [Framer Motion Performance Tips](https://tillitsdone.com/blogs/framer-motion-performance-tips/)
- [Motion Dev Performance Guide](https://github.com/framer/motion/issues/442)
- Project's FRAMER-MOTION.md guide (lines 286-320)

---

### Pitfall 4: Missing prefers-reduced-motion Support

**What goes wrong:** Bold cinematic animations play for all users, including those with vestibular disorders who experience nausea, dizziness, or seizures from motion.

**Why it happens:** Accessibility treated as afterthought. Team focuses on "wow factor" without considering disability. Over 70 million people have vestibular disorders.

**Consequences:**
- Users physically unable to use the site
- Potential legal liability (ADA, WCAG non-compliance)
- Lost business from accessibility-conscious clients (especially B2B/corporate)
- Oil & gas industry often requires accessibility compliance for government contracts

**Prevention:**
```tsx
// Use MotionConfig at app root
import { MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>

// For CSS animations
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```
- Wrap app in `<MotionConfig reducedMotion="user">`
- Provide alternative non-motion effects (fade, opacity change) instead of removing all feedback
- Add manual "pause animations" toggle for 5+ second animations (WCAG 2.2.2)
- Test in Chrome DevTools: Rendering > Emulate CSS media feature prefers-reduced-motion

**Detection (warning signs):**
- No `MotionConfig` wrapper in app
- No `prefers-reduced-motion` media queries in CSS
- No manual animation pause button for long animations

**Phase:** Phase 3 (Animation Framework) - configure at framework level, not per-animation

**Sources:**
- [Pope Tech Accessible Animation Guide](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [Josh Comeau prefers-reduced-motion React](https://www.joshwcomeau.com/react/prefers-reduced-motion/)
- [W3C WAI Technique C39](https://www.w3.org/WAI/WCAG21/Techniques/css/C39)

---

### Pitfall 5: Hreflang Implementation Errors

**What goes wrong:** Search engines can't determine which language version to show users, leading to wrong language appearing in search results, or pages competing against each other.

**Why it happens:** Hreflang is notoriously tricky. 31% of international sites have conflicting directives. Missing return links, wrong codes, canonical conflicts all break it silently.

**Consequences:**
- Arabic users see English in Google results (and vice versa)
- SEO cannibalization between language versions
- Lower rankings as Google struggles to understand site structure
- Lost traffic in MENA region (critical for oil & gas company)

**Prevention:**
```html
<!-- On EVERY page, include ALL language versions including self -->
<!-- English page -->
<link rel="alternate" hreflang="en" href="https://example.com/en/about" />
<link rel="alternate" hreflang="ar" href="https://example.com/ar/about" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/about" />

<!-- Arabic page must have MATCHING return links -->
<link rel="alternate" hreflang="en" href="https://example.com/en/about" />
<link rel="alternate" hreflang="ar" href="https://example.com/ar/about" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/about" />
```

**Critical rules:**
1. Every page must self-reference its own language version
2. Return links required: if A links to B, B must link to A
3. Use ISO codes: `ar` for Arabic, `en` for English (NOT `uk` for UK -- it's `gb`)
4. `x-default` for language picker/fallback page
5. Canonical tags must NOT contradict hreflang
6. No redirects in hreflang URLs
7. Region codes optional: `ar-ae` for UAE Arabic vs `ar-sa` for Saudi Arabic

**Detection (warning signs):**
- Hreflang only on homepage, not all pages
- Self-referencing link missing
- Canonical points to different language version
- Using redirect URLs in hreflang

**Phase:** Phase 5 (SEO Setup) - implement systematically, not per-page

**Sources:**
- [Botify Hreflang Guide](https://www.botify.com/blog/international-seo-hreflang)
- [Google Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Geotargetly Hreflang SEO Guide](https://geotargetly.com/blog/hreflang-tag-seo-guide)

---

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

---

### Pitfall 6: Using ml-/mr-/pl-/pr- Instead of Logical Properties

**What goes wrong:** Hard-coded left/right margins and paddings break when switching to RTL. Elements get double-spaced on one side, crushed on other.

**Why it happens:** Developers trained on LTR-only sites use familiar `ml-4`, `mr-4` patterns. Tailwind v3.3+ has logical properties but they're not the default.

**Consequences:**
- Layout breaks when switching languages
- Icons and text misaligned in RTL
- Navigation appears reversed or broken
- Requires rewriting hundreds of utility classes

**Prevention:**
```html
<!-- WRONG - Physical properties -->
<div class="ml-4 pr-2 text-left float-right border-l-2">

<!-- CORRECT - Logical properties -->
<div class="ms-4 pe-2 text-start float-end border-s-2">
```

| Replace | With |
|---------|------|
| `ml-*` | `ms-*` (margin-start) |
| `mr-*` | `me-*` (margin-end) |
| `pl-*` | `ps-*` (padding-start) |
| `pr-*` | `pe-*` (padding-end) |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `float-left` | `float-start` |
| `float-right` | `float-end` |
| `border-l-*` | `border-s-*` |
| `border-r-*` | `border-e-*` |

- Establish as team convention from day 1
- Add ESLint rule or PR review check for physical properties
- Only use explicit `ltr:ml-4 rtl:mr-4` when behavior should differ between directions

**Detection (warning signs):**
- Codebase contains `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`
- RTL mode shows misaligned elements
- No logical property convention documented

**Phase:** Phase 1 (Foundation) - coding convention from first component

**Sources:**
- [Flowbite Tailwind RTL Guide](https://flowbite.com/docs/customize/rtl/)
- [shadcn-ui RTL Guidelines Issue](https://github.com/shadcn-ui/ui/issues/2759)
- Project's I18N.md guide (lines 419-462)

---

### Pitfall 7: Arabic Font Too Small or Wrong Font Family

**What goes wrong:** Arabic text appears tiny, cramped, or uses a font that renders poorly. Letters disconnect or look "squished."

**Why it happens:** Arabic lacks uppercase, making it appear smaller next to Latin text. Many fonts (especially Arial) render Arabic poorly. One study of 73 Arabic websites found widespread font and size inconsistencies.

**Consequences:**
- Readability issues for Arabic users
- Unprofessional appearance
- Higher bounce rates in MENA region
- Accessibility failure (text too small)

**Prevention:**
```css
/* Increase Arabic font size relative to English */
:lang(ar) {
  font-size: 1.125em; /* 2 points larger equivalent */
  line-height: 1.8; /* More generous line height */
}

/* Use proper Arabic font stack */
@theme {
  --font-arabic: "IBM Plex Sans Arabic", "Noto Sans Arabic", "Segoe UI", sans-serif;
  --font-sans: "Inter", var(--font-arabic), sans-serif;
}

/* Avoid Arial for Arabic - use dedicated Arabic fonts */
```

- Increase Arabic font by 2+ points (or ~12%) relative to English
- Use dedicated Arabic fonts: IBM Plex Sans Arabic, Noto Sans Arabic, Cairo, Tajawal
- Never rely on Arial or system defaults for Arabic
- Test with actual Arabic content, not Lorem Ipsum (Latin doesn't trigger RTL rendering)
- Use `font-display: swap` for performance

**Detection (warning signs):**
- Same font-size in both languages
- Using Arial or generic sans-serif for Arabic
- Arabic text appears cramped or disconnected
- Testing with English text in RTL mode

**Phase:** Phase 2 (i18n/Typography) - establish font system early

**Sources:**
- [10 Arabic Fonts Every UX Designer Should Know](https://ahmedelramlawy.com/10-arabic-fonts-every-ux-designer-should-know-in-2025/)
- [Arabic Website Font & Image Study](https://hackernoon.com/results-font-image-usage-and-performance-trends-across-73-arabic-websites)

---

### Pitfall 8: Image Gallery Without Lazy Loading or Optimization

**What goes wrong:** Loading all gallery images upfront, causing 10+ second load times and poor Core Web Vitals.

**Why it happens:** Developer builds gallery, it works in development (cached), deploys without testing on slow connection or measuring LCP.

**Consequences:**
- 53% of users abandon sites taking >3 seconds to load
- Poor LCP (Largest Contentful Paint) kills SEO
- High bandwidth costs
- Mobile users on cellular connections cannot load site

**Prevention:**
```tsx
// Native lazy loading (simplest)
<img src="photo.jpg" alt="..." loading="lazy" />

// React with Intersection Observer for galleries
import { useInView } from "motion/react"

function GalleryImage({ src, alt }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "100px" })

  return (
    <div ref={ref}>
      {isInView && <img src={src} alt={alt} />}
    </div>
  )
}
```

**Additional optimizations:**
- Use WebP/AVIF formats with fallbacks
- Implement responsive images with `srcset`
- Use CDN for image delivery
- Compress images before upload
- For large galleries, use `trackWindowScroll` HOC to share scroll listener
- Consider blur placeholder (LQIP) for perceived performance

**Detection (warning signs):**
- No `loading="lazy"` on images
- Gallery loads all images on page load
- LCP > 2.5 seconds in Lighthouse
- Network tab shows all images loading simultaneously

**Phase:** Phase 4 (Image Gallery) - architectural decision at gallery build time

**Sources:**
- [React Lazy Loading Images Guide](https://www.freecodecamp.org/news/how-to-lazy-load-images-in-react/)
- [Uploadcare React Image Optimization](https://uploadcare.com/blog/react-image-optimization-techniques/)

---

### Pitfall 9: File Upload Without Proper Validation (CV Forms)

**What goes wrong:** Accepting any file type/size on CV upload, leading to security vulnerabilities, server storage issues, or users uploading wrong files.

**Why it happens:** Focus on "getting it working" without security review. File validation often forgotten.

**Consequences:**
- Malicious file uploads (security risk)
- Server storage exhausted by large files
- Wrong file types (images instead of PDFs)
- No feedback to users about upload status/errors
- GDPR/data protection issues with uncontrolled data

**Prevention:**
```tsx
// Client-side validation (first line of defense)
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
const MAX_SIZE_MB = 5

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Please upload a PDF or Word document'
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File must be under ${MAX_SIZE_MB}MB`
  }
  return null
}

// Also validate on server side - client validation can be bypassed!
```

**Must implement:**
1. Client-side type/size validation with clear error messages
2. Server-side validation (never trust client)
3. File type whitelist (not blacklist)
4. Maximum file size (5-10MB reasonable for CVs)
5. Virus scanning on server
6. Progress indicator for uploads
7. Secure storage (not public URLs)
8. Clear data retention policy

**Detection (warning signs):**
- No file type restrictions on input
- No size limit enforcement
- Missing server-side validation
- Files stored with predictable/public URLs

**Phase:** Phase 6 (Forms) - security requirements before implementation

**Sources:**
- [Cloudinary React File Upload Guide](https://cloudinary.com/guides/front-end-development/making-a-simple-react-js-file-upload-component)
- [Syncfusion File Upload Validation](https://www.syncfusion.com/react-components/react-file-upload)

---

### Pitfall 10: Trans Component BiDi Issues with Arabic

**What goes wrong:** Using i18next's `<Trans>` component with Arabic, but interpolated elements appear in wrong position due to bidirectional text rules.

**Why it happens:** Trans component isn't direction-aware. When mixing RTL (Arabic) with LTR (numbers, English names, URLs), browser BiDi algorithm can produce unexpected orderings.

**Consequences:**
- Punctuation in wrong place: "!I love that" instead of "I love that!"
- Numbers appearing reversed or mispositioned
- Links appearing at wrong end of sentence
- Translations look "machine translated" even when correct

**Prevention:**
```tsx
// Problem: Tag placeholders get reversed
// Translation: "Welcome <bold>{{name}}</bold> to our site!"
// In Arabic, the <bold> tag might appear in wrong position

// Solution 1: Explicit direction wrapping
<Trans
  i18nKey="welcome"
  values={{ name: 'Ahmed' }}
  components={{
    bold: <strong dir="auto" />, // Let browser determine direction
  }}
/>

// Solution 2: Use bdi element for bidirectional isolation
<Trans
  i18nKey="welcome"
  components={{
    name: <bdi className="font-bold" />,
  }}
/>

// Solution 3: Simpler translations without complex interpolation
// Instead of "Read our <link>terms</link> and <link2>privacy</link2>"
// Use separate sentences or simpler structure
```

**Additional tips:**
- Use `<bdi>` element to isolate bidirectional text
- Keep Trans usage simple -- complex nesting more likely to break
- Test actual Arabic translations, not placeholder text
- Consider separate translation keys for complex constructs

**Detection (warning signs):**
- Trans components with multiple interpolated elements
- Punctuation appearing at wrong end
- Numbers or English text in unexpected positions
- No testing with native Arabic speakers

**Phase:** Phase 2 (i18n Setup) - establish Trans component patterns early

**Sources:**
- [react-i18next Trans Arabic Issues](https://github.com/i18next/react-i18next/issues/1793)
- [i18next Arabic Handling Guide](https://medium.com/swlh/dealing-with-arabic-when-using-i18next-348ed55f7c1a)

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

---

### Pitfall 11: Forgetting space-x-reverse for RTL Flex Children

**What goes wrong:** Using `space-x-4` on flex children works in LTR but creates wrong spacing in RTL.

**Why it happens:** `space-x` uses margin-left, which doesn't auto-flip.

**Prevention:**
```html
<!-- Add space-x-reverse for RTL support -->
<div class="flex space-x-4 rtl:space-x-reverse">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Or use gap instead (works automatically) -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Detection:** Flex children have uneven spacing in RTL mode

**Phase:** Phase 1 (Foundation) - coding convention

---

### Pitfall 12: Cultural Imagery Mismatches

**What goes wrong:** Using Western-centric imagery that doesn't resonate (or offends) MENA audiences.

**Why it happens:** Stock photos default to Western contexts. Team doesn't consider cultural appropriateness.

**Examples to avoid:**
- Piggy banks (pigs considered unclean in Islam)
- Alcohol in business photos
- Inappropriately dressed people
- Left-hand handshakes (culturally significant)
- Dogs in prominent positions

**Prevention:**
- Review all imagery with cultural consultant
- Use region-appropriate stock photo sources
- Consider separate image sets per language
- Default to neutral industrial/professional imagery (good for oil & gas anyway)

**Phase:** Phase 4 (Content/Gallery) - image selection review

**Sources:**
- [RTL Styling Cultural Considerations](https://rtlstyling.com/posts/rtl-styling/)

---

### Pitfall 13: Bundle Size Bloat from Framer Motion

**What goes wrong:** Full Framer Motion bundle (~32KB) loaded even for simple animations.

**Why it happens:** Importing `motion` brings entire library. LazyMotion exists but requires setup.

**Prevention:**
```tsx
// Use LazyMotion + m components
import { LazyMotion } from "motion/react"
import * as m from "motion/react-m"

const loadFeatures = () =>
  import("motion/dom-animation").then(mod => mod.domAnimation)

function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div animate={{ opacity: 1 }} />
    </LazyMotion>
  )
}
```

- `domAnimation` (~16KB) for basic animations
- `domMax` (~27KB) only if using layout animations

**Detection:** Bundle analyzer shows large motion chunk on initial load

**Phase:** Phase 3 (Animation Framework) - configure at setup

**Sources:**
- Project's FRAMER-MOTION.md guide (lines 322-350)

---

### Pitfall 14: Direction Not Updating on Language Switch

**What goes wrong:** User switches language but `dir="rtl"` doesn't update, leaving Arabic text in LTR layout.

**Why it happens:** Forgot to sync document direction with i18n language change.

**Prevention:**
```tsx
// In App.tsx
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.dir = i18n.dir()
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return <RouterProvider router={router} />
}
```

**Detection:** Switch to Arabic, layout doesn't mirror

**Phase:** Phase 2 (i18n Setup) - part of language switcher implementation

**Sources:**
- Project's I18N.md guide (lines 400-417)

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| Phase 1: Foundation | Using physical properties (ml/mr) | Establish logical properties convention, add linting |
| Phase 2: i18n | Arabic pluralization, Trans BiDi, direction sync | Native speaker review, proper plural forms, useEffect for dir |
| Phase 3: Animations | Layout-triggering animations, no reduced motion | Transform-only rule, MotionConfig wrapper |
| Phase 4: Gallery | No lazy loading, unoptimized images | Intersection Observer, WebP, CDN |
| Phase 5: SEO | Hreflang errors, missing meta translations | Systematic implementation, return links, self-references |
| Phase 6: Forms | Insecure file uploads | Whitelist validation, server-side checks |

---

## Oil & Gas Corporate Website Specifics

### Industry-Specific Considerations

1. **Trust and Credibility:** Energy sector requires higher trust signals. Inconsistent branding, broken layouts, or amateur animations damage credibility more than in other industries.

2. **Technical Content:** May need to communicate complex information (operations, safety, sustainability). Ensure animations don't obscure important content.

3. **Accessibility Compliance:** Government contracts and industry partners often require accessibility standards. prefers-reduced-motion support is not optional.

4. **Performance on Industrial Sites:** Some users may access from field locations with poor connectivity. Optimize aggressively.

5. **Regional Variations:** Consider ar-ae (UAE) vs ar-sa (Saudi) vs ar-eg (Egypt) for hreflang if targeting specific MENA markets.

---

## Pre-Launch Checklist

Before going live, verify:

- [ ] All icons reviewed for flip/no-flip decision
- [ ] Arabic translations have all 6 plural forms
- [ ] Animations use only transform/opacity
- [ ] prefers-reduced-motion supported at app level
- [ ] Hreflang tags on all pages with return links
- [ ] Logical properties used (ms/me/ps/pe)
- [ ] Arabic font properly sized (2+ points larger)
- [ ] Gallery images lazy loaded
- [ ] File uploads validated (type, size, server-side)
- [ ] Language switch updates document direction
- [ ] Tested with native Arabic speakers
- [ ] Core Web Vitals passing (<2.5s LCP)
- [ ] Cultural imagery reviewed

---

## Sources Summary

**RTL/i18n:**
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [Weglot RTL Design Guide](https://www.weglot.com/blog/rtl-web)
- [i18next Arabic Pluralization](https://medium.com/swlh/dealing-with-arabic-when-using-i18next-348ed55f7c1a)
- [Flowbite Tailwind RTL](https://flowbite.com/docs/customize/rtl/)

**Animation/Accessibility:**
- [Framer Motion Performance Tips](https://tillitsdone.com/blogs/framer-motion-performance-tips/)
- [Pope Tech Accessible Animation](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [Josh Comeau prefers-reduced-motion](https://www.joshwcomeau.com/react/prefers-reduced-motion/)

**SEO:**
- [Botify Hreflang Guide](https://www.botify.com/blog/international-seo-hreflang)
- [Google Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

**Performance:**
- [React Lazy Loading Images](https://www.freecodecamp.org/news/how-to-lazy-load-images-in-react/)
- [Arabic Website Font Study](https://hackernoon.com/results-font-image-usage-and-performance-trends-across-73-arabic-websites)
