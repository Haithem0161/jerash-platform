/**
 * Hover effect utilities using Tailwind classes.
 * Per CONTEXT.md: Use CSS transitions for hover (100ms), not Motion.
 * CSS is more performant for simple color/border changes.
 */

/** Buttons: color change only, no lift or scale */
export const buttonHover = 'transition-colors duration-100 hover:bg-primary/90'

/** Cards: border highlight on hover, no shadow/lift */
export const cardHover =
  'border border-transparent transition-colors duration-100 hover:border-primary'

/** Cards with existing border: just color change */
export const cardBorderHover = 'transition-colors duration-100 hover:border-primary'

/**
 * Links: underline animation on hover
 * Note: Navigation.tsx already has this pattern implemented.
 * Use this for other link contexts.
 */
export const linkHover = [
  'relative',
  'after:absolute after:bottom-0 after:start-0',
  'after:h-0.5 after:bg-primary',
  'after:w-0 hover:after:w-full',
  'after:transition-all after:duration-300',
].join(' ')

/**
 * Icon buttons: subtle background on hover
 */
export const iconButtonHover = 'transition-colors duration-100 hover:bg-accent'
