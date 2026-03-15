<template>
  <CatalogBase title="Tous les domaines" searchPlaceholder="Rechercher un domaine..." detailType="domain"
    :filterConfig="filterConfig" :fetchItems="fetchItems">
    <template #itemMeta="{ item, view }">
      <div v-if="item.city || item.postcode" class="flex items-center gap-1 text-sm"
        :class="view === 'grid' ? 'text-gray-300' : 'text-gray-600'">
        <i class="pi pi-map-marker"></i>
        <span>{{ item.postcode ? `${item.postcode} ` : '' }}{{ item.city ?? '' }}</span>
      </div>
      <div v-if="typeof item.capacity === 'number'" class="flex items-center gap-1 text-sm"
        :class="view === 'grid' ? 'text-gray-300' : 'text-gray-600'">
        <i class="pi pi-users"></i>
        <span>Capacité : {{ item.capacity }}</span>
      </div>
    </template>
  </CatalogBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CatalogBase from '@/ui/components/CatalogBase.vue'
import type { CatalogBaseItem, FilterConfig } from '@/ui/components/catalogTypes'
import { getDomains } from '@/services/domain'
import type { UpdateDomainDto } from '@/types/domain'

export default defineComponent({
  name: 'DomainsCatalogPage',
  components: {
    CatalogBase,
  },
  data() {
    return {
      filterConfig: [
        {
          kind: 'text',
          label: 'Ville',
          placeholder: 'Ex: Paris',
          itemKey: 'city',
          stateKey: 'city',
        },
        {
          kind: 'numberRange',
          label: 'Prix / jour (€)',
          itemKey: 'pricePerDay',
          minKey: 'priceMin',
          maxKey: 'priceMax',
          minValue: 0,
        },
        {
          kind: 'numberRange',
          label: 'Capacité',
          itemKey: 'capacity',
          minKey: 'capacityMin',
          maxKey: 'capacityMax',
          minValue: 0,
        },
      ] as FilterConfig[],
    }
  },
  methods: {
    async fetchItems(): Promise<CatalogBaseItem[]> {
      const domains = await getDomains()

      type DomainLike = UpdateDomainDto & {
        domainId?: string
        id?: string
        name?: string
        description?: string
        imageUrl?: string | null
        pricePerDay?: number | null
        capacity?: string | number | null
        city?: string | null
        postcode?: string | null
      }

      return (domains as DomainLike[]).map((domain) => {
        let capacityNumber: number | undefined
        if (typeof domain.capacity === 'number') {
          capacityNumber = domain.capacity
        } else if (typeof domain.capacity === 'string') {
          capacityNumber = Number.parseInt(domain.capacity, 10)
        }

        const capacity = Number.isFinite(capacityNumber as number) ? (capacityNumber as number) : undefined

        return {
          id: domain.domainId ?? domain.id ?? '',
          name: domain.name ?? '',
          description: domain.description,
          image: domain.imageUrl ?? undefined,
          pricePerDay: domain.pricePerDay ?? undefined,
          capacity,
          city: domain.city ?? undefined,
          postcode: domain.postcode ?? undefined,
        }
      })
    },
  },
})
</script>
