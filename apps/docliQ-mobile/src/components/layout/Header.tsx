import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IconChevronLeft } from '@tabler/icons-react'
import { Button } from '../ui'

interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: ReactNode
}

export function Header({ title, subtitle, showBack = false, onBack, rightAction }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    // Priority 1: Use custom onBack handler if provided
    if (onBack) {
      onBack()
      return
    }

    // Priority 2: Use location.state.from if available
    const fromPath = (location.state as any)?.from as string | undefined
    const currentPath = `${location.pathname}${location.search}`
    // Guard against self-references which can create navigation loops
    if (fromPath && fromPath !== currentPath) {
      navigate(fromPath)
      return
    }

    // Priority 3: Use browser history
    navigate(-1)
  }

  return (
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-cream-300">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
          {/* Back button uses shared Button component with icon variant */}
          {showBack && (
            <Button
              variant="icon"
              size="sm"
              onClick={handleBack}
              className="-ml-2"
              aria-label="Go back"
            >
              <IconChevronLeft className="text-slate-700" size={24} stroke={2} />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-charcoal-500">{title}</h1>
            {subtitle && <p className="truncate text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  )
}
