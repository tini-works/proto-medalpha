import { IconShieldCheckFilled, IconCheck } from '@tabler/icons-react'

interface InsuranceBannerProps {
  insuranceType: 'GKV' | 'PKV'
  label?: string
}

export function InsuranceBanner({
  insuranceType,
  label = 'Cost & Coverage',
}: InsuranceBannerProps) {
  const insuranceLabel = insuranceType === 'GKV' ? 'Public Insurance (GKV)' : 'Private Insurance (PKV)'

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        {/* Shield/Check icon */}
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <IconShieldCheckFilled className="text-emerald-600" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-800">{label}</p>
          <div className="mt-1 flex items-center gap-2">
            <IconCheck className="text-emerald-600 flex-shrink-0" size={16} stroke={3} />
            <span className="text-sm text-emerald-700">{insuranceLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
