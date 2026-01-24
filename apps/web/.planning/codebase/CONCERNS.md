# Codebase Concerns

**Analysis Date:** 2026-01-21

## Tech Debt

**Placeholder API Implementation:**
- Issue: The API layer (`src/api/index.ts`) contains placeholder/example code with non-existent endpoints
- Files: `src/api/index.ts`
- Impact: Using these APIs will result in 404 errors; code is non-functional until real endpoints are configured
- Fix approach: Replace placeholder endpoints with actual API routes when backend is available, or remove if not needed

**Empty Translation Strings:**
- Issue: The `home.subheading` translation key is empty in both language files
- Files: `src/locales/en/common.json`, `src/locales/ar/common.json`
- Impact: HomePage displays empty subheading text; inconsistent user experience
- Fix approach: Add meaningful translation strings or remove the subheading entirely

**Hardcoded Site Constants:**
- Issue: SEO component has hardcoded site name ("Jerash") and default description
- Files: `src/components/common/SEO.tsx`
- Impact: Requires code changes to update branding; should be configurable
- Fix approach: Move `SITE_NAME` and `DEFAULT_DESCRIPTION` to environment variables or i18n

**Unused UI Components:**
- Issue: Large dropdown-menu component (255 lines) exported but usage not observed in pages
- Files: `src/components/ui/dropdown-menu.tsx`
- Impact: Bundle size includes unused code; dead code maintenance burden
- Fix approach: Verify usage before adding more shadcn components; tree-shake unused exports

**Duplicate Animation Libraries:**
- Issue: Both `framer-motion` and `motion` packages are installed (same library, different names); also `gsap` present
- Files: `package.json`
- Impact: Bundle bloat; potential version conflicts; unclear which to use
- Fix approach: Standardize on one animation approach (likely `motion`/`framer-motion`); remove unused package

## Known Bugs

**No known bugs identified.**

The codebase is minimal and primarily scaffold code. No functional bugs were detected during analysis.

## Security Considerations

**Token Storage in localStorage:**
- Risk: JWT tokens stored in `localStorage` are vulnerable to XSS attacks
- Files: `src/lib/axios.ts`
- Current mitigation: None
- Recommendations: Consider using httpOnly cookies for token storage; implement CSRF protection if switching to cookies

**No Input Sanitization:**
- Risk: API functions pass user data directly without validation
- Files: `src/api/index.ts`
- Current mitigation: None (placeholder code)
- Recommendations: Use Zod schemas (already installed) to validate all API inputs before sending

**Missing CSP Headers:**
- Risk: No Content Security Policy configuration detected
- Files: N/A (configuration gap)
- Current mitigation: None
- Recommendations: Configure CSP headers in deployment (Vite preview/production server or CDN)

**Environment Variable Exposure:**
- Risk: `VITE_` prefixed variables are bundled into client code and visible to users
- Files: `src/lib/axios.ts`, `src/components/common/SEO.tsx`
- Current mitigation: Only non-sensitive URLs exposed
- Recommendations: Never store secrets in `VITE_` variables; document this constraint

## Performance Bottlenecks

**Large PDF in Public Directory:**
- Problem: 56MB PDF file served as a static asset
- Files: `public/06 Jerash Profile.pdf`
- Cause: PDFs should be hosted on CDN or document service, not bundled with website
- Improvement path: Move to external storage (S3, Cloudflare R2, etc.); serve via download link

**No Code Splitting:**
- Problem: All routes bundle together; no lazy loading observed
- Files: `src/routes/index.tsx`
- Cause: Routes defined without `React.lazy()` or dynamic imports
- Improvement path: Implement route-based code splitting using `lazy()` and `Suspense`

**Missing Image Optimization:**
- Problem: PNG logo served without optimization; no responsive images
- Files: `public/Jerash-logo-color.png` (203KB)
- Cause: Raw PNG without WebP/AVIF variants or responsive sizing
- Improvement path: Use image optimization plugin or service; serve WebP with PNG fallback

## Fragile Areas

**i18n Resource Loading:**
- Files: `src/lib/i18n.ts`
- Why fragile: Dynamic imports for locale files will fail silently if file is missing or path changes
- Safe modification: Always add new namespaces to the `ns` array; test with all supported languages
- Test coverage: No tests for i18n initialization

**Theme System:**
- Files: `src/stores/useThemeStore.ts`, `src/components/providers/ThemeProvider.tsx`
- Why fragile: Theme application happens in multiple places (store, provider); relies on DOM class manipulation
- Safe modification: Only modify theme logic in one place; verify dark mode after changes
- Test coverage: No tests for theme switching

**Error Handling in Axios:**
- Files: `src/lib/axios.ts`
- Why fragile: Response interceptor only handles 401; other errors pass through unhandled
- Safe modification: Add comprehensive error handling; consider global error boundary integration
- Test coverage: No tests for API error scenarios

## Scaling Limits

**Single Translation Namespace:**
- Current capacity: All translations in `common.json`
- Limit: File becomes unwieldy after ~100 keys; maintainability degrades
- Scaling path: Split into feature-based namespaces (`home.json`, `auth.json`, etc.)

**Flat Component Structure:**
- Current capacity: Works for small projects
- Limit: As features grow, `components/common/` and `components/ui/` become crowded
- Scaling path: Introduce feature-based directories (`features/auth/`, `features/dashboard/`)

## Dependencies at Risk

**Experimental Vite Override:**
- Risk: Using `rolldown-vite` experimental build via pnpm override
- Impact: May break with Vite ecosystem updates; limited community support
- Migration plan: Monitor for stable rolldown-vite release or revert to standard Vite

**React Compiler (Beta):**
- Risk: `babel-plugin-react-compiler` is in beta; API may change
- Impact: Build could break on updates; edge cases in optimization
- Migration plan: Monitor React team announcements; test thoroughly on upgrades

**Zod v4:**
- Risk: Zod v4 (4.3.5) is very recent; ecosystem compatibility uncertain
- Impact: Some libraries may not support v4 yet
- Migration plan: Verify compatibility with form libraries (`@hookform/resolvers`)

## Missing Critical Features

**No Error Boundary:**
- Problem: No React Error Boundary component
- Blocks: Unhandled errors crash entire app; poor user experience
- Priority: High - implement before adding complex features

**No Loading States:**
- Problem: No global loading indicator or suspense fallback defined
- Blocks: Users see blank screens during async operations
- Priority: Medium - add skeleton/spinner components

**No Authentication System:**
- Problem: Axios has token handling but no login/logout or auth state management
- Blocks: Cannot implement protected routes or user-specific features
- Priority: Depends on requirements - implement when needed

**No Form Infrastructure:**
- Problem: react-hook-form and zod installed but no form components created
- Blocks: Delayed form development; inconsistent patterns when forms are added
- Priority: Low - create when first form is needed; document pattern

## Test Coverage Gaps

**Zero Test Coverage:**
- What's not tested: Entire codebase (no test files detected)
- Files: All files in `src/`
- Risk: Regressions undetected; refactoring is dangerous; confidence is low
- Priority: High - establish testing foundation before adding features

**No Testing Infrastructure:**
- What's missing: No test runner configured (no jest.config.*, vitest.config.*)
- Files: `package.json` (no test scripts)
- Risk: Tests cannot be added without additional setup
- Priority: High - add Vitest configuration before implementing tests

---

*Concerns audit: 2026-01-21*
