import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconMail, IconCheck } from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { Button } from '../../components/ui'
import { useAppState, useProfile } from '../../state'
import { PATHS } from '../../routes'

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return email
  const firstChar = localPart[0]
  const lastChar = localPart.length > 1 ? localPart[localPart.length - 1] : ''
  return `${firstChar}***${lastChar}@${domain}`
}

export default function DeleteEmailConfirmScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('legal')
  const { profile } = useProfile()
  const { startDeletion } = useAppState()
  const [emailSent, setEmailSent] = useState(false)

  const maskedEmail = maskEmail(profile.email || 'user@example.com')

  const handleSendEmail = () => {
    setEmailSent(true)
  }

  const handleMockConfirm = () => {
    startDeletion(maskedEmail)
    navigate(PATHS.SETTINGS_PRIVACY)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('deleteEmail.title')} showBack />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-6">
          <IconMail size={40} className="text-teal-600" />
        </div>

        <h1 className="text-xl font-semibold text-charcoal-500 text-center mb-2">
          {t('deleteEmail.title')}
        </h1>

        <p className="text-sm text-slate-500 text-center mb-4">
          {t('deleteEmail.description')}
        </p>

        <div className="bg-cream-100 rounded-lg px-4 py-3 mb-4">
          <p className="font-medium text-charcoal-500 text-center">{maskedEmail}</p>
        </div>

        <p className="text-xs text-slate-400 text-center mb-8 max-w-xs">
          {t('deleteEmail.explanation')}
        </p>

        {!emailSent ? (
          <Button onClick={handleSendEmail} fullWidth>
            {t('deleteEmail.sendButton')}
          </Button>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-2 text-teal-600">
              <IconCheck size={20} />
              <span className="font-medium">{t('deleteEmail.checkInbox')}</span>
            </div>

            <button
              type="button"
              onClick={handleMockConfirm}
              className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-mono text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors"
              data-testid="mock-email-confirm"
            >
              {t('deleteEmail.mockConfirm')}
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="w-full text-center text-sm text-teal-600 hover:underline"
            >
              {t('deleteEmail.resend')}
            </button>
          </div>
        )}
      </div>
    </Page>
  )
}
