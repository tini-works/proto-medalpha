import { IconStarFilled } from '@tabler/icons-react'

interface RatingProps {
  value: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export function Rating({ value, reviewCount, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 16 : 20
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
            <div
              key={star}
              className={`${isFilled || isHalf ? 'text-yellow-400' : 'text-cream-400'}`}
              style={{ position: 'relative' }}
            >
              <IconStarFilled
                size={starSize}
                stroke={1.5}
                fill="currentColor"
                style={{
                  opacity: isHalf ? 0.5 : 1,
                }}
              />
            </div>
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
