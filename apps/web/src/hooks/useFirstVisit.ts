import { useState, useCallback } from 'react'

const STORAGE_KEY = 'hasVisited'

/**
 * Hook to track if this is the user's first visit in the current session.
 * Uses sessionStorage to persist across page navigations but reset on new sessions.
 */
export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    // Handle SSR - return false if window is not available
    if (typeof window === 'undefined') {
      return false
    }

    // Check sessionStorage for existing visit marker
    const hasVisited = sessionStorage.getItem(STORAGE_KEY)
    return hasVisited !== 'true'
  })

  const markVisited = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    sessionStorage.setItem(STORAGE_KEY, 'true')
    setIsFirstVisit(false)
  }, [])

  return { isFirstVisit, markVisited }
}
