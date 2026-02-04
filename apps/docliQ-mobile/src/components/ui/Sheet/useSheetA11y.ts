import { useEffect, useRef, useCallback, type RefObject } from 'react'

interface UseSheetA11yOptions {
  open: boolean
  onClose: () => void
  closeOnEscape: boolean
  initialFocusRef?: RefObject<HTMLElement>
  sheetRef: RefObject<HTMLDivElement>
}

/**
 * Manages accessibility for Sheet component:
 * - Focus trap (Tab cycles within sheet)
 * - Escape key handling
 * - Focus restoration on close
 * - Screen reader announcements
 */
export function useSheetA11y({
  open,
  onClose,
  closeOnEscape,
  initialFocusRef,
  sheetRef,
}: UseSheetA11yOptions) {
  // Store element that had focus before opening
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Get all focusable elements within the sheet
  const getFocusableElements = useCallback(() => {
    if (!sheetRef.current) return []

    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    return Array.from(sheetRef.current.querySelectorAll<HTMLElement>(selector))
  }, [sheetRef])

  // Handle keyboard events for focus trap and escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return

      // Escape key closes sheet
      if (e.key === 'Escape' && closeOnEscape) {
        e.preventDefault()
        onClose()
        return
      }

      // Tab key for focus trap
      if (e.key === 'Tab') {
        const focusable = getFocusableElements()
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        // Shift+Tab from first element -> focus last
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
        // Tab from last element -> focus first
        else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [open, closeOnEscape, onClose, getFocusableElements]
  )

  // Set up focus management and event listeners
  useEffect(() => {
    if (open) {
      // Store current focus for restoration
      previousActiveElement.current = document.activeElement as HTMLElement

      // Set initial focus after a frame (allows DOM to settle)
      requestAnimationFrame(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus()
        } else {
          // Focus first focusable element, or sheet container as fallback
          const focusable = getFocusableElements()
          if (focusable.length > 0) {
            focusable[0].focus()
          } else {
            sheetRef.current?.focus()
          }
        }
      })

      // Add keyboard listener
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    } else if (previousActiveElement.current) {
      // Restore focus when closing
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [open, handleKeyDown, initialFocusRef, getFocusableElements, sheetRef])
}
