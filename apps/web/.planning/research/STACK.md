# Technology Stack

**Project:** Jerash For Oil Field Services Website
**Researched:** 2026-01-21
**Overall Confidence:** HIGH

## Executive Summary

The existing stack is exceptionally well-chosen for this project. React 19 + TypeScript + Vite + Tailwind + Framer Motion + react-i18next + React Router + shadcn/ui + React Query + Zustand covers 90% of what's needed. This research identifies the **minimal additions** required to fill gaps for image galleries, file uploads, and production optimizations.

**Philosophy:** Add only what's necessary. The current stack already handles animations, RTL, forms, state, and UI components. We're filling specific gaps, not adding alternatives.

---

## Current Stack Assessment

### Already Excellent - DO NOT ADD ALTERNATIVES

| Technology | Version | Status | Notes |
|------------|---------|--------|-------|
| React | 19.2.0 | Current | Latest stable with compiler |
| TypeScript | 5.9.3 | Current | Strict mode enabled |
| Vite (Rolldown) | 7.2.5 | Current | Bleeding edge, excellent performance |
| Tailwind CSS | 4.1.18 | Current | v4 with built-in RTL support |
| Framer Motion | 12.24.3 | Current | Use for all animations |
| react-i18next | 16.5.1 | Current | RTL support configured |
| React Router | 7.11.0 | Current | Latest major version |
| shadcn/ui | 3.6.3 | Current | Use for all UI components |
| React Query | 5.90.16 | Current | Data fetching covered |
| Zustand | 5.0.9 | Current | State management covered |
| React Hook Form | 7.70.0 | Current | Form handling covered |
| Zod | 4.3.5 | Current | Validation covered |
| Axios | 1.13.2 | Current | HTTP client covered |
| react-helmet-async | 2.0.5 | Current | SEO covered |
| Lucide React | 0.562.0 | Current | Icons covered |
| GSAP | 3.14.2 | Available | Use for complex scroll animations |

**Confidence: HIGH** - Verified against package.json and official docs.

---

## Recommended Additions

### 1. Image Gallery & Lightbox

**Add: yet-another-react-lightbox**

| Library | Version | Purpose | Bundle Size |
|---------|---------|---------|-------------|
| yet-another-react-lightbox | ^3.28.0 | Lightbox for image galleries | ~15kb core |

**Why this library:**
- Most actively maintained React lightbox (updated December 2024)
- Works with React 19, 18, 17, and 16.8+
- Plugin architecture - only load features you need
- Touch gestures, keyboard navigation, accessibility built-in
- Responsive images with automatic srcset support
- No jQuery dependency

**Confidence: HIGH** - Verified via official docs and npm registry.

**Alternatives considered:**
- PhotoSwipe: Heavier, more complex setup
- lightGallery: Commercial license required for business use
- Simple React Lightbox: Deprecated, do not use

```bash
pnpm add yet-another-react-lightbox
```

**Plugins to consider:**
```typescript
// Only import plugins you need
import "yet-another-react-lightbox/plugins/thumbnails.css"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
```

---

### 2. Masonry Grid Layout

**Add: react-masonry-css**

| Library | Version | Purpose | Bundle Size |
|---------|---------|---------|-------------|
| react-masonry-css | ^1.0.16 | CSS-based masonry grid | ~2kb |

**Why this library:**
- Zero dependencies
- Pure CSS implementation (no JS layout calculations)
- Excellent performance
- Simple API with breakpoint configuration
- Widely adopted (4400+ GitHub stars)

**Confidence: HIGH** - CSS-based approach is more reliable than JS-based alternatives.

**Alternatives considered:**
- masonic: More complex, virtualization overkill for <100 images
- @masonry-grid/react: Newer, less battle-tested
- Material UI Masonry: Would add MUI dependency

```bash
pnpm add react-masonry-css
```

**Usage pattern:**
```tsx
import Masonry from "react-masonry-css"

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
}

<Masonry
  breakpointCols={breakpointColumns}
  className="masonry-grid"
  columnClassName="masonry-column"
>
  {images.map(img => <GalleryImage key={img.id} {...img} />)}
</Masonry>
```

---

### 3. File Upload (CV Submission)

**Add: react-dropzone**

| Library | Version | Purpose | Bundle Size |
|---------|---------|---------|-------------|
| react-dropzone | ^14.3.8 | Drag-and-drop file upload | ~10kb |

**Why this library:**
- Industry standard for React file uploads
- 10,962 GitHub stars, actively maintained
- Hook-based API fits React 19 patterns
- HTML5 drag-and-drop compliant
- Accessible with keyboard support
- Easy to integrate with shadcn/ui styling

**Confidence: HIGH** - Most widely used React file upload solution.

**Important note:** react-dropzone handles file selection only. For actual HTTP uploads, use the existing Axios + React Query setup.

```bash
pnpm add react-dropzone
```

**Integration with shadcn/ui:**
```tsx
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

function CVUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    onDropAccepted: (files) => onFileSelect(files[0])
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary"
      )}
    >
      <input {...getInputProps()} />
      {/* ... content */}
    </div>
  )
}
```

---

### 4. Toast Notifications

**Add: sonner**

| Library | Version | Purpose | Bundle Size |
|---------|---------|---------|-------------|
| sonner | ^2.0.0 | Toast notifications | ~5kb |

**Why this library:**
- Official shadcn/ui recommendation (toast component deprecated)
- Beautiful default styling that matches shadcn/ui
- Multiple toast types: success, error, warning, info, promise
- Accessible with ARIA roles
- Customizable duration and appearance

**Confidence: HIGH** - Official shadcn/ui integration path.

```bash
pnpm dlx shadcn@latest add sonner
```

This will add sonner and the Toaster component to your project.

---

### 5. Carousel (shadcn/ui built-in)

**Use: shadcn/ui carousel (Embla-based)**

Do NOT add a separate carousel library. shadcn/ui includes a carousel component built on Embla Carousel.

```bash
pnpm dlx shadcn@latest add carousel
```

**Why built-in:**
- Consistent with design system
- Embla Carousel is excellent for touch gestures
- Tailwind styling out of the box
- Already part of shadcn/ui ecosystem

---

## Build & Production Optimization

### 6. Image Optimization (Build-time)

**Add: vite-plugin-image-optimizer + sharp**

| Library | Version | Purpose |
|---------|---------|---------|
| vite-plugin-image-optimizer | ^1.1.8 | Build-time image compression |
| sharp | ^0.33.0 | Image processing engine |

**Why:**
- Automatic WebP/AVIF generation
- Build-time optimization (no runtime cost)
- Significant file size reduction (70-90% for photos)
- Caching support to avoid re-processing

**Confidence: MEDIUM** - Verify sharp compatibility with your deployment environment.

```bash
pnpm add -D vite-plugin-image-optimizer sharp
```

**vite.config.ts addition:**
```typescript
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"

export default defineConfig({
  plugins: [
    // ... existing plugins
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 75 },
      webp: { quality: 80, lossless: false },
      avif: { quality: 65 },
    }),
  ],
})
```

---

## RTL Considerations

### Tailwind CSS v4 RTL Support

Tailwind v4 (which you have) includes excellent RTL support. **No additional plugin needed.**

**Key patterns already documented in your TAILWIND.md and I18N.md:**

| LTR Utility | RTL-Ready Logical Equivalent |
|-------------|------------------------------|
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
| `rounded-l-*` | `rounded-s-*` |
| `rounded-r-*` | `rounded-e-*` |

**For icons that need flipping:**
```html
<ChevronRight className="rtl:rotate-180" />
```

**Document direction setup (already in I18N.md):**
```tsx
useEffect(() => {
  document.documentElement.dir = i18n.dir()
  document.documentElement.lang = i18n.language
}, [i18n.language])
```

---

## What NOT to Add

These are common additions that are **unnecessary** given your current stack:

| Library | Why NOT to add |
|---------|----------------|
| Swiper | shadcn/ui carousel (Embla) already handles this |
| react-spring | Framer Motion already handles all animations |
| redux / redux-toolkit | Zustand already handles state |
| styled-components | Tailwind CSS already handles styling |
| axios-hooks | React Query already handles data fetching |
| react-query-devtools | Already installed |
| classnames | clsx + tailwind-merge (cn) already installed |
| react-router-dom | react-router v7 includes everything |
| @tanstack/react-form | React Hook Form already installed |
| yup | Zod already installed |
| formik | React Hook Form already installed |
| react-icons | Lucide React already installed |
| heroicons | Lucide React already installed |
| react-transition-group | Framer Motion handles transitions |
| react-modal | shadcn/ui Dialog handles modals |
| react-select | shadcn/ui Select handles dropdowns |
| react-toastify | Use Sonner (shadcn/ui standard) |
| notistack | Use Sonner (shadcn/ui standard) |
| tailwindcss-rtl | Tailwind v4 has built-in RTL support |
| tailwindcss-flip | Tailwind v4 has built-in RTL support |

---

## Final Installation Commands

```bash
# New dependencies for gaps
pnpm add yet-another-react-lightbox react-masonry-css react-dropzone

# shadcn/ui components (if not already added)
pnpm dlx shadcn@latest add sonner carousel

# Dev dependencies for build optimization
pnpm add -D vite-plugin-image-optimizer sharp
```

---

## Summary

| Category | Solution | Confidence |
|----------|----------|------------|
| Lightbox | yet-another-react-lightbox | HIGH |
| Masonry Grid | react-masonry-css | HIGH |
| File Upload | react-dropzone | HIGH |
| Toast | sonner (via shadcn/ui) | HIGH |
| Carousel | shadcn/ui carousel (Embla) | HIGH |
| Image Optimization | vite-plugin-image-optimizer + sharp | MEDIUM |
| RTL Support | Built into Tailwind v4 | HIGH |
| Everything else | Already covered by existing stack | HIGH |

**Total new runtime dependencies:** 3 (lightbox, masonry, dropzone)
**Total new dev dependencies:** 2 (image optimizer, sharp)
**New shadcn/ui components:** 2 (sonner, carousel)

This is a minimal, focused addition to an already excellent stack.

---

## Sources

### Libraries Verified
- [yet-another-react-lightbox](https://yet-another-react-lightbox.com/) - Official docs
- [react-masonry-css](https://github.com/paulcollett/react-masonry-css) - GitHub
- [react-dropzone](https://react-dropzone.js.org/) - Official docs
- [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/sonner) - Official docs
- [shadcn/ui Carousel](https://ui.shadcn.com/docs/components/carousel) - Official docs
- [vite-plugin-image-optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer) - GitHub

### RTL Best Practices
- [Tailwind CSS RTL Support](https://flowbite.com/docs/customize/rtl/) - Flowbite docs
- [shadcn/ui RTL Guidelines](https://github.com/shadcn-ui/ui/issues/2759) - GitHub issue

### Image Optimization
- [Lazy Loading Images Guide 2025](https://stateofcloud.com/lazy-loading-images-implementation-guide-for-2025/)
- [React Image Optimization](https://uploadcare.com/blog/react-image-optimization-techniques/) - Uploadcare
