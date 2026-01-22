export type RxItem = {
  id: string
  name: string
  quantity: string
}

export const mockRx: { items: RxItem[]; estimatedTotalEUR: string } = {
  items: [
    { id: 'm1', name: 'Metoprolol 50 mg', quantity: '1 Packung' },
    { id: 'm2', name: 'Vitamin D3', quantity: '1 Packung' },
  ],
  estimatedTotalEUR: '12,40 €',
}

