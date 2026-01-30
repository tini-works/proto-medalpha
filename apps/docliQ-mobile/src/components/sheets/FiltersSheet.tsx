import { useTranslation } from 'react-i18next'
import { Button, Sheet } from '../ui'
import { translateLanguage } from '../../utils'

interface FiltersSheetProps {
  open: boolean
  onClose: () => void
  onApply: () => void
  // Filter values
  radius: number
  setRadius: (value: number) => void
  minRating: number
  setMinRating: (value: number) => void
  onlyPublic: boolean
  setOnlyPublic: (value: boolean) => void
  selectedLanguages: string[]
  setSelectedLanguages: (value: string[] | ((prev: string[]) => string[])) => void
  availableLanguages: string[]
}

export function FiltersSheet({
  open,
  onClose,
  onApply,
  radius,
  setRadius,
  minRating,
  setMinRating,
  onlyPublic,
  setOnlyPublic,
  selectedLanguages,
  setSelectedLanguages,
  availableLanguages,
}: FiltersSheetProps) {
  const { t } = useTranslation('booking')

  const handleClearAll = () => {
    setRadius(10)
    setMinRating(0)
    setOnlyPublic(false)
    setSelectedLanguages([])
  }

  const handleApply = () => {
    onApply()
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      variant="bottom"
      size="xl"
      title={t('filters')}
      testId="filters-sheet"
      footer={
        <Button onClick={handleApply} variant="primary" fullWidth size="lg">
          {t('applyFilters')}
        </Button>
      }
    >
      {/* Clear All button in header area */}
      <div className="flex justify-end px-4 -mt-2 mb-2">
        <button
          onClick={handleClearAll}
          className="text-sm font-medium text-slate-600 hover:underline"
        >
          {t('clearAll')}
        </button>
      </div>

      <Sheet.Body className="px-4 pb-6 space-y-6">
        {/* Distance */}
        <section className="bg-white rounded-2xl border border-cream-400 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-charcoal-500">{t('distance')}</p>
            <span className="px-2 py-0.5 rounded-md bg-cream-100 text-sm font-semibold text-charcoal-500">
              {radius} {t('km')}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-teal-500"
            aria-label="Distance radius in kilometers"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>1 {t('km')}</span>
            <span>50 {t('km')}</span>
          </div>
        </section>

        {/* Rating */}
        <section className="bg-white rounded-2xl border border-cream-400 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-charcoal-500">{t('minimumRating')}</p>
            <span className="text-sm font-semibold text-charcoal-500">{minRating.toFixed(1)}+</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full accent-teal-500"
            aria-label="Minimum rating"
          />
        </section>

        {/* Toggles */}
        <section className="bg-white rounded-2xl border border-cream-400 p-4 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyPublic}
              onChange={(e) => setOnlyPublic(e.target.checked)}
              className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500 border-cream-400"
            />
            <div>
              <p className="font-medium text-charcoal-500">{t('onlyPublicInsurance')}</p>
              <p className="text-sm text-slate-600 mt-1">{t('publicInsuranceHint')}</p>
            </div>
          </label>
        </section>

        {/* Languages */}
        <section className="bg-white rounded-2xl border border-cream-400 p-4">
          <p className="text-sm font-semibold text-charcoal-500 mb-3">{t('languages')}</p>
          {availableLanguages.length === 0 ? (
            <p className="text-sm text-slate-600">{t('noLanguageData')}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map((lang) => {
                const selected = selectedLanguages.includes(lang)
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setSelectedLanguages((prev: string[]) =>
                        prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                      )
                    }}
                    className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors duration-normal ease-out-brand ${
                      selected
                        ? 'bg-teal-50 border-teal-500 text-teal-700'
                        : 'bg-white border-cream-400 text-slate-700 hover:bg-cream-50'
                    }`}
                  >
                    {translateLanguage(t, lang)}
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </Sheet.Body>
    </Sheet>
  )
}
