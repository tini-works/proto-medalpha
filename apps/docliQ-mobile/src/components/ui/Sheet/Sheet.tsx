import { forwardRef, useState, useRef, useEffect, useId } from 'react'
import { IconX } from '@tabler/icons-react'
import { useSheetA11y } from './useSheetA11y'
import { useBodyScrollLock } from './useBodyScrollLock'
import { SheetHeader } from './SheetHeader'
import { SheetBody } from './SheetBody'
import { SheetFooter } from './SheetFooter'
import type { SheetProps, SheetVariant, SheetSize } from './types'

const EXIT_ANIMATION_DURATION = 200

// Size mappings (max-height in viewport units)
const sizeStyles: Record<SheetSize, string> = {
  auto: 'max-h-[90vh]',
  sm: 'max-h-[40vh]',
  md: 'max-h-[60vh]',
  lg: 'max-h-[85vh]',
  xl: 'max-h-[90vh]',
}

// Variant configurations
const variantConfig: Record<
  SheetVariant,
  {
    container: string
    sheet: string
    defaultShowDragHandle: boolean
  }
> = {
  bottom: {
    container: 'items-end justify-center',
    sheet: 'w-full rounded-t-2xl',
    defaultShowDragHandle: true,
  },
  center: {
    container: 'items-center justify-center p-4',
    sheet: 'w-full max-w-lg rounded-2xl',
    defaultShowDragHandle: false,
  },
  fullscreen: {
    container: 'items-stretch',
    sheet: 'w-full h-full rounded-none',
    defaultShowDragHandle: false,
  },
}

// Animation classes by variant and state
const backdropAnimation = {
  entering: 'animate-fade-in',
  exiting: 'animate-fade-out',
}

const sheetAnimation: Record<SheetVariant, { entering: string; exiting: string }> = {
  bottom: {
    entering: 'animate-slide-up',
    exiting: 'animate-slide-down',
  },
  center: {
    entering: 'animate-scale-in',
    exiting: 'animate-scale-out',
  },
  fullscreen: {
    entering: 'animate-fade-in',
    exiting: 'animate-fade-out',
  },
}

const SheetBase = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open,
      onClose,
      variant = 'bottom',
      size = 'auto',
      title,
      description,
      showDragHandle,
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      preventBodyScroll = true,
      initialFocusRef,
      children,
      footer,
      testId,
      className = '',
    },
    ref
  ) => {
    const [isClosing, setIsClosing] = useState(false)
    const [shouldRender, setShouldRender] = useState(open)
    const sheetRef = useRef<HTMLDivElement>(null)

    const titleId = useId()
    const descriptionId = useId()

    // Resolve showDragHandle default based on variant
    const resolvedShowDragHandle =
      showDragHandle ?? variantConfig[variant].defaultShowDragHandle

    // Handle open/close with exit animation
    useEffect(() => {
      if (open) {
        setShouldRender(true)
        setIsClosing(false)
      } else if (shouldRender) {
        setIsClosing(true)
        const timer = setTimeout(() => {
          setShouldRender(false)
          setIsClosing(false)
        }, EXIT_ANIMATION_DURATION)
        return () => clearTimeout(timer)
      }
    }, [open, shouldRender])

    // Accessibility: focus trap, escape key, focus restoration
    useSheetA11y({
      open: shouldRender && !isClosing,
      onClose,
      closeOnEscape,
      initialFocusRef,
      sheetRef,
    })

    // Body scroll lock
    useBodyScrollLock(preventBodyScroll && shouldRender)

    if (!shouldRender) return null

    const animationState = isClosing ? 'exiting' : 'entering'
    const config = variantConfig[variant]

    const handleBackdropClick = () => {
      if (closeOnBackdropClick) onClose()
    }

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        data-testid={testId}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-charcoal-900/50 ${backdropAnimation[animationState]}`}
          onClick={handleBackdropClick}
          data-testid={testId ? `${testId}-backdrop` : 'sheet-backdrop'}
        />

        {/* Sheet container */}
        <div className={`absolute inset-0 flex ${config.container}`}>
          {/* Sheet panel */}
          <div
            ref={sheetRef}
            tabIndex={-1}
            className={`
              relative flex flex-col bg-white shadow-xl overflow-hidden
              ${config.sheet}
              ${sizeStyles[size]}
              ${sheetAnimation[variant][animationState]}
              ${className}
            `}
          >
            {/* Drag handle */}
            {resolvedShowDragHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-cream-400" />
              </div>
            )}

            {/* Header with title and close button */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 pb-3">
                {title ? (
                  <h2
                    id={titleId}
                    className="text-lg font-semibold text-charcoal-500"
                  >
                    {title}
                  </h2>
                ) : (
                  <div />
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors duration-normal ease-out-brand focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                    aria-label="Close"
                  >
                    <IconX size={20} stroke={2} className="text-slate-600" />
                  </button>
                )}
              </div>
            )}

            {/* Hidden description for screen readers */}
            {description && (
              <p id={descriptionId} className="sr-only">
                {description}
              </p>
            )}

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">{children}</div>

            {/* Footer slot */}
            {footer && (
              <div className="flex-shrink-0 border-t border-cream-300 bg-white px-4 py-4 safe-area-bottom">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

SheetBase.displayName = 'Sheet'

// Compound component with sub-components attached
type SheetComponent = typeof SheetBase & {
  Header: typeof SheetHeader
  Body: typeof SheetBody
  Footer: typeof SheetFooter
}

export const Sheet = SheetBase as SheetComponent
Sheet.Header = SheetHeader
Sheet.Body = SheetBody
Sheet.Footer = SheetFooter
