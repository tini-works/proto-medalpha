import { useState } from 'react'
import { Header, Page, TabBar, HistoryCard, EmptyState } from '../../components'
import { Select } from '../../components/forms'
import { useHistory, useProfile } from '../../state'
import type { HistoryItemType } from '../../types'

export default function HistoryScreen() {
  const { getFilteredItems } = useHistory()
  const { profile } = useProfile()

  const [filters, setFilters] = useState({
    type: 'all' as HistoryItemType | 'all',
    familyMemberId: 'all',
  })

  const filteredItems = getFilteredItems(filters)

  const familyOptions = [
    { value: 'all', label: 'Alle Mitglieder' },
    { value: profile.id || 'self', label: `${profile.fullName} (Ich)` },
    ...profile.familyMembers.map((m) => ({ value: m.id, label: m.name })),
  ]

  return (
    <Page>
      <Header title="Verlauf" subtitle="Ihre Termine und Aktivitäten" />

      <div className="px-4 py-4">
        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Select
              label=""
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as HistoryItemType | 'all' }))}
              options={[
                { value: 'all', label: 'Alle Typen' },
                { value: 'appointment', label: 'Termine' },
                { value: 'redemption', label: 'Rezepte' },
                { value: 'purchase', label: 'Einkäufe' },
              ]}
            />
          </div>
          {profile.familyMembers.length > 0 && (
            <div className="flex-1">
              <Select
                label=""
                value={filters.familyMemberId}
                onChange={(e) => setFilters((f) => ({ ...f, familyMemberId: e.target.value }))}
                options={familyOptions}
              />
            </div>
          )}
        </div>

        {/* List */}
        {filteredItems.length === 0 ? (
          <EmptyState
            icon="history"
            title="Noch kein Verlauf"
            description="Ihre Termine, Rezepte und Einkäufe werden hier angezeigt."
          />
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </Page>
  )
}
