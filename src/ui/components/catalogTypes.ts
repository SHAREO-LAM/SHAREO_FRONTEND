export type CatalogDetailType = 'domain' | 'equipment'

export type CatalogBaseItem = {
  id: string
  name: string
  description?: string
  image?: string
  pricePerDay?: number
  availableFrom?: string
  availableTo?: string
  // extra fields are allowed for filtering / display (city, capacity, stock, etc.)
  [key: string]: unknown
}

export type TextFilterConfig = {
  kind: 'text'
  label: string
  placeholder?: string
  itemKey: string
  stateKey: string
}

export type NumberRangeFilterConfig = {
  kind: 'numberRange'
  label: string
  itemKey: string
  minKey: string
  maxKey: string
  minPlaceholder?: string
  maxPlaceholder?: string
  minValue?: number
}

export type FilterConfig = TextFilterConfig | NumberRangeFilterConfig
