import { useState, useRef, useCallback, useEffect } from 'react'

interface UseOTPInputOptions {
  length: number
  value?: string
  onChange?: (code: string) => void
  onComplete?: (code: string) => void
  autoSubmitDelay: number
  disabled?: boolean
  autoFocus?: boolean
}

export function useOTPInput(options: UseOTPInputOptions) {
  const {
    length,
    value,
    onChange,
    onComplete,
    autoSubmitDelay,
    disabled,
    autoFocus = true,
  } = options

  // Internal state for uncontrolled mode
  const [internalDigits, setInternalDigits] = useState<string[]>(() =>
    Array(length).fill('')
  )

  // Internal error state for auto-clear behavior
  const [hasInteracted, setHasInteracted] = useState(false)

  // Visual feedback states
  const [showComplete, setShowComplete] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Controlled vs uncontrolled: derive digits from value or use internal state
  const digits =
    value !== undefined
      ? value
          .split('')
          .concat(Array(length - value.length).fill(''))
          .slice(0, length)
      : internalDigits

  // Refs for each input element
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-submit timer ref
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Focus a specific input by index
  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length && !disabled) {
        inputRefs.current[index]?.focus()
      }
    },
    [length, disabled]
  )

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && !disabled) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [autoFocus, disabled])

  // Update a single digit at index
  const setDigit = useCallback(
    (index: number, digit: string) => {
      // Mark as interacted (for error auto-clear)
      if (!hasInteracted) setHasInteracted(true)

      const cleanDigit = digit.replace(/\D/g, '').slice(-1) // Only last digit, numbers only
      const newDigits = [...digits]
      newDigits[index] = cleanDigit

      // Update state
      if (value === undefined) {
        setInternalDigits(newDigits)
      }

      const code = newDigits.join('')
      onChange?.(code)

      // Check if complete (all digits filled)
      const isCodeComplete = newDigits.every((d) => d !== '')
      if (isCodeComplete && code.length === length) {
        // Clear any existing timer
        if (submitTimerRef.current) {
          clearTimeout(submitTimerRef.current)
        }

        // Show completion animation, then verify
        setShowComplete(true)

        if (autoSubmitDelay > 0) {
          // Brief pause for completion animation, then show verifying state
          submitTimerRef.current = setTimeout(() => {
            setShowComplete(false)
            setIsVerifying(true)

            // After verifying delay, trigger callback
            submitTimerRef.current = setTimeout(() => {
              setIsVerifying(false)
              if (!disabled) {
                onComplete?.(code)
              }
            }, autoSubmitDelay)
          }, 200) // 200ms for completion animation
        } else {
          setShowComplete(false)
          onComplete?.(code)
        }
      }
    },
    [digits, length, value, onChange, onComplete, autoSubmitDelay, disabled, hasInteracted]
  )

  // Handle paste event
  const handlePaste = useCallback(
    (startIndex: number, pastedText: string) => {
      // Mark as interacted
      if (!hasInteracted) setHasInteracted(true)

      const cleanDigits = pastedText.replace(/\D/g, '').slice(0, length - startIndex)
      if (!cleanDigits) return

      const newDigits = [...digits]
      cleanDigits.split('').forEach((d, i) => {
        if (startIndex + i < length) {
          newDigits[startIndex + i] = d
        }
      })

      // Update state
      if (value === undefined) {
        setInternalDigits(newDigits)
      }

      const code = newDigits.join('')
      onChange?.(code)

      // Focus appropriate input
      const nextIndex = Math.min(startIndex + cleanDigits.length, length - 1)
      focusInput(nextIndex)

      // Check completion
      const isCodeComplete = newDigits.every((d) => d !== '')
      if (isCodeComplete && code.length === length) {
        if (submitTimerRef.current) {
          clearTimeout(submitTimerRef.current)
        }

        // Show completion animation, then verify
        setShowComplete(true)

        if (autoSubmitDelay > 0) {
          submitTimerRef.current = setTimeout(() => {
            setShowComplete(false)
            setIsVerifying(true)

            submitTimerRef.current = setTimeout(() => {
              setIsVerifying(false)
              if (!disabled) {
                onComplete?.(code)
              }
            }, autoSubmitDelay)
          }, 200)
        } else {
          setShowComplete(false)
          onComplete?.(code)
        }
      }
    },
    [digits, length, value, onChange, onComplete, autoSubmitDelay, disabled, focusInput, hasInteracted]
  )

  // Clear all digits
  const clear = useCallback(() => {
    if (value === undefined) {
      setInternalDigits(Array(length).fill(''))
    }
    onChange?.('')
    setHasInteracted(false)
    focusInput(0)
  }, [length, value, onChange, focusInput])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current)
      }
    }
  }, [])

  return {
    digits,
    inputRefs,
    setDigit,
    handlePaste,
    focusInput,
    clear,
    hasInteracted,
    showComplete,
    isVerifying,
  }
}
