<template>
  <CatalogBase title="Tous les équipements" searchPlaceholder="Rechercher un équipement..." detailType="equipment"
    :filterConfig="filterConfig" :fetchItems="fetchItems">
    <template #itemMeta="{ item, view }">
      <div v-if="typeof item.stock === 'number'" class="flex items-center gap-1 text-sm"
        :class="view === 'grid' ? 'text-gray-300' : 'text-gray-600'">
        <i class="pi pi-box"></i>
        <span>Stock : {{ item.stock }}</span>
      </div>
    </template>
  </CatalogBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CatalogBase from '@/ui/components/CatalogBase.vue'
import type { CatalogBaseItem, FilterConfig } from '@/ui/components/catalogTypes'
import { getEquipementsCompany } from '@/services/equipementCompany'
import type { EquipementCompanyReadDto } from '@/types/equipementCompany'

export default defineComponent({
  name: 'EquipmentsCatalogPage',
  components: {
    CatalogBase,
  },
  data() {
    return {
      filterConfig: [
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
          label: 'Stock',
          itemKey: 'stock',
          minKey: 'stockMin',
          maxKey: 'stockMax',
          minValue: 0,
        },
         {
          kind: "text",
          label: "Localisation",
          placeholder: "Ex: Paris",
          itemKey: "city",
          stateKey: "city",
        },
      ] as FilterConfig[],
    }
  },
  methods: {
    async fetchItems(): Promise<CatalogBaseItem[]> {
      const equipements = await getEquipementsCompany()

      type EquipementCompanyLike = EquipementCompanyReadDto

      return (equipements as EquipementCompanyLike[]).map((equipement) => {
        const imageFromArray = Array.isArray(equipement.imageUrls)
          ? equipement.imageUrls.find((url) => Boolean(url))
          : undefined
        const image = imageFromArray || equipement.imageUrl || undefined

        let stockNumber: number | undefined
        if (typeof equipement.stock === 'number') {
          stockNumber = equipement.stock
        } else if (typeof equipement.stock === 'string') {
          stockNumber = Number.parseInt(equipement.stock, 10)
        }

        const stock = Number.isFinite(stockNumber as number) ? (stockNumber as number) : undefined

        return {
          id: equipement.equipementCompanyId ?? '',
          name: equipement.displayName ?? '',
          description: equipement.description ?? undefined,
          image,
          pricePerDay: equipement.pricePerDay ?? undefined,
          stock,
        }
      })
    },
  },
})
</script>
