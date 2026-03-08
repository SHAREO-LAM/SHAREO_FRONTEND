import type { UpdateDomainDto } from '@/types/domain'
import type { Company } from '@/types/company'
import type { EquipementCompanyReadDto } from '@/types/equipementCompany'

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
      product: UpdateDomainDto
    } & BaseCartItem)
  | ({
      type: 'equipment'
      product: EquipementCompanyReadDto
    } & BaseCartItem)
