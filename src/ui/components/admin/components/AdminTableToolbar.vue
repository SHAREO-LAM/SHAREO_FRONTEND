<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <InputText
      :model-value="searchValue"
      :placeholder="searchPlaceholder"
      class="w-full md:max-w-[28rem]"
      @update:model-value="onSearchUpdate"
    />
    <div class="flex w-full gap-2 md:w-auto">
      <Dropdown
        v-if="filterOptions.length > 0"
        :model-value="filterValue"
        :options="filterOptions"
        option-label="label"
        option-value="value"
        :placeholder="filterPlaceholder"
        class="w-full md:w-56"
        @update:model-value="onFilterUpdate"
      />
      <Button label="Reset" severity="secondary" outlined @click="$emit('reset')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

export interface AdminFilterOption {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    searchValue: string
    filterValue?: string
    searchPlaceholder?: string
    filterPlaceholder?: string
    filterOptions?: AdminFilterOption[]
  }>(),
  {
    filterValue: 'all',
    searchPlaceholder: 'Rechercher',
    filterPlaceholder: 'Filtre',
    filterOptions: () => [],
  },
)

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:filterValue': [value: string]
  reset: []
}>()

const onSearchUpdate = (value: string | undefined) => {
  emit('update:searchValue', value ?? '')
}

const onFilterUpdate = (value: string | undefined) => {
  emit('update:filterValue', value ?? 'all')
}
</script>
