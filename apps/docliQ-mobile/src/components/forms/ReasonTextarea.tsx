import { useId } from 'react'

/**
 * @deprecated Use `TextareaField` from `@meda/ui` instead.
 * This component will be removed in a future release.
 */
interface ReasonTextareaProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  label?: string
}

/**
 * @deprecated Use `TextareaField` from `@meda/ui` instead.
 * This component will be removed in a future release.
 */
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
        <label htmlFor={id} className="block text-label-md text-slate-700">
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
            w-full bg-cream-200 rounded-xl p-4 resize-none
            text-charcoal-500 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white
            transition-colors duration-normal ease-out-brand
          "
        />
        <span className="absolute bottom-3 right-3 text-xs text-slate-400">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}
