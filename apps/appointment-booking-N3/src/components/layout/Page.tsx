import type { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
  className?: string
  safeBottom?: boolean
}

export function Page({ children, className = '', safeBottom = true }: PageProps) {
  return (
    <div className={`min-h-screen bg-cream-100 ${safeBottom ? 'pb-24' : ''} ${className}`}>
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  )
}
