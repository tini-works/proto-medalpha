interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  variant?: 'bar' | 'dots' | 'segments'
  showLabel?: boolean
  showPercentage?: boolean
  labelFormat?: 'default' | 'uppercase' // 'uppercase' for "STEP X OF Y"
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  variant = 'bar',
  showLabel = true,
  showPercentage,
  labelFormat = 'default',
}: ProgressIndicatorProps) {
  // Default showPercentage: false for segments variant, true for others
  const shouldShowPercentage = showPercentage ?? (variant !== 'segments')
  const percentage = Math.round((currentStep / totalSteps) * 100)

  const labelText = labelFormat === 'uppercase'
    ? `STEP ${currentStep} OF ${totalSteps}`
    : `Step ${currentStep} of ${totalSteps}`

  return (
    <div className="w-full">
      {/* Header with label and percentage */}
      {(showLabel || shouldShowPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span className={`text-sm font-medium ${
              labelFormat === 'uppercase' ? 'text-charcoal-500 tracking-wide text-xs' : 'text-slate-700'
            }`}>
              {labelText}
            </span>
          )}
          {shouldShowPercentage && (
            <span className={`text-sm ${
              variant === 'segments' ? 'text-teal-600 font-medium' : 'text-slate-500'
            }`}>
              {percentage}% Complete
            </span>
          )}
        </div>
      )}

      {/* Progress visualization */}
      {variant === 'bar' && (
        <div className="h-2 w-full rounded-full bg-cream-300 overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-slow ease-out-brand"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {variant === 'dots' && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-slow ease-out-brand ${
                index < currentStep ? 'bg-teal-500' : 'bg-cream-300'
              }`}
            />
          ))}
        </div>
      )}

      {variant === 'segments' && (
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full transition-all duration-slow ease-out-brand ${
                index < currentStep ? 'bg-teal-500' : 'bg-cream-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
