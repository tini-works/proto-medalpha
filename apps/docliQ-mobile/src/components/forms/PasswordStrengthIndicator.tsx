import { useTranslation } from 'react-i18next'
import { IconCircleCheckFilled, IconCircle } from '@tabler/icons-react'
import type { PasswordValidationResult } from '../../utils/passwordValidation'

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult
  showRequirements?: boolean
}

// Segmented strength bar colors for each segment
function getSegmentColor(segmentIndex: number, currentScore: number): string {
  if (segmentIndex >= currentScore) return 'bg-slate-200'

  // Color based on overall score level
  const colors: Record<number, string> = {
    1: 'bg-coral-500',   // weak - red
    2: 'bg-amber-500',   // fair - orange
    3: 'bg-teal-400',    // good - light teal
    4: 'bg-green-500',   // strong - green
  }
  return colors[currentScore] || 'bg-slate-200'
}

function getStrengthTextColor(score: number): string {
  const colors: Record<number, string> = {
    1: 'text-coral-600',
    2: 'text-amber-600',
    3: 'text-teal-500',
    4: 'text-green-600',
  }
  return colors[score] || 'text-slate-500'
}

export function PasswordStrengthIndicator({
  validation,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation('auth')
  const { score, strength, requirements } = validation

  const requirementKeys = [
    'minLength',
    'hasUppercase',
    'hasLowercase',
    'hasNumber',
    'hasSpecial',
  ] as const

  return (
    <div className="mt-2 space-y-2">
      {/* Segmented strength bar */}
      <div className="space-y-1">
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${getSegmentColor(index, score)}`}
            />
          ))}
        </div>
        {score > 0 && (
          <p className={`text-body-sm font-medium uppercase tracking-wide ${getStrengthTextColor(score)}`}>
            {t(`password.strength.${strength}`)}
          </p>
        )}
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <ul className="space-y-1">
          {requirementKeys.map((key) => {
            const met = requirements[key]
            return (
              <li key={key} className="flex items-center gap-2 text-body-sm">
                {met ? (
                  <IconCircleCheckFilled size={18} className="text-teal-500 flex-shrink-0" />
                ) : (
                  <IconCircle size={18} className="text-slate-300 flex-shrink-0" />
                )}
                <span className={met ? 'text-slate-700' : 'text-slate-400'}>
                  {t(`password.requirements.${key}`)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
