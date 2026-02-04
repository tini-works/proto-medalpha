import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCircleCheckFilled, IconCalendarEvent, IconShieldCheck } from '@tabler/icons-react'
import { Page } from '../../components'
import { Button } from '../../components/ui'
import { PATHS } from '../../routes'

export default function VerificationSuccessScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)

  // Animate content in after checkmark
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    navigate(PATHS.HOME, { replace: true })
  }

  const benefits = [
    {
      icon: IconCalendarEvent,
      label: t('onboarding.success.benefit1'),
    },
    {
      icon: IconShieldCheck,
      label: t('onboarding.success.benefit3'),
    },
  ]

  return (
    <Page safeBottom={false}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Success checkmark with animation */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center animate-scale-in">
            <IconCircleCheckFilled size={56} className="text-teal-500" />
          </div>
          {/* Confetti dots animation */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="absolute -top-1 -left-3 w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="absolute -bottom-1 -right-3 w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-charcoal-500 text-center mb-2">
          {t('onboarding.success.title')}
        </h1>

        <p className="text-sm text-slate-500 text-center mb-8 max-w-xs">
          {t('onboarding.success.description')}
        </p>

        {/* Benefits list */}
        <div
          className={`w-full max-w-sm space-y-3 transition-all duration-500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide text-center mb-4">
            {t('onboarding.success.unlocked')}
          </p>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-cream-100 rounded-lg border border-cream-300"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <benefit.icon size={20} className="text-teal-600" />
              </div>
              <span className="text-sm font-medium text-charcoal-500">{benefit.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <Button variant="primary" fullWidth onClick={handleContinue}>
          {t('onboarding.success.continue')}
        </Button>
      </div>
    </Page>
  )
}
