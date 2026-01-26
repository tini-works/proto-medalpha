interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  variant?: 'bar' | 'dots'
  showLabel?: boolean
  showPercentage?: boolean
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  variant = 'bar',
  showLabel = true,
  showPercentage = true,
}: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full">
      {/* Header with label and percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep} of {totalSteps}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-slate-500">{percentage}%</span>
          )}
        </div>
      )}

      {/* Progress visualization */}
      {variant === 'bar' ? (
        <div className="h-2 w-full rounded-full bg-cream-300 overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-slow ease-out-brand"
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : (
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
    </div>
  )
}
