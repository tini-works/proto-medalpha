import type { ReactNode } from 'react'

/**
 * Pill component with conservative color usage
 * - 'positive': ONLY for deltas, improvements, compliance-safe positive signals
 * - 'negative': For errors, cancellations, negative deltas
 * - 'warning': For attention needed, pending states
 * - 'info': For informational badges (insurance type, etc.)
 * - 'neutral': Default for most status badges
 */
type PillTone = 'info' | 'positive' | 'warning' | 'negative' | 'neutral'

interface PillProps {
  children: ReactNode
  tone?: PillTone
  size?: 'sm' | 'md'
}

// Conservative color palette - subdued, professional
const toneStyles: Record<PillTone, string> = {
  info: 'bg-slate-50 text-slate-700 border border-slate-200',
  positive: 'bg-teal-50 text-teal-700 border border-teal-500', // Restricted: only for positive deltas
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
