import type { SheetHeaderProps } from './types'

export function SheetHeader({ children, className = '' }: SheetHeaderProps) {
  return (
    <div className={`flex-shrink-0 px-4 pb-3 ${className}`}>
      {children}
    </div>
  )
}
