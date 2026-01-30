import { IconGenderMale, IconGenderFemale, IconGenderBigender, IconQuestionMark } from '@tabler/icons-react'
import type { Gender } from '../../types'

interface GenderSelectProps {
  label: string
  value: Gender | undefined
  onChange: (value: Gender) => void
  options: { value: Gender; label: string }[]
  error?: string
  required?: boolean
}

const GENDER_ICONS: Record<Gender, React.ReactNode> = {
  male: <IconGenderMale size={24} stroke={2} />,
  female: <IconGenderFemale size={24} stroke={2} />,
  diverse: <IconGenderBigender size={24} stroke={2} />,
  prefer_not_to_say: <IconQuestionMark size={24} stroke={2} />,
}

export function GenderSelect({
  label,
  value,
  onChange,
  options,
  error,
  required,
}: GenderSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-label-md text-slate-700">
        {label}
        {required && <span className="text-coral-600 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all
                ${isSelected
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-cream-300 bg-white text-slate-500 hover:border-cream-400'
                }
              `}
            >
              <span className={isSelected ? 'text-teal-600' : 'text-slate-400'}>
                {GENDER_ICONS[option.value]}
              </span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          )
        })}
      </div>
      {error && <p className="text-body-sm text-coral-800">{error}</p>}
    </div>
  )
}
