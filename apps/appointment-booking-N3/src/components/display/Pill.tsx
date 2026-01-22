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
  info: 'bg-slate-100 text-slate-700 border border-slate-200',
  positive: 'bg-emerald-50 text-emerald-700 border border-emerald-200', // Restricted: only for positive deltas
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  negative: 'bg-red-50 text-red-700 border border-red-200',
  neutral: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
}

export function Pill({ children, tone = 'neutral', size = 'sm' }: PillProps) {
  const sizeStyles = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <span className={`inline-flex items-center rounded font-medium ${toneStyles[tone]} ${sizeStyles}`}>
      {children}
    </span>
  )
}
