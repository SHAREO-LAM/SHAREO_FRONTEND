<template>
  <Card :class="cardClass" @click="onNavigate('listing')">
    <template #content>
      <div v-if="viewMode === 'list'" class="flex flex-col sm:flex-row">
        <img :src="listing.image" class="h-48 w-full rounded-xl object-cover sm:h-auto sm:w-64" />
        <div class="p-4 flex-1">
          <h3 class="theme-text-strong text-lg font-semibold">{{ listing.name }}</h3>
          <p class="theme-text-soft text-sm">{{ listing.location }}</p>
          <p v-if="listing.capacity" class="theme-text-soft mt-2 text-sm">Jusqu'à {{ listing.capacity }} personnes</p>
          <p class="mt-3 text-lg font-bold" style="color: #5d7c31;">{{ listing.price }} EUR<span class="theme-text-soft text-sm font-medium"> / jour</span></p>
        </div>
      </div>

      <div v-else class="relative">
        <img :src="listing.image" class="h-44 w-full rounded-xl object-cover" />
        <div class="p-4">
          <p class="mb-1 text-xs font-semibold uppercase tracking-[0.18em]" style="color: #8b5e3c;">{{ listing.type }}</p>
          <h3 class="theme-text-strong text-lg font-semibold">{{ listing.name }}</h3>
          <p class="theme-text-soft text-sm">{{ listing.location }}</p>
          <p class="theme-text-strong mt-3 text-lg font-bold">{{ listing.price }} EUR<span class="theme-text-soft text-sm font-medium"> / jour</span></p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import Card from 'primevue/card';

interface Listing {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
  location: string;
  capacity?: number;
}

export default defineComponent({
  name: 'ListingCard',
  components: {
    Card,
  },
  props: {
    listing: {
      type: Object as PropType<Listing>,
      required: true,
    },
    viewMode: {
      type: String as PropType<'grid' | 'list'>,
      required: true,
    },
    onNavigate: {
      type: Function as PropType<(page: string) => void>,
      required: true,
    },
  },
  computed: {
    cardClass(): string {
      return this.viewMode === 'grid'
        ? 'cursor-pointer border-none transition hover:-translate-y-1 hover:shadow-xl'
        : 'mb-4 cursor-pointer border-none transition hover:-translate-y-0.5 hover:shadow-xl';
    },
  },
});
</script>
