import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, PrimaryButton, TabBar } from '../../components'

type EntryState = { specialty: string; patientId: string }

export default function TeleSymptomsScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const entry = (location.state || { specialty: 'General', patientId: 'self' }) as EntryState
  const [text, setText] = useState('')
  const canContinue = useMemo(() => text.trim().length >= 10, [text])

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Telemedicine" subtitle="Symptoms" backTo="/tele/entry" />

        <Card>
          <div className="h2">Short description</div>
          <div className="label" style={{ marginTop: 6 }}>
            Specialty: {entry.specialty}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Please describe your symptoms in a few sentences."
            style={{
              width: '100%',
              minHeight: 140,
              marginTop: 'var(--space-4)',
              resize: 'vertical',
              border: 'var(--border)',
              borderRadius: 14,
              padding: '12px 14px',
              background: 'var(--neutral-0)',
              color: 'var(--neutral-800)',
            }}
          />
          <div className="label" style={{ marginTop: 10 }}>
            Note: The prototype does not provide medical advice.
          </div>
        </Card>

        <div style={{ marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            disabled={!canContinue}
            onClick={() => navigate('/tele/webview', { state: { ...entry, symptoms: text.trim() } })}
          >
            Start video consult
          </PrimaryButton>
        </div>
      </div>

      <TabBar active="tele" />
    </Page>
  )
}
