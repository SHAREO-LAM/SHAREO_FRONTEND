<template>
  <Card :class="cardClass" @click="onNavigate('listing')">
    <template #content>
      <div v-if="viewMode === 'list'" class="flex flex-col sm:flex-row">
        <img :src="listing.image" class="w-full sm:w-64 h-48 object-cover sm:h-auto rounded" />
        <div class="p-4 flex-1">
          <h3>{{ listing.name }}</h3>
          <p class="text-gray-600">{{ listing.location }}</p>
          <p v-if="listing.capacity">Up to {{ listing.capacity }} guests</p>
          <p class="text-green-600">${{ listing.price }}/day</p>
        </div>
      </div>

      <div v-else class="relative">
        <img :src="listing.image" class="w-full h-48 object-cover rounded" />
        <div class="p-4">
          <h3>{{ listing.name }}</h3>
          <p class="text-gray-600">{{ listing.location }}</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import { defineProps } from 'vue';

interface Listing {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
  location: string;
  capacity?: number;
}

const props = defineProps<{
  listing: Listing;
  viewMode: 'grid' | 'list';
  onNavigate: (page: string) => void;
}>();

const cardClass = computed(() =>
  props.viewMode === 'grid' ? 'hover:shadow-lg transition-shadow cursor-pointer' : 'mb-4 hover:shadow-lg'
);
</script>
