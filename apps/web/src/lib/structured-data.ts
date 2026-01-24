/**
 * JSON-LD Structured Data schemas for SEO
 * Based on Schema.org vocabulary for enhanced search engine understanding
 */

/**
 * Organization schema for homepage - provides company information to search engines
 * @see https://developers.google.com/search/docs/appearance/structured-data/organization
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Jerash For Oil Field Services',
  url: 'https://jerash.com',
  logo: 'https://jerash.com/Jerash-logo-color.png',
  description:
    'Excellence in oil field solutions with an unwavering commitment to safety',
  address: {
    '@type': 'PostalAddress',
    postOfficeBoxNumber: '101',
    addressLocality: 'Basrah',
    addressCountry: 'IQ',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Arabic'],
  },
}
