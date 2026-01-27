import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header, Page } from '../../components'
import { useAuth } from '../../state'
import { PATHS } from '../../routes'

export default function VerifyScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { markVerified } = useAuth()

  // Check if this is a registration flow (from RegisterScreen)
  const isRegistration = (location.state as { isRegistration?: boolean })?.isRegistration ?? false
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const newCode = [...code]
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit
        }
      })
      setCode(newCode)
      // Focus last filled or next empty
      const nextIndex = Math.min(index + digits.length, 5)
      document.getElementById(`code-${nextIndex}`)?.focus()
    } else {
      // Single digit
      const newCode = [...code]
      newCode[index] = value.replace(/\D/g, '')
      setCode(newCode)

      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus()
      }
    }
    setError('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    // Mock verification - any code works
    markVerified()

    // Navigate to Complete Profile only for registration, otherwise go to Home
    if (isRegistration) {
      navigate(PATHS.PROFILE_COMPLETE)
    } else {
      navigate(PATHS.HOME)
    }
  }

  const handleResend = () => {
    // Mock resend
    setCode(['', '', '', '', '', ''])
    setError('')
  }

  return (
    <Page safeBottom={false}>
      <Header title="Verify Email" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Check your email</h2>
          <p className="mt-1 text-sm text-neutral-500">
            We sent a 6-digit verification code to your email. Enter it below to verify your account.
          </p>
        </div>

        {/* Code input */}
        <div className="flex justify-center gap-2 mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-xl font-semibold rounded-lg border ${
                error ? 'border-red-500' : 'border-neutral-300'
              } focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent`}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm text-red-500 mb-4">{error}</p>}

        <p className="text-center text-sm text-neutral-500 mb-6">
          For this demo, enter any 6-digit code to continue.
        </p>

        <button
          type="submit"
          className="btn btn-primary btn-block"
        >
          Verify
        </button>

        <button
          type="button"
          onClick={handleResend}
          className="btn btn-tertiary btn-block mt-3"
        >
          Resend code
        </button>
      </form>
    </Page>
  )
}
