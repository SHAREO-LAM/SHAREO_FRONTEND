import type { Domain } from '@/types/domain'
import type { EquipementCategory } from '@/types/equipementCategory'

export type Product = Domain | EquipementCategory

export function isDomain(
  product: Product
): product is Domain {
  return 'streetName' in product || 'city' in product
}

export function isEquipement(
  product: Product
): product is EquipementCategory {
  return 'equipementTypeId' in product || 'stock' in product
}
