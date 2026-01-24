import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  structuredData?: object
}

const SITE_NAME = 'Jerash For Oil Field Services'
const DEFAULT_DESCRIPTION =
  'Excellence in oil field solutions with an unwavering commitment to safety'
const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://jerash.com'
const DEFAULT_IMAGE = `${BASE_URL}/images/gallery/jerash-site-01.jpg`

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  noindex = false,
  structuredData,
}: SEOProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const fullUrl = `${BASE_URL}${url}`
  // Ensure image URL is absolute
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`

  // Note: dir attribute is managed by i18n.ts via direct DOM manipulation
  // to avoid race conditions with Helmet during page transitions
  return (
    <Helmet>
      {/* Basic - only lang, dir is handled by i18n.ts */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Hreflang x-default for single-URL multilingual site */}
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title || SITE_NAME} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === 'ar' ? 'ar_IQ' : 'en_US'} />
      <meta
        property="og:locale:alternate"
        content={lang === 'ar' ? 'en_US' : 'ar_IQ'}
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || SITE_NAME} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}
