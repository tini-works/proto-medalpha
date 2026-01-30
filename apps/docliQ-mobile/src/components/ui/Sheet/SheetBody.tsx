import type { SheetBodyProps } from './types'

export function SheetBody({ children, className = '' }: SheetBodyProps) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}
