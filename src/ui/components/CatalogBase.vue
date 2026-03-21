<template>
  <div class="catalog-page page-wrap">
    <div class="glass-panel p-5 md:p-7">
      <div class="mb-8">
        <h1 class="section-title mb-4">{{ title }}</h1>
        <div class="mb-4 flex flex-col gap-3 md:flex-row">
          <IconField iconPosition="left" class="flex-1">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="searchQuery" :placeholder="searchPlaceholder" class="w-full" @input="handleSearch" />
          </IconField>
          <Button label="Rechercher" icon="pi pi-search" @click="handleSearch" />
        </div>
        <Button
          :label="sortBy === 'price' ? (sortOrder === 'asc' ? 'Prix croissant' : 'Prix décroissant') : 'Trier par prix'"
          :icon="sortBy === 'price' ? (sortOrder === 'asc' ? 'pi pi-sort-amount-up-alt' : 'pi pi-sort-amount-down') : 'pi pi-sort-alt'"
          severity="secondary" outlined @click="togglePriceSort" />
      </div>

      <div class="flex gap-8">
        <aside class="hidden lg:block w-64 shrink-0">
          <div class="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow">
            <h3 class="text-xl font-semibold mb-4">Filtres</h3>

            <div class="space-y-6">
              <template v-for="f in filterConfig" :key="filterKey(f)">
                <div v-if="f.kind === 'text'">
                  <h4 class="font-medium mb-3">{{ f.label }}</h4>
                  <InputText v-model="filtersTextDraft[f.stateKey]" :placeholder="f.placeholder" class="w-full" />
                </div>

                <div v-else>
                  <h4 class="font-medium mb-3">{{ f.label }}</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <InputNumber v-model="filtersNumberDraft[f.minKey]" :placeholder="f.minPlaceholder ?? 'Min'"
                      class="w-full" inputClass="w-full" :min="f.minValue" />
                    <InputNumber v-model="filtersNumberDraft[f.maxKey]" :placeholder="f.maxPlaceholder ?? 'Max'"
                      class="w-full" inputClass="w-full" :min="f.minValue" />
                  </div>
                </div>

              </template>

              <h4 class="font-medium mb-3">Disponibilité</h4>
              <div>

                <div class="space-y-2">
                  <InputText v-model="startDate" type="date" class="w-full" />

                  <InputText v-model="endDate" type="date" class="w-full" />
                </div>
              </div>
              <Button label="Valider" class="w-full" @click="applyFilters" />

              <Button label="Réinitialiser les filtres" severity="secondary" outlined class="w-full"
                @click="resetFilters" />
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <ProgressSpinner />
          </div>

          <div v-else-if="error" class="text-center py-12">
            <Message severity="error" :closable="false">{{ error }}</Message>
            <Button label="Réessayer" class="mt-4" @click="loadData" />
          </div>

          <div v-else-if="filteredItems.length === 0" class="py-12 text-center">
            <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-600 text-lg">Aucun résultat trouvé</p>
            <p class="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
          </div>

          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card v-for="item in filteredItems" :key="item.id" class="cursor-pointer overflow-hidden transition hover:-translate-y-0.5"
              @click="handleNavigateToDetail(item)">
              <template #header>
                <img :src="(item.image as string) || getDefaultImage()" :alt="(item.name as string)"
                  class="w-full h-48 object-cover" />
              </template>
              <template #title>
                <span class="text-lg">{{ item.name }}</span>
              </template>
              <template #subtitle>
                <p class="text-sm text-gray-600 mb-2">{{ item.description || 'Aucune description' }}</p>
                <div class="flex items-center justify-between mt-3">
                  <div class="flex flex-col gap-1">
                    <slot name="itemMeta" :item="item" :view="viewMode" />
                  </div>
                  <div v-if="typeof item.pricePerDay === 'number'" class="font-semibold text-lg text-primary">
                    {{ item.pricePerDay }}€<span class="text-sm font-normal text-gray-600">/jour</span>
                  </div>
                </div>
              </template>
              <template #footer>
                <Button label="Voir les détails" icon="pi pi-arrow-right" iconPos="right" text class="w-full"
                  @click.stop="handleNavigateToDetail(item)" />
              </template>
            </Card>
          </div>

          <div v-else class="space-y-4">
            <Card v-for="item in filteredItems" :key="item.id" class="cursor-pointer overflow-hidden transition hover:shadow-xl"
              @click="handleNavigateToDetail(item)">
              <template #content>
                <div class="flex flex-col sm:flex-row gap-4">
                  <img :src="(item.image as string) || getDefaultImage()" :alt="(item.name as string)"
                    class="w-full sm:w-48 h-32 object-cover" />
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold mb-2">{{ item.name }}</h3>
                    <p class="text-gray-600 mb-3">{{ item.description || 'Aucune description' }}</p>
                    <div class="flex items-center gap-4">
                      <slot name="itemMeta" :item="item" :view="viewMode" />
                      <div v-if="typeof item.pricePerDay === 'number'" class="font-semibold text-lg text-primary">
                        {{ item.pricePerDay }}€<span class="text-sm font-normal text-gray-600">/jour</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex sm:flex-col justify-end items-center gap-2">
                    <Button label="Voir" icon="pi pi-arrow-right" @click.stop="handleNavigateToDetail(item)" />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import type { CatalogBaseItem, CatalogDetailType, FilterConfig } from './catalogTypes'

type TextFilters = Record<string, string>
type NumberFilters = Record<string, number | null>

export default defineComponent({
  name: 'CatalogBase',
  components: {
    Message,
    ProgressSpinner,
    IconField,
    InputIcon,
  },
  props: {
    title: { type: String, required: true },
    searchPlaceholder: { type: String, required: true },
    detailType: { type: String as PropType<CatalogDetailType>, required: true },
    filterConfig: { type: Array as PropType<FilterConfig[]>, default: () => [] },
    fetchItems: { type: Function as PropType<() => Promise<CatalogBaseItem[]>>, required: true },
  },
  data() {
    const buildDefaults = (config: FilterConfig[]) => {
      const text: TextFilters = {}
      const number: NumberFilters = {}

      for (const cfg of config) {
        if (cfg.kind === 'text') {
          text[cfg.stateKey] = ''
        } else {
          number[cfg.minKey] = null
          number[cfg.maxKey] = null
        }
      }

      return { text, number }
    }

    const defaults = buildDefaults(this.$props.filterConfig ?? [])
    return {
      viewMode: 'grid' as 'grid' | 'list',
      searchQuery: '',
      isLoading: false,
      error: null as string | null,
      items: [] as CatalogBaseItem[],
      filtersText: defaults.text as TextFilters,
      filtersTextDraft: { ...defaults.text } as TextFilters,
      filtersNumber: defaults.number as NumberFilters,
      filtersNumberDraft: { ...defaults.number } as NumberFilters,
      sortBy: 'name' as 'name' | 'price',
      sortOrder: 'asc' as 'asc' | 'desc',
      startDate: '' as string,
      endDate: '' as string,
    }
  },
  computed: {
    filteredItems(): CatalogBaseItem[] {
      let items = this.items

      const q = this.searchQuery.toLowerCase().trim()
      if (q) {
        items = items.filter((item) => {
          const name = String(item.name ?? '').toLowerCase()
          const desc = String(item.description ?? '').toLowerCase()
          return name.includes(q) || desc.includes(q)
        })
      }

      for (const cfg of this.filterConfig) {
        if (cfg.kind === 'text') {
          const value = String(this.filtersText[cfg.stateKey] ?? '').trim().toLowerCase()
          if (!value) continue
          items = items.filter((item) => String(item[cfg.itemKey] ?? '').toLowerCase().includes(value))
          continue
        }

        const min = this.filtersNumber[cfg.minKey]
        const max = this.filtersNumber[cfg.maxKey]

        if (typeof min === 'number') {
          items = items.filter((item) => typeof item[cfg.itemKey] === 'number' && (item[cfg.itemKey] as number) >= min)
        }
        if (typeof max === 'number') {
          items = items.filter((item) => typeof item[cfg.itemKey] === 'number' && (item[cfg.itemKey] as number) <= max)
        }
      }
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate)
        const end = new Date(this.endDate)

        items = items.filter((item) => {
          if (!item.availableFrom || !item.availableTo) return true

          const from = new Date(item.availableFrom)
          const to = new Date(item.availableTo)

          return from <= start && to >= end
        })
      }


      return this.sortItems(items)
    },
  },
  mounted() {
    const query = this.$route.query

    if (typeof query.q === "string") {
      this.searchQuery = query.q
    }

    if (typeof query.location === "string") {
      this.filtersTextDraft["city"] = query.location
      this.filtersText["city"] = query.location
    }

    if (typeof query.startDate === "string") {
      this.startDate = query.startDate
    }

    if (typeof query.endDate === "string") {
      this.endDate = query.endDate
    }
    this.loadData()
  },
  methods: {
    filterKey(f: FilterConfig) {
      if (f.kind === 'text') return `text:${f.stateKey}`
      return `range:${f.minKey}:${f.maxKey}`
    },
    getDefaultFiltersFromConfig(config: FilterConfig[]) {
      const text: TextFilters = {}
      const number: NumberFilters = {}

      for (const cfg of config) {
        if (cfg.kind === 'text') {
          text[cfg.stateKey] = ''
        } else {
          number[cfg.minKey] = null
          number[cfg.maxKey] = null
        }
      }

      return { text, number }
    },
    compareByName(a: CatalogBaseItem, b: CatalogBaseItem) {
      return String(a.name ?? '').localeCompare(String(b.name ?? ''))
    },
    compareByPrice(a: CatalogBaseItem, b: CatalogBaseItem) {
      const aPrice = typeof a.pricePerDay === 'number' ? a.pricePerDay : null
      const bPrice = typeof b.pricePerDay === 'number' ? b.pricePerDay : null

      if (aPrice !== null && bPrice !== null) {
        const diff = aPrice - bPrice
        if (diff !== 0) return this.sortOrder === 'asc' ? diff : -diff
        return this.compareByName(a, b)
      }

      if (aPrice !== null && bPrice === null) return -1
      if (aPrice === null && bPrice !== null) return 1

      return this.compareByName(a, b)
    },
    sortItems(items: CatalogBaseItem[]) {
      const sorted = [...items]
      sorted.sort((a, b) => (this.sortBy === 'price' ? this.compareByPrice(a, b) : this.compareByName(a, b)))
      return sorted
    },
    async loadData() {
      this.isLoading = true
      this.error = null

      try {
        this.items = await this.fetchItems()
      } catch (err) {
        this.error = 'Erreur lors du chargement des données. Veuillez réessayer.'
        console.error('Erreur de chargement:', err)
      } finally {
        this.isLoading = false
      }
    },
    handleSearch() { },
    togglePriceSort() {
      if (this.sortBy !== 'price') {
        this.sortBy = 'price'
        this.sortOrder = 'asc'
        return
      }
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    },
    applyFilters() {
      this.filtersText = { ...this.filtersTextDraft }
      this.filtersNumber = { ...this.filtersNumberDraft }
    },
    resetFilters() {
      const defaults = this.getDefaultFiltersFromConfig(this.filterConfig)
      this.filtersText = defaults.text
      this.filtersTextDraft = { ...defaults.text }
      this.filtersNumber = defaults.number
      this.filtersNumberDraft = { ...defaults.number }
      this.searchQuery = ''
      this.sortBy = 'name'
      this.sortOrder = 'asc'
    },
    getDefaultImage() {
      return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    },
    handleNavigateToDetail(item: CatalogBaseItem) {
      this.$router.push({
        path: `/productDetails/${item.id}`,
        query: { type: this.detailType },
      })
    },
  },
})
</script>

<style scoped lang="scss">
.catalog-page {
  min-height: calc(100vh - 6rem);
}
</style>
