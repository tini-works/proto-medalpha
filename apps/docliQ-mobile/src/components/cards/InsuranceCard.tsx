import { IconBuildingHospital, IconShieldCheck } from '@tabler/icons-react'

interface InsuranceCardProps {
  type: 'GKV' | 'PKV'
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

export function InsuranceCard({
  type,
  title,
  description,
  selected,
  onSelect,
}: InsuranceCardProps) {
  const Icon = type === 'GKV' ? IconBuildingHospital : IconShieldCheck
  const iconBg = type === 'GKV' ? 'bg-teal-100' : 'bg-emerald-100'
  const iconColor = type === 'GKV' ? 'text-teal-600' : 'text-emerald-600'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
        ${selected
          ? 'border-teal-500 bg-teal-50'
          : 'border-cream-300 bg-white hover:border-cream-400'
        }
      `}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={24} stroke={2} className={iconColor} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold ${selected ? 'text-teal-700' : 'text-charcoal-500'}`}>
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>

      {/* Radio indicator */}
      <div
        className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${selected ? 'border-teal-500 bg-teal-500' : 'border-cream-400'}
        `}
      >
        {selected && (
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        )}
      </div>
    </button>
  )
}
