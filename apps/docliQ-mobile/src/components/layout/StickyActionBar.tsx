import type { ReactNode } from 'react'

interface StickyActionBarProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  zIndexClassName?: string
}

export function StickyActionBar({
  children,
  className = '',
  containerClassName = '',
  zIndexClassName = 'z-20',
}: StickyActionBarProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${zIndexClassName} bg-white border-t border-cream-300 ${className}`}>
      <div className={`mx-auto max-w-md px-4 py-4 safe-area-bottom ${containerClassName}`}>
        {children}
      </div>
    </div>
  )
}

