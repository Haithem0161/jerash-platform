import { onCLS, onINP, onLCP } from 'web-vitals'

type MetricHandler = (metric: { name: string; value: number; id: string }) => void

/**
 * Initialize Web Vitals reporting.
 * Call ONCE in main.tsx - calling multiple times causes duplicate reports.
 */
export function reportWebVitals(onReport?: MetricHandler) {
  // Only report in production to avoid dev noise
  if (import.meta.env.PROD) {
    const handler: MetricHandler = onReport ?? ((metric) => {
      // Default: log to console (replace with analytics endpoint in production)
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}`)

      // Optional: send to analytics endpoint
      // navigator.sendBeacon('/api/vitals', JSON.stringify(metric))
    })

    onCLS(handler)
    onINP(handler)
    onLCP(handler)
  }
}
