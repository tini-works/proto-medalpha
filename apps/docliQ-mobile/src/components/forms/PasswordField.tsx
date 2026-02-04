import { useState, type InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
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
  id,
  ...props
}: PasswordFieldProps) {
  const { t } = useTranslation('auth')
  const [visible, setVisible] = useState(false)
  const validation = validatePassword(String(value))
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  const toggleVisibility = () => setVisible((v) => !v)

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-label-md text-slate-700">
        {label}
        {props.required && <span className="text-coral-600 ml-0.5">*</span>}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={value}
          className={`
            w-full px-3 py-2.5 pr-12 text-body-md rounded-lg border bg-white
            ${error ? 'border-coral-600 focus:ring-coral-500' : 'border-cream-400 focus:ring-teal-500'}
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-cream-200 disabled:text-slate-500
            placeholder:text-slate-400
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 transition-colors"
          aria-label={t(visible ? 'password.hide' : 'password.show')}
          tabIndex={-1}
        >
          {visible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </button>
      </div>

      {error && <p className="text-body-sm text-coral-800">{error}</p>}
      {hint && !error && !showStrengthIndicator && <p className="text-body-sm text-slate-500">{hint}</p>}

      {showStrengthIndicator && String(value).length > 0 && (
        <PasswordStrengthIndicator
          validation={validation}
          showRequirements={showRequirements}
        />
      )}
    </div>
  )
}
