---
phase: quick
plan: 001
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/home/PartnersSection.tsx
  - src/components/home/JointVenturesSection.tsx
  - src/locales/en/common.json
  - src/locales/ar/common.json
autonomous: true

must_haves:
  truths:
    - "PartnersSection has a 'View All Partners' link navigating to /partners"
    - "JointVenturesSection has a 'View All Joint Ventures' link navigating to /joint-ventures"
    - "Links display correctly in both English and Arabic"
    - "Arrow icons rotate correctly in RTL mode"
  artifacts:
    - path: "src/components/home/PartnersSection.tsx"
      provides: "Link to /partners page"
      contains: "Link.*to=\"/partners\""
    - path: "src/components/home/JointVenturesSection.tsx"
      provides: "Link to /joint-ventures page"
      contains: "Link.*to=\"/joint-ventures\""
  key_links:
    - from: "PartnersSection.tsx"
      to: "/partners"
      via: "React Router Link component"
    - from: "JointVenturesSection.tsx"
      to: "/joint-ventures"
      via: "React Router Link component"
---

<objective>
Add navigation links to PartnersSection and JointVenturesSection homepage components to connect them to their respective detail pages.

Purpose: Fix integration gap from milestone audit - homepage preview sections should link to detail pages for discoverability.
Output: Both sections have "View All" links matching the ServicesPreview pattern.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/home/ServicesPreview.tsx (reference pattern for Link implementation)
@src/components/home/PartnersSection.tsx (target file)
@src/components/home/JointVenturesSection.tsx (target file)
@src/locales/en/common.json (translation keys)
@src/locales/ar/common.json (translation keys)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add translation keys for "View All" links</name>
  <files>src/locales/en/common.json, src/locales/ar/common.json</files>
  <action>
Add translation keys following the existing pattern from home.services.seeAll:

In en/common.json under home.partners:
- Add "seeAll": "View All Partners"

In en/common.json under home.jointVentures:
- Add "seeAll": "View All Joint Ventures"

In ar/common.json under home.partners:
- Add "seeAll": "عرض جميع الشركاء"

In ar/common.json under home.jointVentures:
- Add "seeAll": "عرض جميع المشاريع المشتركة"
  </action>
  <verify>Read both JSON files and confirm keys exist under correct paths</verify>
  <done>Translation keys home.partners.seeAll and home.jointVentures.seeAll exist in both locales</done>
</task>

<task type="auto">
  <name>Task 2: Add Link component to PartnersSection</name>
  <files>src/components/home/PartnersSection.tsx</files>
  <action>
Update PartnersSection following the ServicesPreview pattern exactly:

1. Add imports at top:
   - Link from 'react-router' (NOT react-router-dom)
   - ArrowRight from 'lucide-react'
   - isRTL from '@/lib/i18n'
   - cn from '@/lib/utils'

2. Extract i18n from useTranslation: const { t, i18n } = useTranslation()

3. Add RTL check: const rtl = isRTL(i18n.language)

4. Add after the partner card (after the closing </FadeIn> of the card, before </Section>):
   ```tsx
   <FadeIn delay={0.2} className="mt-12 text-center">
     <Link
       to="/partners"
       className="linkHover inline-flex items-center gap-2 text-primary"
     >
       {t('home.partners.seeAll')}
       <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
     </Link>
   </FadeIn>
   ```
  </action>
  <verify>pnpm lint && pnpm build (no errors)</verify>
  <done>PartnersSection has Link to /partners with RTL-aware arrow icon</done>
</task>

<task type="auto">
  <name>Task 3: Add Link component to JointVenturesSection</name>
  <files>src/components/home/JointVenturesSection.tsx</files>
  <action>
Update JointVenturesSection following the exact same pattern as PartnersSection:

1. Add imports at top:
   - Link from 'react-router' (NOT react-router-dom)
   - ArrowRight from 'lucide-react'
   - isRTL from '@/lib/i18n'
   - cn from '@/lib/utils'

2. Extract i18n from useTranslation: const { t, i18n } = useTranslation()

3. Add RTL check: const rtl = isRTL(i18n.language)

4. Add after the joint venture card (after the closing </FadeIn> of the card, before </Section>):
   ```tsx
   <FadeIn delay={0.2} className="mt-12 text-center">
     <Link
       to="/joint-ventures"
       className="linkHover inline-flex items-center gap-2 text-primary"
     >
       {t('home.jointVentures.seeAll')}
       <ArrowRight className={cn('h-4 w-4', rtl && 'rotate-180')} />
     </Link>
   </FadeIn>
   ```
  </action>
  <verify>pnpm lint && pnpm build (no errors)</verify>
  <done>JointVenturesSection has Link to /joint-ventures with RTL-aware arrow icon</done>
</task>

</tasks>

<verification>
1. Run `pnpm lint` - no errors
2. Run `pnpm build` - successful build
3. Run `pnpm dev` and verify:
   - Navigate to homepage
   - PartnersSection shows "View All Partners" link
   - JointVenturesSection shows "View All Joint Ventures" link
   - Click links navigate to correct pages
   - Switch to Arabic - links show Arabic text, arrows flip
</verification>

<success_criteria>
- Both homepage sections have functional navigation links
- Links use correct React Router import (react-router, not react-router-dom)
- Translation keys work in both English and Arabic
- Arrow icons respect RTL direction
- Build completes without errors
</success_criteria>

<output>
After completion, create `.planning/quick/001-add-link-components-to-partnerssection-a/001-SUMMARY.md`
</output>
