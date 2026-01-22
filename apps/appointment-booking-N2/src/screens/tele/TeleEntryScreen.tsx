import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Header, Page, PrimaryButton, SecondaryButton, TabBar } from '../../components'
import { useAppState } from '../../state/AppState'

export default function TeleEntryScreen() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [specialty, setSpecialty] = useState<'General' | 'Dermatology' | 'Nutrition' | 'Sports'>('General')
  const [patientId, setPatientId] = useState<'self' | string>('self')

  const patients = useMemo(() => {
    const family = state.profile.familyMembers.map((m) => ({ id: m.id, label: m.name }))
    return [{ id: 'self', label: 'Me' } as const, ...family]
  }, [state.profile.familyMembers])

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Telemedicine" subtitle="Video consult" backTo="/home" />

        <Card tone="mint">
          <div className="h2">Start</div>
          <div className="label" style={{ marginTop: 6 }}>
            Choose a specialty and a person.
          </div>
        </Card>

        <Card>
          <div className="h2">Specialty</div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            {(['General', 'Dermatology', 'Nutrition', 'Sports'] as const).map((s) => (
              <SecondaryButton key={s} onClick={() => setSpecialty(s)} disabled={s === specialty}>
                {s}
              </SecondaryButton>
            ))}
          </div>
        </Card>

        <Card>
          <div className="h2">Person</div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            {patients.map((p) => (
              <SecondaryButton key={p.id} onClick={() => setPatientId(p.id)} disabled={p.id === patientId}>
                {p.label}
              </SecondaryButton>
            ))}
          </div>
          <div className="label" style={{ marginTop: 10 }}>
            Note: Minors require consent. This is not enforced in the prototype.
          </div>
        </Card>

        <div style={{ marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            onClick={() => navigate('/tele/symptoms', { state: { specialty, patientId } })}
          >
            Continue
          </PrimaryButton>
        </div>
      </div>

      <TabBar active="tele" />
    </Page>
  )
}
