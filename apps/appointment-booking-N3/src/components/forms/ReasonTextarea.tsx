import { useId } from 'react'

interface ReasonTextareaProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  label?: string
}

export function ReasonTextarea({
  value,
  onChange,
  maxLength = 200,
  placeholder = 'Describe your symptoms or reason for visit...',
  label,
}: ReasonTextareaProps) {
  const id = useId()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          className="
            w-full bg-neutral-100 rounded-xl p-4 resize-none
            text-neutral-900 placeholder:text-neutral-400
            focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:bg-white
            transition-colors
          "
        />
        <span className="absolute bottom-3 right-3 text-xs text-neutral-400">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}
