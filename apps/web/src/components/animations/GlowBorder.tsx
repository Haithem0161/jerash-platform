import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowBorderProps {
  children: ReactNode
  /** Glow color variant */
  color?: 'orange' | 'blue'
  /** Glow intensity (default 0.4) */
  intensity?: number
  className?: string
}

/**
 * Animated gradient glow border wrapper.
 * Uses a pseudo-element with rotating conic-gradient to create
 * a glowing border-only effect. Intensity increases on hover.
 */
export function GlowBorder({
  children,
  color = 'orange',
  intensity = 0.4,
  className,
}: GlowBorderProps) {
  const glowColor =
    color === 'orange'
      ? 'oklch(0.65 0.20 50)'
      : 'oklch(0.40 0.12 250)'

  return (
    <div
      className={cn('group relative rounded-2xl', className)}
      style={
        {
          '--glow-color': glowColor,
          '--glow-intensity': intensity,
        } as React.CSSProperties
      }
    >
      {/* Glow border pseudo-element */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-[var(--glow-intensity)] transition-opacity duration-300 group-hover:opacity-80"
        style={{
          background: `conic-gradient(from var(--glow-angle), transparent, ${glowColor}, transparent, ${glowColor}, transparent)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
          borderRadius: 'inherit',
          animation: 'glow-spin 8s linear infinite',
        }}
      />
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  )
}
