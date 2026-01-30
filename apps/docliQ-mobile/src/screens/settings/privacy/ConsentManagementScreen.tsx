import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconChecks,
  IconToggleRight,
  IconToggleLeft,
  IconHistory,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { Header, Page } from '../../../components'
import { Button } from '../../../components/ui'
import type { ConsentRecord, ConsentType } from '../../../types/legal'

// Mock consent history
const MOCK_HISTORY: ConsentRecord[] = [
  {
    id: '1',
    type: 'data_processing',
    granted: true,
    timestamp: '2025-10-01T10:00:00Z',
    version: '1.0.0',
    source: 'registration',
  },
  {
    id: '2',
    type: 'marketing',
    granted: true,
    timestamp: '2025-10-01T10:00:00Z',
    version: '1.0.0',
    source: 'registration',
  },
  {
    id: '3',
    type: 'analytics',
    granted: true,
    timestamp: '2025-11-15T14:30:00Z',
    version: '1.0.0',
    source: 'settings',
  },
  {
    id: '4',
    type: 'marketing',
    granted: false,
    timestamp: '2026-01-10T09:00:00Z',
    version: '1.0.0',
    source: 'settings',
  },
]

interface ConsentState {
  dataProcessing: boolean
  marketing: boolean
  analytics: boolean
  thirdParty: boolean
}

/**
 * Consent Management screen - GDPR Art. 7 compliance.
 * Allows users to view and manage their consent preferences.
 */
export default function ConsentManagementScreen() {
  const { t } = useTranslation('legal')
  const [consents, setConsents] = useState<ConsentState>({
    dataProcessing: true, // Cannot be revoked while using app
    marketing: false,
    analytics: true,
    thirdParty: false,
  })
  const [history] = useState<ConsentRecord[]>(MOCK_HISTORY)
  const [showHistory, setShowHistory] = useState(false)
  const [confirmWithdraw, setConfirmWithdraw] = useState<keyof ConsentState | null>(null)

  const consentTypes: { key: keyof ConsentState; type: ConsentType; required: boolean }[] = [
    { key: 'dataProcessing', type: 'data_processing', required: true },
    { key: 'marketing', type: 'marketing', required: false },
    { key: 'analytics', type: 'analytics', required: false },
    { key: 'thirdParty', type: 'third_party', required: false },
  ]

  const handleToggle = (key: keyof ConsentState) => {
    if (key === 'dataProcessing') return // Cannot toggle required consent

    if (consents[key]) {
      // Withdrawing - show confirmation
      setConfirmWithdraw(key)
    } else {
      // Granting
      setConsents(prev => ({ ...prev, [key]: true }))
    }
  }

  const handleConfirmWithdraw = () => {
    if (confirmWithdraw) {
      setConsents(prev => ({ ...prev, [confirmWithdraw]: false }))
      setConfirmWithdraw(null)
    }
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('consent.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
            <IconChecks size={24} className="text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">{t('consent.subtitle')}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600">{t('consent.description')}</p>

        {/* Consent toggles */}
        <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
          {consentTypes.map(({ key, required }) => (
            <div key={key} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-charcoal-500">
                      {t(`consent.types.${key}.title`)}
                    </p>
                    {required && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {t(`consent.types.${key}.description`)}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(key)}
                  disabled={required}
                  className={`flex-shrink-0 ${required ? 'cursor-not-allowed' : ''}`}
                  aria-label={consents[key] ? 'Withdraw consent' : 'Grant consent'}
                >
                  {consents[key] ? (
                    <IconToggleRight
                      size={32}
                      className={required ? 'text-slate-400' : 'text-teal-600'}
                    />
                  ) : (
                    <IconToggleLeft size={32} className="text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* History toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <IconHistory size={18} />
          {t('consent.history.title')}
        </button>

        {/* History timeline */}
        {showHistory && (
          <div className="bg-cream-100 rounded-xl p-4 space-y-3">
            {history.map((record, index) => (
              <div
                key={record.id}
                className={`flex items-start gap-3 ${
                  index !== history.length - 1 ? 'pb-3 border-b border-cream-300' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  record.granted ? 'bg-green-500' : 'bg-coral-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-charcoal-500">
                    {t(`consent.types.${record.type.replace('_', '')}.title`)}
                    {' - '}
                    <span className={record.granted ? 'text-green-600' : 'text-coral-500'}>
                      {t(`consent.history.${record.granted ? 'granted' : 'withdrawn'}`)}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">
                    {t('consent.history.on', { date: formatDate(record.timestamp) })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw confirmation modal */}
      {confirmWithdraw && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <IconAlertTriangle size={20} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal-500">
                {t('consent.withdraw.title')}
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              {t('consent.withdraw.warning')}
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="destructive"
                fullWidth
                onClick={handleConfirmWithdraw}
              >
                {t('consent.withdraw.confirm')}
              </Button>
              <Button
                variant="tertiary"
                fullWidth
                onClick={() => setConfirmWithdraw(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}
