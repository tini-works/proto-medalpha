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
    <div className="flex h-12 w-full items-center rounded-lg bg-neutral-100 p-1">
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
                ? 'bg-white text-neutral-900 font-semibold shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
