---
phase: "07"
plan: "01"
subsystem: "contact"
tags: [react-hook-form, zod, forms, i18n, shadcn-ui]
dependency-graph:
  requires: [01-01, 01-02]
  provides: [contact-form, office-locations, contact-page]
  affects: [07-02]
tech-stack:
  added: []
  patterns: [form-validation-with-translation-keys, tabbed-office-display]
key-files:
  created:
    - src/components/contact/schemas/contact-schema.ts
    - src/components/contact/ContactForm.tsx
    - src/components/contact/OfficeLocations.tsx
    - src/components/contact/index.ts
    - src/locales/en/contact.json
    - src/locales/ar/contact.json
    - src/routes/pages/Contact.tsx
    - src/components/ui/input.tsx
    - src/components/ui/textarea.tsx
    - src/components/ui/select.tsx
    - src/components/ui/label.tsx
    - src/components/ui/card.tsx
    - src/components/ui/form.tsx
  modified:
    - src/routes/index.tsx
    - package.json
    - pnpm-lock.yaml
decisions:
  - id: translation-keys-in-schema
    choice: Use translation keys in Zod error messages, translate in component
    reason: Prevents frozen error messages when language changes
  - id: no-default-tab
    choice: No default office tab selected
    reason: Per CONTEXT.md - show all three offices equally (unlike footer)
  - id: map-placeholder
    choice: Simple gray placeholder for map
    reason: MapCN deferred for simplicity, coordinates stored for future use
  - id: phone-format
    choice: E.164 in href, formatted display
    reason: E.164 ensures international dialing works; display is readable
metrics:
  duration: 4m 40s
  completed: 2026-01-22
---

# Phase 07 Plan 01: Contact Page Summary

Contact page with inquiry form (react-hook-form + Zod) and tabbed office locations, bilingual validation with translation keys in schema

## What Was Built

### Contact Form
- Full contact inquiry form with name, email, phone (optional), department dropdown, and message
- Validation using Zod 4 with translation keys for error messages (not translated strings)
- Error messages update correctly when language switches mid-session
- Simulated submission with 1.5s delay, logs to console
- AnimatePresence switches between form and success message inline
- Loading state with Loader2 spinner during submission

### Office Locations
- Tabbed interface with Basrah, Erbil, Baghdad offices
- No default tab selected (per CONTEXT.md, unlike footer which defaults to Basrah)
- Each tab shows: phone (tel: link), email (mailto: link), address, working hours
- Map placeholder with coordinates displayed (MapCN deferred)
- Phone numbers in E.164 format for href, formatted for display

### Contact Page Layout
- Two-column grid on desktop (md:grid-cols-[2fr,1fr])
- Left: Contact form in Card
- Right: Quick contact sidebar with condensed office info
- Below: Full-width OfficeLocations with tabs
- SEO meta tags with bilingual support

### shadcn/ui Components Added
- Input, Textarea, Select, Label, Card, Form components
- Form integrates with react-hook-form using FormField, FormControl, FormMessage

## Key Implementation Details

### Bilingual Validation Pattern
```typescript
// Schema uses translation keys, NOT translated strings
export const contactSchema = z.object({
  email: z.email({ message: 'validation.emailInvalid' }),
  // ...
})

// Component translates the key
{fieldState.error && (
  <FormMessage>
    {t(`validation.${fieldState.error.message?.split('.')[1]}`)}
  </FormMessage>
)}
```

### Phone Link Format
```tsx
// E.164 in href for international compatibility
<a href={`tel:${office.phone}`}>{office.phoneDisplay}</a>
// phone: '+964XXXXXXXXXX'
// phoneDisplay: '+964 XXX XXX XXXX'
```

## Commits

| Hash | Message |
|------|---------|
| 2f4af1c | feat(07-01): add form components and contact validation schema |
| c4c3fe1 | feat(07-01): add Contact page with form and office locations |

## Deviations from Plan

None - plan executed exactly as written.

## Files Summary

**Components (4 files, ~350 lines):**
- `ContactForm.tsx` - Form with validation, success state animation
- `OfficeLocations.tsx` - Tabbed office display with contact info
- `contact-schema.ts` - Zod validation with translation key errors
- `index.ts` - Barrel export

**Translations (2 files):**
- `en/contact.json` - English labels, messages, validation, office data
- `ar/contact.json` - Arabic translations

**UI Components (6 files):**
- Input, Textarea, Select, Label, Card, Form from shadcn/ui

## Verification Results

- [x] Contact form accepts name, email, phone (optional), department, message
- [x] Form validates with bilingual error messages (translation keys in schema)
- [x] Simulated submission shows loading state then success message
- [x] 3 office locations display in tabs with phone, email, address, hours
- [x] Phone numbers use E.164 format in href, display formatted for readability
- [x] All content bilingual (Arabic/English)
- [x] Route /contact accessible and renders ContactPage
- [x] pnpm build succeeds with no TypeScript errors

## Next Phase Readiness

Contact page complete. Forms simulate submission - backend integration deferred.
Map placeholders in place with coordinates ready for MapCN integration.
Phone placeholders need real numbers before production.
