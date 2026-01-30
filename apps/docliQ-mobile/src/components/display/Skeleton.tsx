/**
 * Skeleton loading placeholder component
 * Uses CSS shimmer animation from index.css
 */

interface SkeletonProps {
  /** Width - can be Tailwind class or pixel value */
  width?: string
  /** Height - can be Tailwind class or pixel value */
  height?: string
  /** Border radius variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  /** Additional CSS classes */
  className?: string
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  variant = 'text',
  className = '',
}: SkeletonProps) {
  const radiusClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }[variant]

  return (
    <div
      className={`skeleton ${width} ${height} ${radiusClass} ${className}`}
      aria-hidden="true"
    />
  )
}

/**
 * Pre-composed skeleton for doctor card loading state
 */
export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-cream-400 p-4 space-y-3">
      <div className="flex gap-3">
        <Skeleton variant="circular" width="w-14" height="h-14" />
        <div className="flex-1 space-y-2">
          <Skeleton width="w-3/4" height="h-5" />
          <Skeleton width="w-1/2" height="h-4" />
          <div className="flex gap-2">
            <Skeleton width="w-16" height="h-4" />
            <Skeleton width="w-12" height="h-4" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-hidden">
        <Skeleton variant="rounded" width="w-20" height="h-12" />
        <Skeleton variant="rounded" width="w-20" height="h-12" />
        <Skeleton variant="rounded" width="w-20" height="h-12" />
      </div>
    </div>
  )
}

/**
 * Pre-composed skeleton for appointment card loading state
 */
export function AppointmentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-cream-400 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton width="w-20" height="h-6" variant="rounded" />
        <Skeleton width="w-24" height="h-5" />
      </div>
      <div className="flex gap-3">
        <Skeleton variant="circular" width="w-12" height="h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton width="w-2/3" height="h-5" />
          <Skeleton width="w-1/2" height="h-4" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rounded" width="w-1/2" height="h-10" />
        <Skeleton variant="rounded" width="w-1/2" height="h-10" />
      </div>
    </div>
  )
}

export default Skeleton
