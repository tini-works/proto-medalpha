import type { ReactNode } from 'react'
import { StickyActionBar } from '../layout/StickyActionBar'

export interface MatchingStep {
  label: string
  done?: boolean
  active?: boolean
}

interface MatchingStatusViewProps {
  title: string
  description: string
  steps: MatchingStep[]
  primaryActionLabel: string
  onPrimaryAction: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  connectionTitle?: ReactNode
  connectionSubtitle?: ReactNode
  footerNote?: ReactNode
}

export function MatchingStatusView({
  title,
  description,
  steps,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  connectionTitle,
  connectionSubtitle,
  footerNote,
}: MatchingStatusViewProps) {
  return (
    <>
      {/* Center-aligned Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Animated Search Icon */}
        <div className="w-28 h-28 rounded-full bg-sky-100 flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-charcoal-500 mb-3 text-center">{title}</h1>
        <p className="text-slate-600 text-center mb-10 max-w-sm">{description}</p>

        {/* Progress Steps */}
        <div className="w-full max-w-sm space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {step.done ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : step.active ? (
                <div className="w-6 h-6 rounded-full border-2 border-teal-500 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-cream-400 flex-shrink-0" />
              )}
              <span
                className={`text-sm ${step.done ? 'text-green-600' : step.active ? 'text-charcoal-500' : 'text-slate-400'}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Connection retry banner */}
        {(connectionTitle || connectionSubtitle) && (
          <div className="w-full max-w-sm mt-5">
            <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-6h-6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 18.5a8 8 0 0112.7-9.2L20 10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 5.5a8 8 0 01-12.7 9.2L4 14" />
              </svg>
              <div className="min-w-0">
                {connectionTitle && <p className="text-xs font-medium leading-snug">{connectionTitle}</p>}
                {connectionSubtitle && <p className="mt-0.5 text-xs text-sky-700/90 leading-snug">{connectionSubtitle}</p>}
              </div>
            </div>
          </div>
        )}

        {footerNote ? <div className="w-full max-w-sm mt-6 text-center">{footerNote}</div> : null}
      </div>

      {/* Sticky Bottom Bar */}
      <StickyActionBar>
        <div className="space-y-3">
          <button
            onClick={onPrimaryAction}
            className="w-full py-3.5 px-4 border border-cream-400 text-charcoal-500 font-medium rounded-xl hover:bg-cream-50 transition-colors"
          >
            {primaryActionLabel}
          </button>
          {secondaryActionLabel && onSecondaryAction ? (
            <button onClick={onSecondaryAction} className="btn btn-tertiary btn-block">
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      </StickyActionBar>
    </>
  )
}
