/**
 * Partner data structure with translation key references.
 * Ready for CMS/API migration - all display text uses translation keys.
 */
export interface Partner {
  /** Unique identifier for the partner */
  id: string
  /** Translation key for partner name (e.g., 'partners.slb.name') */
  nameKey: string
  /** Translation key for partner description */
  descriptionKey: string
  /** Path to partner logo image */
  logo: string
  /** Optional external website URL */
  website?: string
}

/**
 * Static partners data.
 * Add new partners by extending this array.
 */
export const partners: Partner[] = [
  {
    id: 'slb',
    nameKey: 'partners.slb.name',
    descriptionKey: 'partners.slb.description',
    logo: '/images/partners/slb-logo.png',
    website: 'https://www.slb.com',
  },
]
