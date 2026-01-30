import { useTranslation } from 'react-i18next'
import { IconCheck, IconX } from '@tabler/icons-react'
import type { PasswordValidationResult } from '../../utils/passwordValidation'
import { getStrengthColor } from '../../utils/passwordValidation'

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult
  showRequirements?: boolean
}

export function PasswordStrengthIndicator({
  validation,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation('auth')
  const { score, strength, requirements } = validation

  // Don't show anything for empty/very short passwords
  if (score === 0 && !requirements.minLength) return null

  const requirementKeys = [
    'minLength',
    'hasUppercase',
    'hasLowercase',
    'hasNumber',
    'hasSpecial',
  ] as const

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded-full bg-cream-300 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-200 ${getStrengthColor(score)}`}
            style={{ width: `${(score / 4) * 100}%` }}
          />
        </div>
        {score > 0 && (
          <p className="text-body-sm text-slate-600">
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
                  <IconCheck size={14} className="text-teal-600 flex-shrink-0" />
                ) : (
                  <IconX size={14} className="text-slate-400 flex-shrink-0" />
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
