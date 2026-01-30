export type HistoryItemType = 'appointment' | 'redemption' | 'purchase'
export type HistoryItemStatus = 'planned' | 'completed' | 'cancelled'

export interface HistoryItem {
  id: string
  type: HistoryItemType
  title: string
  subtitle: string
  dateISO: string
  status: HistoryItemStatus
  forUserId: string
  forUserName: string
  details?: Record<string, unknown>
}

export interface HistoryFilters {
  type: HistoryItemType | 'all'
  dateFrom?: string
  dateTo?: string
  familyMemberId?: string | 'all'
}
