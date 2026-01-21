import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  /**
   * Business intent: a simple progress cue for Helga/Sarah,
   * matching the spec’s “Schritt X von Y” requirement.
   */
  step?: { current: number; total: number }
  banner?: ReactNode
  rightSlot?: ReactNode
  /**
   * Business intent: allow screens to keep a primary action visible
   * (e.g., “Search appointments”) without relying on document scrolling.
   */
  bottomBar?: ReactNode
  children: ReactNode
}

export function MobileShell({ title, step, banner, rightSlot, bottomBar, children }: Props) {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-800">
      {/* Business intent: constrain width to feel like a handset while staying web-hostable. */}
      <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col">
        <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                to="/search"
                className="rounded-md px-2 py-2 text-sm font-semibold text-brand-blue-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
              >
                Home
              </Link>
              <div className="min-w-0">
                <div className="truncate text-base font-semibold">{title}</div>
                {step ? (
                  <div className="text-xs text-neutral-600">
                    Schritt {step.current} von {step.total}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">{rightSlot}</div>
          </div>
        </header>

        {banner ? <div className="px-4 pt-3">{banner}</div> : null}

        {/* Business intent: scroll content while keeping header/bottom actions reachable. */}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</main>

        {/* Business intent: optional fixed-in-shell actions (e.g., sticky primary CTA). */}
        {bottomBar ? <div className="shrink-0">{bottomBar}</div> : null}
      </div>
    </div>
  )
}

