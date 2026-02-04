import { useEffect } from 'react'

/**
 * Locks body scroll when a modal/sheet is open.
 * Preserves scroll position and restores it on unlock.
 */
export function useBodyScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return

    // Store current scroll position and styles
    const scrollY = window.scrollY
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width

    // Lock scroll by fixing the body
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth

      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [lock])
}
