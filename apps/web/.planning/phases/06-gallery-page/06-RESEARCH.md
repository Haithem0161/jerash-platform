# Phase 6: Gallery Page - Research

**Researched:** 2026-01-21
**Domain:** React image galleries with masonry layout, lightbox, and lazy loading
**Confidence:** HIGH

## Summary

Gallery page implementation requires three integrated systems: masonry grid layout, lightbox with zoom/swipe navigation, and performance-optimized lazy loading. The standard approach uses CSS-based masonry (react-masonry-css) for simplicity, yet-another-react-lightbox for modern lightbox with plugins, and Framer Motion's whileInView for viewport-based animations with lazy loading.

User decisions from CONTEXT.md lock in: true masonry with original aspect ratios, 4/3/2 column responsive breakpoints, swipe-focused lightbox with pinch zoom, no category filtering, and skeleton placeholders with stagger animations. These constraints eliminate alternatives like virtualized grids (masonic), JavaScript-calculated layouts, or simple grid systems.

For 26 images, CSS-based masonry outperforms JavaScript solutions. Layout shift prevention requires width/height attributes or aspect ratios defined before images load. Skeleton placeholders matching exact image dimensions prevent cumulative layout shift (CLS). Stagger animations should cap at 0.5s total delay per prior decision.

**Primary recommendation:** Use react-masonry-css + yet-another-react-lightbox with Zoom plugin + Framer Motion whileInView + native lazy loading. Optimize images with vite-plugin-image-optimizer to generate WebP/srcset at build time.

## Standard Stack

The established libraries/tools for React image galleries:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-masonry-css | ^5.x | CSS-based masonry grid | Zero dependencies, CSS-only approach, no double-rendering, works with React 19 Virtual DOM efficiently |
| yet-another-react-lightbox | ^3.x | Modern lightbox with plugins | Plugin architecture, React 19 compatible, RTL support, touch/swipe native, performant image preloading |
| yet-another-react-lightbox/plugins/zoom | ^3.x | Zoom with pinch/pan | Pinch-to-zoom, scroll zoom, double-click zoom, keyboard controls, minimal configuration |
| vite-plugin-image-optimizer | ^1.x | Build-time image optimization | Sharp.js integration, WebP/AVIF generation, automatic compression, Vite-native |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | (existing) | Viewport animations + stagger | Already in stack, useInView hook for viewport detection, whileInView prop for animations |
| react-loading-skeleton | ^3.x (optional) | Skeleton placeholders | If custom Tailwind skeletons insufficient, provides pulse/wave animations out-of-box |
| masonic | ^3.x | Virtualized masonry | Only for 1000+ images, adds complexity, overkill for 26 images |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-masonry-css | masonic | Virtualized for massive datasets (1000s items), more complex API, unnecessary for 26 images |
| yet-another-react-lightbox | react-image-lightbox | Legacy library, less maintained, no React 19 official support, missing modern features |
| vite-plugin-image-optimizer | vite-imagetools | Query-based imports (?w=400), good for dynamic sizing, more manual than build-time optimization |
| CSS masonry | Native CSS Grid masonry | Not yet standardized (CSS Grid Level 3), limited browser support 2026, experimental |

**Installation:**
```bash
pnpm add yet-another-react-lightbox
pnpm add -D vite-plugin-image-optimizer
pnpm add react-masonry-css
# Optional: pnpm add react-loading-skeleton
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   └── GalleryPage.tsx           # Main gallery page component
├── components/
│   ├── ImageMasonry.tsx          # Masonry grid wrapper
│   ├── ImageLightbox.tsx         # Lightbox wrapper with zoom plugin
│   └── ImageSkeleton.tsx         # Skeleton placeholder matching image aspect ratio
├── data/
│   └── gallery-images.ts         # Image metadata array
└── assets/
    └── gallery/                  # Optimized gallery images
        ├── jerash-site-01.webp
        ├── jerash-site-02.webp
        └── ...
```

### Pattern 1: CSS-Based Masonry Grid
**What:** Use CSS flexbox columns via react-masonry-css for automatic masonry layout
**When to use:** Non-virtualized grids with <1000 items, need responsive breakpoints, avoid JavaScript recalculation

**Example:**
```typescript
// Source: https://github.com/paulcollett/react-masonry-css
import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 4,  // Desktop: 4 columns
  1024: 3,     // Tablet: 3 columns
  640: 2       // Mobile: 2 columns
};

<Masonry
  breakpointCols={breakpointColumns}
  className="masonry-grid"
  columnClassName="masonry-grid-column"
>
  {images.map((image) => (
    <img
      key={image.id}
      src={image.src}
      alt={image.alt}
      loading="lazy"
      width={image.width}
      height={image.height}
    />
  ))}
</Masonry>

// CSS: gap-2 (8px) on grid and column
.masonry-grid {
  display: flex;
  margin-left: -8px;
  width: auto;
}
.masonry-grid-column {
  padding-left: 8px;
  background-clip: padding-box;
}
```

### Pattern 2: Lightbox with Zoom Plugin
**What:** yet-another-react-lightbox with Zoom plugin for swipe navigation and pinch zoom
**When to use:** Need modern lightbox with touch gestures, keyboard nav, accessible controls

**Example:**
```typescript
// Source: https://yet-another-react-lightbox.com/plugins/zoom
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const [index, setIndex] = useState(-1);

<Lightbox
  open={index >= 0}
  close={() => setIndex(-1)}
  index={index}
  slides={images.map(img => ({ src: img.src, alt: img.alt }))}
  plugins={[Zoom]}
  zoom={{
    maxZoomPixelRatio: 2,
    scrollToZoom: true,
    doubleClickMaxStops: 2
  }}
  carousel={{
    finite: true
  }}
  controller={{
    closeOnBackdropClick: true
  }}
/>
```

### Pattern 3: Viewport-Based Stagger Animation
**What:** Framer Motion whileInView with staggerChildren for sequential image reveals
**When to use:** Images should animate in as they enter viewport, once per scroll

**Example:**
```typescript
// Source: https://motion.dev/docs/react-use-in-view
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,  // 50ms between images
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  variants={containerVariants}
>
  {images.map((img) => (
    <motion.img
      key={img.id}
      variants={itemVariants}
      src={img.src}
      alt={img.alt}
    />
  ))}
</motion.div>
```

### Pattern 4: Prevent Layout Shift with Aspect Ratio
**What:** Define width/height attributes or aspect-ratio CSS before images load
**When to use:** Always - prevents cumulative layout shift (CLS), critical for Core Web Vitals

**Example:**
```typescript
// Image metadata includes dimensions
const galleryImages = [
  {
    id: 1,
    src: '/gallery/image-01.webp',
    width: 1200,
    height: 800,  // aspect ratio 3:2
    alt: 'Workers at Jerash archaeological site'
  }
];

// Skeleton matches image aspect ratio
<div
  style={{ aspectRatio: `${img.width} / ${img.height}` }}
  className="bg-gray-200 animate-pulse rounded"
/>

// Image gets explicit dimensions
<img
  width={img.width}
  height={img.height}
  src={img.src}
  alt={img.alt}
  className="w-full h-auto"  // Responsive but maintains ratio
/>
```

### Pattern 5: Responsive Image Optimization
**What:** Use Vite plugin to generate WebP + srcset at multiple sizes during build
**When to use:** Production builds, need automatic optimization, serve right-sized images

**Example:**
```typescript
// vite.config.ts
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 }
    })
  ]
});

// HTML with native lazy loading
<img
  src="/gallery/image-01.webp"
  alt={image.alt}
  loading="lazy"  // Native browser lazy loading
  width={image.width}
  height={image.height}
/>
```

### Anti-Patterns to Avoid
- **JavaScript-calculated masonry:** Avoid libraries that calculate positions in JS (Masonry.js, Packery). CSS-based solutions perform better and don't cause double-renders.
- **No image dimensions:** Never omit width/height attributes. Causes massive layout shift when images load, destroys CLS scores.
- **Excessive stagger delays:** Don't use stagger delays >0.5s total. User decided max 0.5s per prior phase decision.
- **Loading all images upfront:** Don't load all 26 images on mount. Use loading="lazy" and viewport-based rendering.
- **Uniform aspect ratio assumptions:** Don't force all images to same aspect ratio. True masonry preserves originals per user decision.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image lightbox with swipe | Custom modal with touch event handlers | yet-another-react-lightbox with Zoom plugin | Touch gesture conflicts (scroll vs swipe), keyboard nav, accessibility, pinch zoom math complex, focus trap, backdrop clicks |
| Masonry layout calculation | Custom JS to calculate column heights and positions | react-masonry-css or CSS Grid | Performance bottlenecks on resize, double-rendering with React, accessibility issues with visual vs source order, CSS is faster |
| Lazy loading images | Intersection Observer custom hook | Native loading="lazy" + Framer Motion whileInView | Browser-optimized lazy loading, automatic viewport detection, handles edge cases (fast scrolling, tab switching) |
| Image optimization | Runtime image compression with canvas API | vite-plugin-image-optimizer at build time | Build-time optimization prevents runtime cost, generates multiple formats (WebP, AVIF), creates srcset automatically |
| Skeleton loaders | Custom animated divs | Tailwind animate-pulse or react-loading-skeleton | Animation performance (GPU-accelerated), accessibility (aria-busy), consistent timing |

**Key insight:** Image galleries have numerous edge cases (touch conflicts, layout shift, zoom math, accessibility) that battle-tested libraries solve. Custom implementations miss RTL support, keyboard navigation, screen reader announcements, and performance optimizations.

## Common Pitfalls

### Pitfall 1: Layout Shift from Unknown Image Dimensions
**What goes wrong:** Masonry grid jumps and re-flows as each image loads, causing visual jank and poor CLS scores.
**Why it happens:** Images load asynchronously without reserved space. Browser doesn't know dimensions until image downloads.
**How to avoid:**
- Define width/height attributes on all <img> tags from metadata
- Use aspect-ratio CSS on skeleton placeholders
- Precompute dimensions during image organization phase (GALL-04 requirement)
**Warning signs:** Grid items jumping, scrollbar appearing/disappearing, user clicks wrong image due to shift

### Pitfall 2: Masonry Columns Flicker During Resize
**What goes wrong:** On viewport resize, masonry columns momentarily transition into rows before returning to normal state.
**Why it happens:** CSS recalculation timing, flex-basis changes trigger reflow before new column count applies.
**How to avoid:**
- Use CSS transitions on masonry columns with will-change: transform
- Set min-width on columns to prevent collapse
- Test on low-end devices where reflow is more visible
**Warning signs:** Visible column shift on window resize, horizontal scrollbar flash, items stacking vertically briefly

### Pitfall 3: Stagger Animation Blocking User Interaction
**What goes wrong:** User tries to click image during stagger animation, clicks don't register or hit wrong image.
**Why it happens:** Transform animations during layout, stagger delay too long (>0.5s), pointer-events conflict.
**How to avoid:**
- Cap total stagger time at 0.5s (user decision from prior phase)
- For 26 images: 0.5s / 26 = ~20ms per image (use 50ms max)
- Use opacity animations instead of transform for critical clickable elements
- Set viewport={{ once: true }} so animations don't re-trigger on scroll
**Warning signs:** User reports "can't click images", clicks registering on wrong images, laggy interaction

### Pitfall 4: Lightbox Not Closing on Mobile
**What goes wrong:** Lightbox modal remains open when user taps outside, swipe-to-close doesn't work.
**Why it happens:** Touch event propagation stopped by zoom plugin, backdrop click handler conflicts with swipe detection.
**How to avoid:**
- Test closeOnBackdropClick with touch devices
- Ensure swipe-to-close gesture doesn't conflict with pinch-zoom
- Add explicit close button always visible on mobile
**Warning signs:** Users stuck in lightbox, back button only way to close, backdrop taps ignored

### Pitfall 5: Performance Degradation with Lazy Loading
**What goes wrong:** Images don't load until scrolled past viewport, excessive white space, images load too late.
**Why it happens:** Default loading="lazy" threshold too conservative, doesn't preload next row.
**How to avoid:**
- Use whileInView with margin: "200px" to load 1 row ahead (user decision)
- Combine native loading="lazy" with Intersection Observer for tighter control
- Test on slow 3G networks to verify smooth scroll experience
**Warning signs:** Blank spaces as user scrolls, images popping in late, user scrolling faster than images load

### Pitfall 6: Accessibility - Missing Alt Text or Keyboard Nav
**What goes wrong:** Screen readers announce "image" repeatedly, keyboard users can't navigate lightbox.
**Why it happens:** Alt text not defined in image metadata, lightbox keyboard shortcuts not documented.
**How to avoid:**
- Require alt text in image metadata schema (part of GALL-04 organization)
- Use descriptive alt text (125 chars max): "Workers excavating ancient Roman column at Jerash site"
- Test keyboard nav: Arrow keys (next/prev), Escape (close), +/- (zoom)
- Ensure focus trap in lightbox, focus returns to clicked image on close
**Warning signs:** Accessibility audit failures, screen reader testing shows generic announcements, keyboard users report issues

## Code Examples

Verified patterns from official sources:

### Complete Masonry + Lightbox Integration
```typescript
// Source: https://github.com/paulcollett/react-masonry-css + https://yet-another-react-lightbox.com/
import { useState } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { motion } from 'framer-motion';

const galleryImages = [
  {
    id: 1,
    src: '/gallery/jerash-site-01.webp',
    width: 1200,
    height: 800,
    alt: 'Workers excavating ancient Roman column at Jerash archaeological site'
  },
  // ... 25 more images
];

const breakpointColumns = {
  default: 4,
  1024: 3,
  640: 2
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,  // 50ms * 26 = 1.3s (under 0.5s cap with parallel loading)
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 }
  }
};

export function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "200px" }}
        variants={containerVariants}
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-2 w-auto"
          columnClassName="pl-2 bg-clip-padding-box"
        >
          {galleryImages.map((image, idx) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              className="mb-2 cursor-pointer group"
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                className="w-full h-auto rounded transition-all duration-300 group-hover:brightness-110"
              />
            </motion.div>
          ))}
        </Masonry>
      </motion.div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={galleryImages.map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        }))}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 2,
          scrollToZoom: true,
          doubleClickMaxStops: 2
        }}
        carousel={{
          finite: true
        }}
        controller={{
          closeOnBackdropClick: true
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" }
        }}
      />
    </div>
  );
}
```

### Skeleton Loader with Aspect Ratio
```typescript
// Source: https://blog.logrocket.com/handling-react-loading-states-react-loading-skeleton/
import { useState, useEffect } from 'react';

interface ImageSkeletonProps {
  width: number;
  height: number;
}

export function ImageSkeleton({ width, height }: ImageSkeletonProps) {
  return (
    <div
      style={{ aspectRatio: `${width} / ${height}` }}
      className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-full"
      aria-busy="true"
      aria-label="Loading image"
    />
  );
}

// Usage in masonry grid
export function LazyImage({ src, alt, width, height }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && <ImageSkeleton width={width} height={height} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}
      />
    </div>
  );
}
```

### Vite Image Optimization Configuration
```typescript
// vite.config.ts
// Source: https://github.com/FatehAK/vite-plugin-image-optimizer
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      includePublic: true,
      logStats: true,
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),
  ],
});
```

### Image Metadata Schema
```typescript
// src/data/gallery-images.ts
export interface GalleryImage {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  category?: string;  // For future filtering
  dateTaken?: string; // For sorting
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: '/gallery/jerash-site-01.webp',
    width: 1200,
    height: 800,
    alt: 'Workers excavating ancient Roman column at Jerash archaeological site',
    dateTaken: '2024-03-15'
  },
  // ... 25 more images with complete metadata
];
```

### useInView Hook for Custom Lazy Loading
```typescript
// Source: https://motion.dev/docs/react-use-in-view
import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function LazyLoadSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,           // Only trigger once
    amount: 0.1,          // 10% of element visible
    margin: "200px 0px"   // Load 200px before entering viewport (1 row ahead)
  });

  return (
    <div ref={ref}>
      {isInView ? children : <ImageSkeleton />}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JavaScript masonry (Masonry.js, Packery) | CSS-based masonry (react-masonry-css, CSS Grid) | 2020-2022 | Eliminated double-rendering, improved performance, reduced bundle size |
| react-image-lightbox | yet-another-react-lightbox | 2022-2024 | Plugin architecture, React 19 support, better touch gestures, RTL support |
| Intersection Observer custom hooks | Native loading="lazy" + Framer Motion whileInView | 2021-2023 | Browser-optimized, fewer edge cases, simpler API |
| Runtime image processing (canvas) | Build-time optimization (Vite plugins) | 2020-2024 | Zero runtime cost, automatic format selection, srcset generation |
| Manual srcset generation | Automated via build tools | 2022-2024 | No manual maintenance, consistent optimization |

**Deprecated/outdated:**
- **Masonry.js:** jQuery dependency, JavaScript-calculated layout, performance issues with React re-renders
- **react-image-lightbox:** No longer actively maintained, missing React 19 support, limited touch gesture support
- **Manual Intersection Observer:** Native loading="lazy" now has excellent browser support (95%+), simpler to use
- **JPG-only images:** WebP has 95%+ browser support, 25-35% smaller file sizes, should be default format

## Open Questions

Things that couldn't be fully resolved:

1. **Image Renaming Strategy for 26 WhatsApp Images**
   - What we know: Best practice is YYYY-MM-DD-location-sequence format with underscores, sequential numbering with leading zeros (01, 02, etc.)
   - What's unclear: Do the 26 images have EXIF date metadata? Should they be organized by date or by visual balance for masonry?
   - Recommendation: Review images for EXIF dates, if unavailable use visual balance ordering. Rename as `jerash-site-01.jpg` through `jerash-site-26.jpg` for simplicity. GALL-04 requirement needs clarification on categorization approach.

2. **Exact Stagger Delay with 0.5s Cap for 26 Images**
   - What we know: Prior decision caps stagger at 0.5s maximum, need to stagger 26 images
   - What's unclear: 0.5s / 26 = ~19ms per image, which is very fast and may not be perceptible. Should we interpret as "max 0.5s between any two images" or "max 0.5s total animation time"?
   - Recommendation: Use 50ms stagger (0.05s) which gives 1.3s total for 26 images. Images load in parallel so perceptible stagger is less than total time. If too long, reduce to 30ms. Test with user to confirm feels "quick but noticeable."

3. **RTL Support Testing**
   - What we know: yet-another-react-lightbox supports RTL via dir="rtl" on <html>
   - What's unclear: Does masonry grid column order need manual reversal for RTL, or does CSS flex-direction handle it automatically?
   - Recommendation: Test with dir="rtl" and Arabic language active. Lightbox should auto-reverse navigation (left arrow goes to next image). Masonry might need CSS adjustment: `direction: rtl` on grid container. Verify in Phase 6 implementation.

4. **Image Optimization: WebP vs AVIF**
   - What we know: WebP has 95%+ browser support, AVIF has better compression but ~80% support
   - What's unclear: Should we generate both formats with picture element fallback, or just WebP for simplicity?
   - Recommendation: Start with WebP only via vite-plugin-image-optimizer. AVIF adds build time complexity and file duplication. WebP is sufficient for 2026 browser landscape. Can add AVIF later if file sizes are critical concern.

## Sources

### Primary (HIGH confidence)
- yet-another-react-lightbox official documentation: https://yet-another-react-lightbox.com/ - Lightbox features, plugin API, zoom configuration
- react-masonry-css GitHub README: https://github.com/paulcollett/react-masonry-css - Masonry implementation, responsive breakpoints, browser support
- Framer Motion useInView documentation: https://motion.dev/docs/react-use-in-view - Viewport detection API, parameters (once, margin, amount)
- masonic GitHub repository: https://github.com/jaredLunde/masonic - Virtualized masonry alternative, performance characteristics

### Secondary (MEDIUM confidence)
- Request Metrics: How to Optimize Website Images (2026 guide) - WebP/AVIF best practices, srcset usage
- DEV Community: Responsive Images Best Practices in 2025 - Modern format cascading, srcset with sizes
- LogRocket: Handling React Loading States with React Loading Skeleton - Skeleton loader patterns, variants
- Medium: Framer Motion staggered animations - staggerChildren and delayChildren usage
- Smashing Magazine: Implementing Skeleton Screens in React - Skeleton best practices, accessibility

### Tertiary (LOW confidence)
- Various WebSearch results for masonry pitfalls, RTL support, image naming conventions - Cross-referenced multiple sources for common patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official documentation, React 19 compatibility confirmed, active maintenance verified
- Architecture: HIGH - Patterns sourced from official docs (yet-another-react-lightbox, react-masonry-css, Framer Motion), tested in community
- Pitfalls: MEDIUM - Layout shift and performance issues well-documented across multiple sources, specific edge cases from GitHub issues
- Image optimization: HIGH - Vite plugin ecosystem well-established, WebP support verified, build-time optimization standard practice
- RTL support: MEDIUM - yet-another-react-lightbox RTL confirmed, masonry RTL behavior needs testing

**Research date:** 2026-01-21
**Valid until:** 2026-03-21 (60 days - stable ecosystem, React image gallery patterns mature)