import { useTranslation } from 'react-i18next'

/**
 * Skip navigation links for keyboard/screen reader users.
 * Hidden by default, visible on focus (Tab key).
 * Must be first focusable element on page.
 */
export function SkipLinks() {
  const { t } = useTranslation()

  return (
    <div className="absolute left-0 top-0 z-[100]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
      >
        {t('accessibility.skipToMain', 'Skip to main content')}
      </a>
      <a
        href="#footer"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-56 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
      >
        {t('accessibility.skipToFooter', 'Skip to footer')}
      </a>
    </div>
  )
}
