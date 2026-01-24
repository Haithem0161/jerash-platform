import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFirstVisit } from '@/hooks/useFirstVisit'

const FADE_OUT_DELAY = 1000 // Delay before fade out starts (ms)

export function LoadingOverlay() {
  const { isFirstVisit, markVisited } = useFirstVisit()
  const [showOverlay, setShowOverlay] = useState(isFirstVisit)

  useEffect(() => {
    if (!isFirstVisit) {
      return
    }

    // After delay, start fade out
    const timer = setTimeout(() => {
      setShowOverlay(false)
      markVisited()
    }, FADE_OUT_DELAY)

    return () => clearTimeout(timer)
  }, [isFirstVisit, markVisited])

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="/Jerash-logo-color.png"
            alt="Jerash"
            className="h-32 w-auto md:h-40"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
