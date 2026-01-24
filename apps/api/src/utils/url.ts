import { config } from '../config/index.js'

/**
 * Transforms a relative URL path to a full URL with the base URL.
 * If the URL is already absolute (starts with http:// or https://), it's returned as-is.
 *
 * @example
 * toFullUrl('/uploads/hero/hero-slide-01.jpg')
 * // => 'http://localhost:3000/uploads/hero/hero-slide-01.jpg'
 */
export function toFullUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${config.BASE_URL}${normalizedPath}`
}

/**
 * Transforms URL fields in an object to full URLs.
 * Specify which fields contain URLs that need transformation.
 */
export function withFullUrls<T extends Record<string, unknown>>(
  obj: T,
  urlFields: (keyof T)[]
): T {
  const result = { ...obj }
  for (const field of urlFields) {
    if (typeof result[field] === 'string') {
      (result[field] as unknown) = toFullUrl(result[field] as string)
    }
  }
  return result
}

/**
 * Transforms URL fields in an array of objects to full URLs.
 */
export function withFullUrlsArray<T extends Record<string, unknown>>(
  items: T[],
  urlFields: (keyof T)[]
): T[] {
  return items.map(item => withFullUrls(item, urlFields))
}
