export type CartItem = {
  productId: string
  companyId?: string
  type: 'domain' | 'equipment'
  startDate?: string
  endDate?: string
  quantity?: string
  unitPrice: number
}
