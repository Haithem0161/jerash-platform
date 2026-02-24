/**
 * Client data structure with translation key references.
 * Ready for CMS/API migration - all display text uses translation keys.
 */
export interface Client {
  /** Unique identifier for the client */
  id: string
  /** Translation key for client name (e.g., 'clients.slb.name') */
  nameKey: string
  /** Translation key for client description */
  descriptionKey: string
  /** Path to client logo image */
  logo: string
  /** Optional external website URL */
  website?: string
}

/**
 * Static clients data.
 * Add new clients by extending this array.
 */
export const clients: Client[] = [
  {
    id: 'slb',
    nameKey: 'clients.slb.name',
    descriptionKey: 'clients.slb.description',
    logo: '/images/partners/slb-logo.png',
    website: 'https://www.slb.com',
  },
]
