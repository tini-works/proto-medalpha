import { useState, type InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { Field } from './Field'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { validatePassword } from '../../utils/passwordValidation'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
  showStrengthIndicator?: boolean
  showRequirements?: boolean
}

export function PasswordField({
  label,
  error,
  hint,
  showStrengthIndicator = false,
  showRequirements = false,
  value = '',
  className = '',
  ...props
}: PasswordFieldProps) {
  const { t } = useTranslation('auth')
  const [visible, setVisible] = useState(false)
  const validation = validatePassword(String(value))

  const toggleVisibility = () => setVisible((v) => !v)

  return (
    <div>
      <div className="relative">
        <Field
          label={label}
          type={visible ? 'text' : 'password'}
          error={error}
          hint={!showStrengthIndicator ? hint : undefined}
          value={value}
          className={`pr-12 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-[34px] p-1 text-slate-500 hover:text-slate-700 transition-colors"
          aria-label={t(visible ? 'password.hide' : 'password.show')}
          tabIndex={-1}
        >
          {visible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </button>
      </div>

      {showStrengthIndicator && String(value).length > 0 && (
        <PasswordStrengthIndicator
          validation={validation}
          showRequirements={showRequirements}
        />
      )}
    </div>
  )
}
