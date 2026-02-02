import { IconSearch } from '@tabler/icons-react'

interface SpecialtySearchInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder: string
}

export function SpecialtySearchInput({ value, onChange, onKeyDown, placeholder }: SpecialtySearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <IconSearch size={20} stroke={2} className="text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-cream-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-all duration-normal ease-out-brand"
      />
    </div>
  )
}

