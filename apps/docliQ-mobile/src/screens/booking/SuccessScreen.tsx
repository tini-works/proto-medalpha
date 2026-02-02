import { Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check } from 'tabler-icons-react'
import { Page, StickyActionBar } from '../../components'
import { PATHS, appointmentDetailPath } from '../../routes'
import type { Appointment } from '../../types'

export default function SuccessScreen() {
  const { t } = useTranslation('booking')
  const location = useLocation()
  const state = location.state as { confirmationNumber?: string; appointment?: Appointment } | undefined
  const appointment = state?.appointment

  // Standardize confirmed view: redirect to canonical Appointment Details screen.
  if (appointment) {
    return <Navigate to={appointmentDetailPath(appointment.id)} replace />
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col px-6 py-10 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <Check size="32" stroke="3" className="text-white" />
        </div>

        <h1 className="text-xl font-semibold text-charcoal-500">{t('appointmentConfirmed')}</h1>
        <p className="text-sm text-slate-500 mt-2">{t('noAppointmentDataFound')}</p>

      <div className="h-24" />
      </div>

      <StickyActionBar containerClassName="px-6">
        <div className="space-y-3">
          <Link to={PATHS.HISTORY} className="btn btn-primary btn-block text-center block">
            {t('viewAppointments')}
          </Link>
          <Link to={PATHS.HOME} className="btn btn-tertiary btn-block text-center block">
            {t('backToHome')}
          </Link>
        </div>
      </StickyActionBar>
    </Page>
  )
}
