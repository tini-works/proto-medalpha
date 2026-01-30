interface TabToggleOption {
  value: string
  label: string
}

interface TabToggleProps {
  options: TabToggleOption[]
  value: string
  onChange: (value: string) => void
}

export function TabToggle({ options, value, onChange }: TabToggleProps) {
  return (
    <div className="flex h-12 w-full items-center rounded-lg bg-cream-200 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            flex h-full flex-1 items-center justify-center rounded-lg px-4 text-sm font-medium
            transition-all duration-200
            ${
              value === option.value
                ? 'bg-white text-charcoal-500 font-semibold shadow-sm'
                : 'text-slate-500 hover:text-charcoal-500'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
