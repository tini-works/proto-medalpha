import type { SheetFooterProps } from './types'

export function SheetFooter({ children, className = '' }: SheetFooterProps) {
  return (
    <div
      className={`flex-shrink-0 border-t border-cream-300 bg-white px-4 py-4 safe-area-bottom flex flex-col gap-3 ${className}`}
    >
      {children}
    </div>
  )
}
