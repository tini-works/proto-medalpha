import { useId } from 'react'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import { Label } from '../../primitives/Label'
import { HelperText } from '../../primitives/HelperText'
import { ErrorText } from '../../primitives/ErrorText'

export interface PhoneInputProps {
  label: string
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (code: string) => void
  onPhoneNumberChange: (number: string) => void
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  verificationStatus?: 'none' | 'pending' | 'verified'
  onVerifyClick?: () => void
  verifyLabel?: string
  pendingHint?: string
  id?: string
  className?: string
}

const COUNTRY_CODES = [
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+43', country: 'AT', flag: '🇦🇹' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
]

/**
 * PhoneInput - Composed phone input with country code selector.
 *
 * Features:
 * - Country code dropdown with flags
 * - Phone number filtering (digits, spaces, dashes only)
 * - Verification status indicators (pending/verified)
 * - Optional verify button
 * - Accessible with linked labels and descriptions
 */
export function PhoneInput({
  label,
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  error,
  hint,
  required,
  disabled,
  verificationStatus = 'none',
  onVerifyClick,
  verifyLabel = 'Verify',
  pendingHint,
  id: providedId,
  className = '',
}: PhoneInputProps) {
  const generatedId = useId()
  const inputId = providedId || generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  const showVerifyButton = verificationStatus === 'pending' && onVerifyClick
  const showPendingHint = verificationStatus === 'pending' && pendingHint && !error

  // Build aria-describedby based on what's rendered
  const describedBy = error
    ? errorId
    : showPendingHint
      ? hintId
      : hint
        ? hintId
        : undefined

  // Filter input to only allow digits, spaces, and dashes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^\d\s-]/g, '')
    onPhoneNumberChange(filtered)
  }

  return (
    <div className={`space-y-1 ${className}`.trim()}>
      {/* Label row with optional Verify button */}
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        {showVerifyButton && (
          <button
            type="button"
            onClick={onVerifyClick}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            {verifyLabel}
          </button>
        )}
      </div>

      {/* Input row: country selector + phone input */}
      <div className="flex gap-2">
        {/* Country code selector */}
        <div className="relative">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            disabled={disabled}
            aria-label="Country code"
            className={`
              h-full px-3 py-2.5 text-sm rounded-lg border appearance-none bg-white
              ${error ? 'border-coral-600' : 'border-cream-400'}
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
              disabled:bg-cream-200 disabled:text-slate-500
              pr-8
            `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.25rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.25em 1.25em',
            }}
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
        </div>

        {/* Phone number input with status icon */}
        <div className="relative flex-1">
          <input
            id={inputId}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="123 456 7890"
            disabled={disabled}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            className={`
              w-full px-3 py-2.5 text-sm rounded-lg border bg-white
              ${error ? 'border-coral-600 focus:ring-coral-500' : 'border-cream-400 focus:ring-teal-500'}
              focus:outline-none focus:ring-2 focus:border-transparent
              disabled:bg-cream-200 disabled:text-slate-500
              placeholder:text-slate-400
              ${verificationStatus !== 'none' ? 'pr-10' : ''}
            `}
          />
          {/* Status icons */}
          {verificationStatus === 'pending' && (
            <IconAlertCircle
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
              fill="currentColor"
              stroke="white"
              data-testid="pending-icon"
            />
          )}
          {verificationStatus === 'verified' && (
            <IconCircleCheck
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600"
              data-testid="verified-icon"
            />
          )}
        </div>
      </div>

      {/* Help text / error */}
      {error ? (
        <ErrorText id={errorId}>{error}</ErrorText>
      ) : showPendingHint ? (
        <HelperText id={hintId} className="italic text-slate-400">
          {pendingHint}
        </HelperText>
      ) : hint ? (
        <HelperText id={hintId}>{hint}</HelperText>
      ) : null}
    </div>
  )
}
