import { AlertCircle, CircleCheck } from 'tabler-icons-react'

interface PhoneInputProps {
  label: string
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (code: string) => void
  onPhoneNumberChange: (number: string) => void
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  // Verification props
  verificationStatus?: 'none' | 'pending' | 'verified'
  onVerifyClick?: () => void
  verifyLabel?: string
  pendingHint?: string
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
}: PhoneInputProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, '-')
  const showVerifyButton = verificationStatus === 'pending' && onVerifyClick
  const showPendingHint = verificationStatus === 'pending' && pendingHint

  return (
    <div className="space-y-1">
      {/* Label row with optional Verify button */}
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-label-md text-slate-700">
          {label}
          {required && <span className="text-coral-600 ml-0.5">*</span>}
        </label>
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

      {/* Input row with status icon */}
      <div className="flex gap-2">
        {/* Country code selector */}
        <div className="relative">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            disabled={disabled}
            className={`
              h-full px-3 py-2.5 text-body-md rounded-lg border appearance-none bg-white
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
            onChange={(e) => onPhoneNumberChange(e.target.value.replace(/[^\d\s-]/g, ''))}
            placeholder="123 456 7890"
            disabled={disabled}
            className={`
              w-full px-3 py-2.5 text-body-md rounded-lg border bg-white
              ${error ? 'border-coral-600 focus:ring-coral-500' : 'border-cream-400 focus:ring-teal-500'}
              focus:outline-none focus:ring-2 focus:border-transparent
              disabled:bg-cream-200 disabled:text-slate-500
              placeholder:text-slate-400
              ${verificationStatus !== 'none' ? 'pr-10' : ''}
            `}
          />
          {/* Status icon inside input */}
          {verificationStatus === 'pending' && (
            <AlertCircle
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
              fill="currentColor"
              stroke="white"
            />
          )}
          {verificationStatus === 'verified' && (
            <CircleCheck
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600"
            />
          )}
        </div>
      </div>

      {/* Help text / error */}
      {error && <p className="text-body-sm text-coral-800">{error}</p>}
      {showPendingHint && !error && (
        <p className="text-body-sm text-slate-400 italic">{pendingHint}</p>
      )}
      {hint && !error && !showPendingHint && (
        <p className="text-body-sm text-slate-500">{hint}</p>
      )}
    </div>
  )
}
