interface RatingProps {
  value: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export function Rating({ value, reviewCount, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  // Round to nearest 0.5
  const roundedValue = Math.round(value * 2) / 2

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(roundedValue)
          const isHalf = !isFilled && star - 0.5 === roundedValue

          return (
            <svg
              key={star}
              className={`${starSize} ${isFilled || isHalf ? 'text-yellow-400' : 'text-cream-400'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {isHalf ? (
                <>
                  <defs>
                    <linearGradient id={`half-${star}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#d1d5db" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${star})`}
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </>
              ) : (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              )}
            </svg>
          )
        })}
      </div>
      <span className={`${textSize} text-slate-500 font-medium`}>{value.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className={`${textSize} text-slate-400`}>({reviewCount})</span>
      )}
    </div>
  )
}
