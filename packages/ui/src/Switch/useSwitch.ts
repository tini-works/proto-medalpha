import { useState, useCallback } from 'react'

export interface UseSwitchOptions {
  /** Controlled checked state */
  checked?: boolean
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean
  /** Called when switch state changes */
  onChange?: (checked: boolean) => void
  /** Disable interaction */
  disabled?: boolean
  /** Loading state prevents interaction */
  loading?: boolean
}

export function useSwitch(options: UseSwitchOptions) {
  const {
    checked,
    defaultChecked = false,
    onChange,
    disabled,
    loading,
  } = options

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  // Determine if controlled
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  const toggle = useCallback(() => {
    if (disabled || loading) return

    const newValue = !isChecked

    // Update internal state only in uncontrolled mode
    if (!isControlled) {
      setInternalChecked(newValue)
    }

    onChange?.(newValue)
  }, [isChecked, isControlled, disabled, loading, onChange])

  return { isChecked, toggle }
}
