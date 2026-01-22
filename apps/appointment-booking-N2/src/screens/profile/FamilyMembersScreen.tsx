import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Field, Header, Page, PrimaryButton, SecondaryButton } from '../../components'
import { useAppState } from '../../state/AppState'

export default function FamilyMembersScreen() {
  const navigate = useNavigate()
  const { state, addFamilyMember, removeFamilyMember } = useAppState()

  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [relationship, setRelationship] = useState('')

  const canAdd = useMemo(() => name.trim().length >= 2 && dateOfBirth.trim().length >= 8 && relationship.trim().length >= 2, [
    name,
    dateOfBirth,
    relationship,
  ])

  return (
    <Page>
      <Header title="Family members" backTo="/profile/complete" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Card>
          <div className="h2">Add</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <Field label="Name" value={name} onChange={setName} placeholder="e.g. Alex Smith" />
            <Field label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} placeholder="YYYY-MM-DD" />
            <Field label="Relationship" value={relationship} onChange={setRelationship} placeholder="e.g. Child" />
            <PrimaryButton
              fullWidth
              disabled={!canAdd}
              onClick={() => {
                addFamilyMember({ name: name.trim(), dateOfBirth: dateOfBirth.trim(), relationship: relationship.trim() })
                setName('')
                setDateOfBirth('')
                setRelationship('')
              }}
            >
              Add
            </PrimaryButton>
          </div>
        </Card>

        <Card>
          <div className="h2">List</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {state.profile.familyMembers.length === 0 ? (
              <div className="label">No entries yet.</div>
            ) : (
              state.profile.familyMembers.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: '10px 12px',
                    borderRadius: 14,
                    border: 'var(--border)',
                    background: 'var(--neutral-0)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-16)', color: 'var(--neutral-800)' }}>{m.name}</div>
                    <div className="label">
                      {m.relationship} · {m.dateOfBirth}
                    </div>
                  </div>
                  <SecondaryButton onClick={() => removeFamilyMember(m.id)}>Remove</SecondaryButton>
                </div>
              ))
            )}
          </div>
        </Card>

        <SecondaryButton fullWidth onClick={() => navigate('/profile/complete')}>
          Back
        </SecondaryButton>
      </div>
    </Page>
  )
}
