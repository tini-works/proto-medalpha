import type { ReactNode, RefObject } from 'react'

export type SheetVariant = 'bottom' | 'center' | 'fullscreen'
export type SheetSize = 'auto' | 'sm' | 'md' | 'lg' | 'xl'

export interface SheetProps {
  /** Controlled open state */
  open: boolean
  /** Close handler - required for accessibility */
  onClose: () => void
  /** Visual variant */
  variant?: SheetVariant
  /** Height preset */
  size?: SheetSize
  /** Title displayed in header (enables aria-labelledby) */
  title?: string
  /** Description for screen readers (enables aria-describedby) */
  description?: string
  /** Show drag handle (default: true for bottom, false for center/fullscreen) */
  showDragHandle?: boolean
  /** Show close button in header (default: true) */
  showCloseButton?: boolean
  /** Close when clicking backdrop (default: true) */
  closeOnBackdropClick?: boolean
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean
  /** Prevent body scroll when open (default: true) */
  preventBodyScroll?: boolean
  /** Custom initial focus element */
  initialFocusRef?: RefObject<HTMLElement>
  /** Main content */
  children: ReactNode
  /** Optional footer slot (renders sticky at bottom) */
  footer?: ReactNode
  /** Test ID for testing */
  testId?: string
  /** Additional CSS class for sheet container */
  className?: string
}

export interface SheetHeaderProps {
  children?: ReactNode
  className?: string
}

export interface SheetBodyProps {
  children: ReactNode
  className?: string
}

export interface SheetFooterProps {
  children: ReactNode
  className?: string
}
