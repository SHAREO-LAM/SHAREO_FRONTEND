<template>
  <div class="flex items-center justify-between mb-6 gap-4">
    <div class="flex items-center gap-3">
      <Select v-model="sortBy" :options="sortOptions" placeholder="Sort by" class="w-48" />
    </div>
    <div class="flex items-center gap-2">
      <Button :class="viewMode === 'grid' ? 'p-button-primary' : ''" icon="pi pi-th-large" @click="$emit('update:viewMode','grid')" />
      <Button :class="viewMode === 'list' ? 'p-button-primary' : ''" icon="pi pi-bars" @click="$emit('update:viewMode','list')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';
import Button from 'primevue/button';
import Select from 'primevue/dropdown';

const props = defineProps<{
  viewMode: 'grid' | 'list';
}>();

const emit = defineEmits<{
  (e: 'update:viewMode', mode: 'grid' | 'list'): void;
}>();

const sortBy = ref('recommended');
const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Largest Capacity', value: 'capacity' }
];
</script>
