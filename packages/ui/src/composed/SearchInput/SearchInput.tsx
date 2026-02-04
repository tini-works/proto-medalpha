import { forwardRef } from 'react'
import { IconSearch } from '@tabler/icons-react'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder: string
  'aria-label': string
  disabled?: boolean
  className?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onKeyDown,
      placeholder,
      'aria-label': ariaLabel,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    return (
      <div className="relative">
        {/* Search icon - positioned left, vertically centered */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconSearch
            size={20}
            stroke={2}
            className="text-slate-400"
            data-testid="search-icon"
          />
        </div>

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled}
          className={`
            w-full h-14 pl-12 pr-4 rounded-xl bg-white
            border border-cream-400
            focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none
            text-charcoal-500 placeholder:text-slate-400
            disabled:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-60
            transition-all duration-normal ease-out-brand
            ${className}
          `}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
