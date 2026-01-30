import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconShare2,
  IconBuilding,
  IconShieldCheck,
  IconPill,
  IconTestPipe,
  IconToggleRight,
  IconToggleLeft,
} from '@tabler/icons-react'
import { Header, Page } from '../../../components'
import { Button } from '../../../components/ui'
import type { ThirdPartyAccess, ThirdPartyType } from '../../../types/legal'

// Mock data for third-party access
const MOCK_PARTNERS: ThirdPartyAccess[] = [
  {
    id: 'charite',
    name: 'Charité - Universitätsmedizin Berlin',
    type: 'clinic',
    accessGranted: true,
    grantedAt: '2025-11-15T10:30:00Z',
    dataCategories: ['appointments', 'profile'],
  },
  {
    id: 'tk',
    name: 'Techniker Krankenkasse',
    type: 'insurance',
    accessGranted: true,
    grantedAt: '2025-10-01T14:00:00Z',
    dataCategories: ['appointments', 'prescriptions', 'insurance'],
  },
  {
    id: 'docmorris',
    name: 'DocMorris Apotheke',
    type: 'pharmacy',
    accessGranted: false,
    revokedAt: '2026-01-10T09:00:00Z',
    dataCategories: ['prescriptions'],
  },
]

const TYPE_ICONS: Record<ThirdPartyType, typeof IconBuilding> = {
  clinic: IconBuilding,
  insurance: IconShieldCheck,
  pharmacy: IconPill,
  lab: IconTestPipe,
}

/**
 * Data Sharing screen - GDPR Art. 13-14 compliance.
 * Shows which third parties have access to user data.
 */
export default function DataSharingScreen() {
  const { t } = useTranslation('legal')
  const [partners, setPartners] = useState<ThirdPartyAccess[]>(MOCK_PARTNERS)
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null)

  const handleToggleAccess = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId)
    if (partner?.accessGranted) {
      setConfirmRevoke(partnerId)
    } else {
      // Grant access
      setPartners(prev => prev.map(p =>
        p.id === partnerId
          ? { ...p, accessGranted: true, grantedAt: new Date().toISOString(), revokedAt: undefined }
          : p
      ))
    }
  }

  const handleConfirmRevoke = () => {
    if (confirmRevoke) {
      setPartners(prev => prev.map(p =>
        p.id === confirmRevoke
          ? { ...p, accessGranted: false, revokedAt: new Date().toISOString() }
          : p
      ))
      setConfirmRevoke(null)
    }
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const partnerToRevoke = partners.find(p => p.id === confirmRevoke)

  // Group partners by type
  const grouped = partners.reduce((acc, partner) => {
    if (!acc[partner.type]) acc[partner.type] = []
    acc[partner.type].push(partner)
    return acc
  }, {} as Record<ThirdPartyType, ThirdPartyAccess[]>)

  return (
    <Page safeBottom={false}>
      <Header title={t('sharing.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
            <IconShare2 size={24} className="text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">{t('sharing.subtitle')}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600">{t('sharing.description')}</p>

        {/* Partner groups */}
        {(Object.keys(grouped) as ThirdPartyType[]).map(type => {
          const TypeIcon = TYPE_ICONS[type]
          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <TypeIcon size={16} className="text-teal-600" />
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t(`sharing.categories.${type}`)}
                </h3>
              </div>

              <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
                {grouped[type].map(partner => (
                  <div key={partner.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-charcoal-500">{partner.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {partner.accessGranted
                            ? t('sharing.access.since', { date: formatDate(partner.grantedAt!) })
                            : t('sharing.access.revoked')
                          }
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {t('sharing.access.dataTypes', {
                            types: partner.dataCategories.join(', ')
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleAccess(partner.id)}
                        className="flex-shrink-0 ml-3"
                        aria-label={partner.accessGranted ? 'Revoke access' : 'Grant access'}
                      >
                        {partner.accessGranted ? (
                          <IconToggleRight size={32} className="text-teal-600" />
                        ) : (
                          <IconToggleLeft size={32} className="text-slate-300" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {partners.length === 0 && (
          <div className="text-center py-8">
            <IconShare2 size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">{t('sharing.noPartners')}</p>
          </div>
        )}
      </div>

      {/* Revoke confirmation modal */}
      {confirmRevoke && partnerToRevoke && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-t-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-charcoal-500">
              {t('sharing.revoke.title')}
            </h3>
            <p className="text-sm text-slate-600">
              {t('sharing.revoke.confirm', { partner: partnerToRevoke.name })}
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
              {t('sharing.revoke.warning')}
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="destructive"
                fullWidth
                onClick={handleConfirmRevoke}
              >
                {t('sharing.revoke.button')}
              </Button>
              <Button
                variant="tertiary"
                fullWidth
                onClick={() => setConfirmRevoke(null)}
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
