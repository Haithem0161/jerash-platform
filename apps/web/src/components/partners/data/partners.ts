/**
 * Joint Venture data structure with translation key references.
 * Ready for CMS/API migration - all display text uses translation keys.
 */
export interface JointVenture {
  /** Unique identifier for the joint venture */
  id: string
  /** Translation key for JV name (e.g., 'partners.kweti.name') */
  nameKey: string
  /** Translation key for JV description */
  descriptionKey: string
  /** Path to JV logo image */
  logo: string
  /** Optional external website URL */
  website?: string
}

/**
 * Static joint ventures data.
 * Add new JVs by extending this array.
 */
export const jointVentures: JointVenture[] = [
  {
    id: 'kweti',
    nameKey: 'partners.kweti.name',
    descriptionKey: 'partners.kweti.description',
    logo: '/images/partners/kweti-logo.png',
    website: undefined,
  },
]
