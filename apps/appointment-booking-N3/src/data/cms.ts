import type { CMSContent } from '../types'

export const cmsContent: CMSContent[] = [
  {
    id: 'cms1',
    type: 'deal',
    title: 'Health Check Special',
    description: '20% off comprehensive health screening this month at participating dm stores.',
    priority: 1,
    validFrom: '2026-01-01',
    validTo: '2026-01-31',
  },
  {
    id: 'cms2',
    type: 'health-tip',
    title: 'Winter Wellness Tips',
    description: 'Stay healthy during cold weather with these expert recommendations for immune support.',
    priority: 2,
    validFrom: '2026-01-01',
    validTo: '2026-03-31',
  },
  {
    id: 'cms3',
    type: 'payback',
    title: 'Double PAYBACK Points',
    description: 'Earn 2x PAYBACK points on all health products this week at dm stores.',
    priority: 1,
    validFrom: '2026-01-20',
    validTo: '2026-01-27',
    targetInsurance: ['GKV'],
  },
  {
    id: 'cms4',
    type: 'announcement',
    title: 'New Telemedicine Service',
    description: 'Connect with doctors 24/7 for guidance and booking support. Now available for all GKV members.',
    priority: 3,
    validFrom: '2026-01-15',
    validTo: '2026-02-28',
    targetInsurance: ['GKV'],
  },
  {
    id: 'cms5',
    type: 'deal',
    title: 'Free Skin Analysis',
    description: 'Book a complimentary skin analysis at any dm beauty counter. Limited appointments available.',
    priority: 2,
    validFrom: '2026-01-01',
    validTo: '2026-02-14',
  },
  {
    id: 'cms6',
    type: 'health-tip',
    title: 'Managing Stress',
    description: 'Learn effective techniques for managing daily stress and improving your mental well-being.',
    priority: 4,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
  },
]

export function getActiveCMSContent(insuranceType?: 'GKV' | 'PKV' | ''): CMSContent[] {
  const today = new Date().toISOString().split('T')[0]

  return cmsContent
    .filter((content) => {
      // Check date validity
      if (content.validFrom > today || content.validTo < today) {
        return false
      }
      // Check insurance targeting
      if (content.targetInsurance && insuranceType && !content.targetInsurance.includes(insuranceType)) {
        return false
      }
      return true
    })
    .sort((a, b) => a.priority - b.priority)
}
