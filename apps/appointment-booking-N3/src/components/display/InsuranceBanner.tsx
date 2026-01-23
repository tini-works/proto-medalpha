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
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-800">{label}</p>
          <div className="mt-1 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-emerald-700">{insuranceLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
