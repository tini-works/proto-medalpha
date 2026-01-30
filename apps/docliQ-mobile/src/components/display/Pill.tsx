import type { ReactNode } from 'react'

/**
 * Pill component with conservative color usage
 * - 'positive': ONLY for deltas, improvements, compliance-safe positive signals
 * - 'negative': For errors, cancellations, negative deltas
 * - 'pending': For pending appointment states (amber)
 * - 'warning': For attention needed, pending states
 * - 'info': For informational badges (insurance type, etc.)
 * - 'neutral': Default for most status badges
 */
type PillTone = 'info' | 'positive' | 'pending' | 'warning' | 'negative' | 'neutral'

interface PillProps {
  children: ReactNode
  tone?: PillTone
  size?: 'sm' | 'md'
}

// Conservative color palette - subdued, professional
const toneStyles: Record<PillTone, string> = {
  // Used for informational states like "Matching" (blue)
  info: 'bg-sky-50 text-sky-700 border border-sky-500',
  // Used for positive states like "Confirmed" (green)
  positive: 'bg-emerald-50 text-emerald-700 border border-emerald-500', // Restricted: only for positive deltas
  // Used for pending appointment confirmation (amber)
  pending: 'bg-amber-50 text-amber-800 border border-amber-500',
  warning: 'bg-coral-100 text-coral-700 border border-coral-500',
  negative: 'bg-coral-50 text-coral-800 border border-coral-600',
  neutral: 'bg-cream-200 text-charcoal-400 border border-cream-400',
}

export function Pill({ children, tone = 'neutral', size = 'sm' }: PillProps) {
  const sizeStyles = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <span className={`inline-flex items-center rounded font-medium ${toneStyles[tone]} ${sizeStyles}`}>
      {children}
    </span>
  )
}
