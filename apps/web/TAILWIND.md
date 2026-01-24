# Tailwind CSS Guide

## Installation (Vite)

```bash
pnpm add tailwindcss @tailwindcss/vite
```

```typescript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

## Theme Configuration

Use `@theme` directive to customize design tokens:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-brand-50: oklch(0.97 0.01 250);
  --color-brand-100: oklch(0.93 0.03 250);
  --color-brand-500: oklch(0.55 0.2 250);
  --color-brand-600: oklch(0.48 0.2 250);
  --color-brand-900: oklch(0.25 0.1 250);

  /* Typography */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Cal Sans", var(--font-sans);
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Spacing (base unit) */
  --spacing: 4px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  /* Custom breakpoints */
  --breakpoint-xs: 475px;
  --breakpoint-3xl: 1920px;

  /* Easing curves */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Animations */
  --animate-fade-in: fade-in 0.3s var(--ease-smooth);
  --animate-slide-up: slide-up 0.4s var(--ease-smooth);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Responsive Design

Mobile-first breakpoints (prefix applies at that size and up):

| Prefix | Min Width | CSS |
|--------|-----------|-----|
| `sm:`  | 640px     | `@media (min-width: 640px)` |
| `md:`  | 768px     | `@media (min-width: 768px)` |
| `lg:`  | 1024px    | `@media (min-width: 1024px)` |
| `xl:`  | 1280px    | `@media (min-width: 1280px)` |
| `2xl:` | 1536px    | `@media (min-width: 1536px)` |

```html
<!-- Mobile first: stack on mobile, side-by-side on larger -->
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/2">Left</div>
  <div class="w-full md:w-1/2">Right</div>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- items -->
</div>

<!-- Responsive text -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

<!-- Hide/show at breakpoints -->
<div class="hidden md:block">Desktop only</div>
<div class="md:hidden">Mobile only</div>
```

## Dark Mode

```html
<!-- Automatic (prefers-color-scheme) -->
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">Title</h1>
  <p class="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Manual Dark Mode Toggle

```css
/* Use class-based dark mode */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

```tsx
// Toggle script (place in <head> to avoid FOUC)
function ThemeToggle() {
  const toggleDark = () => {
    document.documentElement.classList.toggle("dark")
    localStorage.theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  }

  return <button onClick={toggleDark}>Toggle theme</button>
}

// Initialize on page load
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark")
}
```

## State Variants

### Interactive States

```html
<button class="
  bg-blue-500
  hover:bg-blue-600
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  active:bg-blue-700
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Button
</button>

<!-- Focus visible (keyboard only) -->
<button class="focus-visible:ring-2 focus-visible:ring-blue-500">
  Accessible Focus
</button>
```

### Group & Peer

```html
<!-- Group: style children based on parent state -->
<a href="#" class="group block p-4 hover:bg-gray-100">
  <h3 class="text-gray-900 group-hover:text-blue-600">Title</h3>
  <p class="text-gray-500 group-hover:text-gray-700">Description</p>
  <svg class="text-gray-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1">
    <!-- arrow icon -->
  </svg>
</a>

<!-- Peer: style based on sibling state -->
<label class="block">
  <input type="email" class="peer border rounded px-3 py-2" />
  <p class="mt-1 invisible peer-invalid:visible text-red-500 text-sm">
    Please enter a valid email
  </p>
</label>

<!-- Named groups for nested scenarios -->
<div class="group/card">
  <div class="group/button">
    <span class="group-hover/card:text-blue-500 group-hover/button:underline">
      Text
    </span>
  </div>
</div>
```

### Other Useful Variants

```html
<!-- First/last child -->
<li class="first:pt-0 last:pb-0 border-b last:border-0">Item</li>

<!-- Odd/even rows -->
<tr class="odd:bg-gray-50 even:bg-white">Row</tr>

<!-- Empty state -->
<div class="empty:hidden"><!-- Only shown if has content --></div>

<!-- Form states -->
<input class="
  required:border-red-500
  invalid:border-red-500
  valid:border-green-500
  placeholder-shown:border-gray-300
  read-only:bg-gray-100
  autofill:bg-yellow-100
"/>

<!-- Before/After pseudo-elements -->
<span class="before:content-['•'] before:mr-2 before:text-blue-500">
  List item
</span>

<!-- Selection styling -->
<p class="selection:bg-blue-200 selection:text-blue-900">
  Select this text
</p>
```

### Stacking Variants

```html
<!-- Multiple conditions -->
<button class="dark:hover:bg-gray-700">Dark hover</button>
<button class="sm:dark:hover:bg-gray-700">Responsive + dark + hover</button>
<button class="group-hover:sm:block">Group + responsive</button>
```

## Layout Patterns

### Flexbox

```html
<!-- Centered content -->
<div class="flex items-center justify-center min-h-screen">
  <div>Centered</div>
</div>

<!-- Space between -->
<div class="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Flex wrap with gap -->
<div class="flex flex-wrap gap-4">
  <div class="flex-1 min-w-[200px]">Item</div>
  <div class="flex-1 min-w-[200px]">Item</div>
  <div class="flex-1 min-w-[200px]">Item</div>
</div>

<!-- Sidebar layout -->
<div class="flex">
  <aside class="w-64 shrink-0">Sidebar</aside>
  <main class="flex-1 min-w-0">Content</main>
</div>
```

### Grid

```html
<!-- Basic grid -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- cards -->
</div>

<!-- Auto-fit grid (responsive without breakpoints) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <!-- items auto-wrap -->
</div>

<!-- Grid spanning -->
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">Wide</div>
  <div>Normal</div>
  <div>Normal</div>
  <div class="col-span-4">Full width</div>
</div>

<!-- Named grid areas -->
<div class="grid grid-cols-[1fr_3fr] grid-rows-[auto_1fr_auto] min-h-screen">
  <header class="col-span-2">Header</header>
  <aside>Sidebar</aside>
  <main>Content</main>
  <footer class="col-span-2">Footer</footer>
</div>
```

## Spacing System

Base unit is configurable (default 4px = 1 unit):

| Class | Value |
|-------|-------|
| `p-0` | 0px |
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

```html
<!-- Padding -->
<div class="p-4">All sides</div>
<div class="px-4 py-2">Horizontal / Vertical</div>
<div class="pt-4 pr-2 pb-4 pl-2">Individual sides</div>

<!-- Margin -->
<div class="m-4">All sides</div>
<div class="mx-auto">Center horizontally</div>
<div class="mt-8 mb-4">Top and bottom</div>
<div class="-mt-4">Negative margin</div>

<!-- Space between children -->
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Gap (for flex/grid) -->
<div class="flex gap-4">Items with gap</div>
<div class="grid gap-x-4 gap-y-8">Different x/y gaps</div>
```

## Typography

```html
<!-- Font sizes -->
<p class="text-xs">12px</p>
<p class="text-sm">14px</p>
<p class="text-base">16px</p>
<p class="text-lg">18px</p>
<p class="text-xl">20px</p>
<p class="text-2xl">24px</p>

<!-- Font weight -->
<p class="font-light">300</p>
<p class="font-normal">400</p>
<p class="font-medium">500</p>
<p class="font-semibold">600</p>
<p class="font-bold">700</p>

<!-- Line height -->
<p class="leading-none">1</p>
<p class="leading-tight">1.25</p>
<p class="leading-normal">1.5</p>
<p class="leading-relaxed">1.625</p>

<!-- Letter spacing -->
<p class="tracking-tight">-0.025em</p>
<p class="tracking-normal">0</p>
<p class="tracking-wide">0.025em</p>

<!-- Text color with opacity -->
<p class="text-gray-900/80">80% opacity</p>

<!-- Truncate text -->
<p class="truncate">Single line truncate...</p>
<p class="line-clamp-2">Multi-line clamp to 2 lines...</p>
```

## Transitions & Animations

```html
<!-- Basic transition -->
<button class="
  bg-blue-500
  transition-colors duration-200 ease-in-out
  hover:bg-blue-600
">
  Smooth hover
</button>

<!-- Transform on hover -->
<div class="
  transition-transform duration-300 ease-out
  hover:scale-105 hover:-translate-y-1
">
  Lift effect
</div>

<!-- Multiple properties -->
<div class="
  transition-all duration-300
  opacity-0 translate-y-4
  group-hover:opacity-100 group-hover:translate-y-0
">
  Fade and slide
</div>

<!-- Built-in animations -->
<div class="animate-spin">Spinning</div>
<div class="animate-ping">Ping effect</div>
<div class="animate-pulse">Pulsing</div>
<div class="animate-bounce">Bouncing</div>

<!-- Transition delays -->
<div class="transition delay-150">150ms delay</div>
<div class="transition delay-300">300ms delay</div>
```

## Arbitrary Values

For one-off values not in your theme:

```html
<!-- Arbitrary values -->
<div class="top-[117px]">Exact position</div>
<div class="w-[calc(100%-2rem)]">Calc value</div>
<div class="grid-cols-[1fr_500px_2fr]">Custom grid</div>
<div class="bg-[#1da1f2]">Hex color</div>
<div class="text-[22px]">Custom size</div>
<div class="p-[5px_10px_15px_20px]">Complex padding</div>

<!-- Arbitrary properties -->
<div class="[mask-type:luminance]">Any CSS property</div>
<div class="[--my-var:10px]">CSS variables</div>

<!-- With modifiers -->
<div class="lg:top-[344px]">Responsive arbitrary</div>
<div class="hover:[transform:rotateX(15deg)]">Hover arbitrary</div>
```

## Component Extraction

### Using @apply (sparingly)

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }

  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600;
  }

  .btn-secondary {
    @apply btn bg-gray-200 text-gray-900 hover:bg-gray-300;
  }

  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    @apply disabled:bg-gray-100 disabled:cursor-not-allowed;
  }

  .card {
    @apply bg-white rounded-xl shadow-md p-6;
    @apply dark:bg-gray-800;
  }
}
```

### React Component Pattern (Preferred)

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// components/Button.tsx
import { cn } from "@/lib/utils"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
}

const variants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  ghost: "bg-transparent hover:bg-gray-100",
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

// Usage
<Button variant="primary" size="lg" className="w-full">
  Submit
</Button>
```

## Common Patterns

### Card

```html
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
  <img src="..." alt="" class="w-full h-48 object-cover" />
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Title</h3>
    <p class="mt-2 text-gray-600 dark:text-gray-400">Description</p>
  </div>
</div>
```

### Input with Label

```html
<label class="block">
  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
    Email
  </span>
  <input
    type="email"
    class="
      mt-1 block w-full px-3 py-2
      border border-gray-300 dark:border-gray-600
      rounded-lg shadow-sm
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-white
      placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    "
    placeholder="you@example.com"
  />
</label>
```

### Badge

```html
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Active
</span>
```

### Avatar

```html
<img
  src="..."
  alt=""
  class="w-10 h-10 rounded-full object-cover ring-2 ring-white"
/>
```

### Skeleton Loader

```html
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

## Key Rules

1. **Mobile-first** - Write base styles for mobile, add breakpoint prefixes for larger
2. **Use design tokens** - Configure `@theme` rather than arbitrary values everywhere
3. **Prefer utilities** - Only extract components when truly reusable
4. **Don't fight Tailwind** - If a utility exists, use it instead of custom CSS
5. **Use `cn()` helper** - Merge classes safely with tailwind-merge + clsx
6. **Keep classes readable** - Break long class lists across multiple lines
7. **Group related utilities** - Layout, spacing, typography, colors, states
8. **Avoid dynamic class names** - `bg-${color}-500` won't work; use complete strings
