import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconDownload,
  IconFileText,
  IconJson,
  IconCalendar,
  IconUsers,
  IconChecks,
  IconUser,
  IconClock,
} from '@tabler/icons-react'
import { Header, Page } from '../../../components'
import { Button } from '../../../components/ui'
import type { DataExportRequest, DataExportFormat } from '../../../types/legal'

/**
 * Data Export screen - GDPR Art. 20 Data Portability.
 * Allows users to request and download their personal data.
 */
export default function DataExportScreen() {
  const { t } = useTranslation('legal')
  const [selectedFormat, setSelectedFormat] = useState<DataExportFormat>('json')
  const [exportRequest, setExportRequest] = useState<DataExportRequest | null>(null)

  const handleRequestExport = () => {
    // Mock export request - in real app, this would call an API
    const newRequest: DataExportRequest = {
      id: `export-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      format: selectedFormat,
    }
    setExportRequest(newRequest)

    // Simulate processing
    setTimeout(() => {
      setExportRequest(prev => prev ? { ...prev, status: 'processing' } : null)
    }, 1000)

    setTimeout(() => {
      setExportRequest(prev => prev ? {
        ...prev,
        status: 'ready',
        downloadUrl: '#',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      } : null)
    }, 3000)
  }

  const handleDownload = () => {
    if (exportRequest) {
      setExportRequest({ ...exportRequest, status: 'downloaded' })
      // In real app, trigger file download
      alert('Download started (mock)')
    }
  }

  const handleNewRequest = () => {
    setExportRequest(null)
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

  const dataIncludes = [
    { icon: <IconUser size={18} className="text-teal-600" />, key: 'profile' },
    { icon: <IconCalendar size={18} className="text-teal-600" />, key: 'appointments' },
    { icon: <IconChecks size={18} className="text-teal-600" />, key: 'consents' },
    { icon: <IconUsers size={18} className="text-teal-600" />, key: 'familyMembers' },
  ]

  return (
    <Page safeBottom={false}>
      <Header title={t('export.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
            <IconDownload size={24} className="text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">{t('export.subtitle')}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600">{t('export.description')}</p>

        {/* Existing export request */}
        {exportRequest ? (
          <div className="bg-white rounded-xl border border-cream-400 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconClock size={18} className="text-slate-400" />
                <span className="text-sm text-slate-600">
                  {t('export.requestedOn', { date: formatDate(exportRequest.requestedAt) })}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                exportRequest.status === 'ready' ? 'bg-green-100 text-green-700' :
                exportRequest.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                exportRequest.status === 'downloaded' ? 'bg-slate-100 text-slate-600' :
                'bg-teal-100 text-teal-700'
              }`}>
                {t(`export.status.${exportRequest.status}`)}
              </span>
            </div>

            {exportRequest.status === 'processing' && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                {t('export.status.processing')}
              </div>
            )}

            {exportRequest.status === 'ready' && (
              <Button onClick={handleDownload} fullWidth>
                <IconDownload size={18} className="mr-2" />
                {t('export.download')}
              </Button>
            )}

            {(exportRequest.status === 'downloaded' || exportRequest.status === 'expired') && (
              <Button onClick={handleNewRequest} variant="secondary" fullWidth>
                {t('export.newRequest')}
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Format selection */}
            <div>
              <h3 className="text-sm font-medium text-charcoal-500 mb-3">
                {t('export.formats.title')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFormat('json')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedFormat === 'json'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-cream-300 bg-white hover:border-cream-400'
                  }`}
                >
                  <IconJson size={24} className={selectedFormat === 'json' ? 'text-teal-600' : 'text-slate-400'} />
                  <p className="mt-2 text-sm font-medium text-charcoal-500">
                    {t('export.formats.json')}
                  </p>
                </button>
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedFormat === 'pdf'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-cream-300 bg-white hover:border-cream-400'
                  }`}
                >
                  <IconFileText size={24} className={selectedFormat === 'pdf' ? 'text-teal-600' : 'text-slate-400'} />
                  <p className="mt-2 text-sm font-medium text-charcoal-500">
                    {t('export.formats.pdf')}
                  </p>
                </button>
              </div>
            </div>

            {/* What's included */}
            <div>
              <h3 className="text-sm font-medium text-charcoal-500 mb-3">
                {t('export.includes.title')}
              </h3>
              <div className="bg-cream-100 rounded-xl p-4 space-y-3">
                {dataIncludes.map(({ icon, key }) => (
                  <div key={key} className="flex items-center gap-3">
                    {icon}
                    <span className="text-sm text-slate-600">
                      {t(`export.includes.${key}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request button */}
            <Button onClick={handleRequestExport} fullWidth>
              {t('export.requestButton')}
            </Button>
          </>
        )}
      </div>
    </Page>
  )
}
