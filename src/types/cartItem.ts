import type { Domain } from '@/types/domain'
import type { Company } from '@/types/company'
import type { EquipementCompanyRead } from '@/types/equipementCompany'

type BaseCartItem = {
  cartItemId?: string
  productId: string
  companyId?: string
  company: Company
  startDate?: string
  endDate?: string
  quantity?: string
  unitPrice: number
}

export type CartItem =
  | ({
      type: 'domain'
      product: Domain
    } & BaseCartItem)
  | ({
      type: 'equipment'
      product: EquipementCompanyRead
    } & BaseCartItem)
