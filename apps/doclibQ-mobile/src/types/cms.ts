import type { InsuranceType } from './user'

export type CMSContentType = 'deal' | 'health-tip' | 'payback' | 'announcement'

export interface CMSContent {
  id: string
  type: CMSContentType
  title: string
  description: string
  imageUrl?: string
  link?: string
  priority: number
  targetInsurance?: InsuranceType[]
  validFrom: string
  validTo: string
}
