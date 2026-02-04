import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronLeft, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import { Page } from '../../components'
import { Button } from '../../components/ui'
import { Field } from '../../components/forms'
import { useProfile, useAuth } from '../../state'
import { PATHS } from '../../routes'

type ScanState = 'idle' | 'scanning' | 'success' | 'error'

interface ExtractedData {
  holderName: string
  egkNumber: string
  insurerName: string
  validUntil: string
}

export default function CardScanScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const { markIdentityVerified } = useAuth()

  const [scanState, setScanState] = useState<ScanState>('idle')
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualEgkNumber, setManualEgkNumber] = useState('')
  const [manualError, setManualError] = useState('')

  // Generate mock data based on profile
  const generateMockData = (): ExtractedData => ({
    holderName: profile.fullName || 'Max Mustermann',
    egkNumber: `A${Math.random().toString().slice(2, 11)}`,
    insurerName: profile.insuranceType === 'GKV' ? 'AOK Bayern' : 'Allianz Private',
    validUntil: '12/2027',
  })

  const handleStartScan = () => {
    setScanState('scanning')

    // Simulate scan with 2-3 second delay
    setTimeout(() => {
      // 10% mock failure rate
      if (Math.random() < 0.1) {
        setScanState('error')
      } else {
        const data = generateMockData()
        setExtractedData(data)
        setScanState('success')
      }
    }, 2500)
  }

  const handleConfirm = () => {
    if (extractedData) {
      updateProfile({ egkNumber: extractedData.egkNumber })
      markIdentityVerified()
      navigate(PATHS.ONBOARDING_SUCCESS)
    }
  }

  const handleScanAgain = () => {
    setScanState('idle')
    setExtractedData(null)
  }

  const handleManualEntry = () => {
    setShowManualEntry(true)
    setScanState('idle')
  }

  const handleManualSubmit = () => {
    // Validate eGK format: starts with letter, 10 chars
    if (!/^[A-Za-z]\d{9}$/.test(manualEgkNumber)) {
      setManualError(t('onboarding.scan.invalidFormat'))
      return
    }

    updateProfile({ egkNumber: manualEgkNumber })
    // Note: Manual entry does NOT mark as verified
    navigate(PATHS.HOME)
  }

  const handleBack = () => {
    navigate(-1)
  }

  // Scanning animation
  const [scanLinePosition, setScanLinePosition] = useState(0)
  useEffect(() => {
    if (scanState !== 'scanning') return
    const interval = setInterval(() => {
      setScanLinePosition((prev) => (prev + 2) % 100)
    }, 30)
    return () => clearInterval(interval)
  }, [scanState])

  return (
    <Page safeBottom={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg hover:bg-cream-200 transition-colors"
          aria-label="Go back"
        >
          <IconChevronLeft size={24} className="text-charcoal-500" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-charcoal-500">
          {t('onboarding.scan.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 flex flex-col">
        {/* Manual entry form */}
        {showManualEntry ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-charcoal-500">
                {t('onboarding.scan.manualTitle')}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {t('onboarding.scan.manualDescription')}
              </p>
            </div>

            <Field
              label={t('onboarding.scan.cardNumber')}
              value={manualEgkNumber}
              onChange={(e) => {
                setManualEgkNumber(e.target.value.toUpperCase())
                setManualError('')
              }}
              placeholder="A123456789"
              error={manualError}
              hint={t('onboarding.scan.formatHint')}
              required
            />

            <div className="flex-1" />

            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={handleManualSubmit}>
                {t('onboarding.scan.saveNumber')}
              </Button>
              <Button variant="tertiary" fullWidth onClick={() => setShowManualEntry(false)}>
                {t('onboarding.scan.backToScan')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Scanner viewfinder */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {scanState === 'idle' && (
                <>
                  <div className="relative w-64 h-40 bg-charcoal-800 rounded-2xl overflow-hidden mb-6">
                    {/* Viewfinder corners */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-teal-400 rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-teal-400 rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-teal-400 rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-teal-400 rounded-br-lg" />
                    {/* Center hint */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/60 text-sm text-center px-4">
                        {t('onboarding.scan.instruction')}
                      </p>
                    </div>
                  </div>
                  <Button variant="primary" onClick={handleStartScan}>
                    {t('onboarding.scan.startScan')}
                  </Button>
                </>
              )}

              {scanState === 'scanning' && (
                <>
                  <div className="relative w-64 h-40 bg-charcoal-800 rounded-2xl overflow-hidden mb-6">
                    {/* Scan line animation */}
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-teal-400 shadow-lg shadow-teal-400/50"
                      style={{ top: `${scanLinePosition}%` }}
                    />
                    {/* Viewfinder corners */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-teal-400 rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-teal-400 rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-teal-400 rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-teal-400 rounded-br-lg" />
                  </div>
                  <p className="text-sm text-slate-500 animate-pulse">
                    {t('onboarding.scan.scanning')}
                  </p>
                </>
              )}

              {scanState === 'success' && extractedData && (
                <div className="w-full space-y-6">
                  {/* Success indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                      <IconCheck size={32} className="text-teal-600" />
                    </div>
                    <p className="text-sm font-medium text-teal-600">
                      {t('onboarding.scan.detected')}
                    </p>
                  </div>

                  {/* Extracted data */}
                  <div className="bg-cream-100 rounded-xl p-4 space-y-3 border border-cream-300">
                    <h3 className="text-sm font-semibold text-charcoal-500">
                      {t('onboarding.scan.extractedData')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">{t('onboarding.scan.holderName')}</span>
                        <span className="text-sm font-medium text-charcoal-500">{extractedData.holderName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">{t('onboarding.scan.cardNumber')}</span>
                        <span className="text-sm font-mono font-medium text-charcoal-500">{extractedData.egkNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">{t('onboarding.scan.insurer')}</span>
                        <span className="text-sm font-medium text-charcoal-500">{extractedData.insurerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">{t('onboarding.scan.validUntil')}</span>
                        <span className="text-sm font-medium text-charcoal-500">{extractedData.validUntil}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {scanState === 'error' && (
                <div className="w-full space-y-6">
                  {/* Error indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                      <IconAlertCircle size={32} className="text-amber-600" />
                    </div>
                    <p className="text-sm font-medium text-amber-600">
                      {t('onboarding.scan.errorTitle')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      {t('onboarding.scan.errorDescription')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="space-y-3 pt-4">
              {scanState === 'success' && (
                <>
                  <Button variant="primary" fullWidth onClick={handleConfirm}>
                    {t('onboarding.scan.confirm')}
                  </Button>
                  <Button variant="tertiary" fullWidth onClick={handleScanAgain}>
                    {t('onboarding.scan.scanAgain')}
                  </Button>
                </>
              )}

              {scanState === 'error' && (
                <>
                  <Button variant="primary" fullWidth onClick={handleScanAgain}>
                    {t('onboarding.scan.tryAgain')}
                  </Button>
                  <Button variant="tertiary" fullWidth onClick={handleManualEntry}>
                    {t('onboarding.scan.enterManually')}
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Page>
  )
}
