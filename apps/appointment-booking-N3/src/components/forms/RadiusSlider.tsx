interface RadiusSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  unit?: string
}

export function RadiusSlider({
  value,
  onChange,
  min = 1,
  max = 50,
  label = 'Search Radius',
  unit = 'km',
}: RadiusSliderProps) {
  return (
    <div className="space-y-2">
      {/* Label and value row */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded-md">
          {value} {unit}
        </span>
      </div>

      {/* Slider track */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="radius-slider w-full"
        aria-label={`${label}: ${value} ${unit}`}
      />

      {/* Min/Max labels */}
      <div className="flex justify-between">
        <span className="text-xs text-neutral-500">
          {min} {unit}
        </span>
        <span className="text-xs text-neutral-500">
          {max} {unit}
        </span>
      </div>
    </div>
  )
}
