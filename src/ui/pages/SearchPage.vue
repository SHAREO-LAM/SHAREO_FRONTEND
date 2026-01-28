<template>
  <!-- <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl mb-2">Search Results</h1>
      <p class="text-gray-600">{{ listings.length }} venues and equipment found</p>

      <SortAndView v-model:viewMode="viewMode" />

      <div class="flex gap-8">
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="bg-white rounded-lg p-6 sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        <div class="flex-1">
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <ListingCard
              v-for="listing in listings"
              :key="listing.id"
              :listing="listing"
              :viewMode="viewMode"
              :onNavigate="onNavigate"
            />
          </div>
          <div v-else class="space-y-4">
            <ListingCard
              v-for="listing in listings"
              :key="listing.id"
              :listing="listing"
              :viewMode="viewMode"
              :onNavigate="onNavigate"
            />
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ListingCard from '../components/ListingCard.vue';
import FilterPanel from '../components/FilterPanel.vue';
import SortAndView from '../components/SortAndView.vue';

export default defineComponent({
  name: 'SearchPage',
  components: {
    ListingCard,
    FilterPanel,
    SortAndView,
  },
  props: {
    onNavigate: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      viewMode: 'grid' as 'grid' | 'list',
      listings: [
        {
          id: 1,
          name: 'Grand Ballroom Downtown',
          type: 'Venue',
          image: 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=800',
          price: 2500,
          capacity: 300,
          location: 'New York, NY',
          rating: 4.9,
          reviews: 128,
          available: true,
          amenities: ['WiFi', 'Parking', 'Catering'],
        },
      ],
    };
  },
});
</script>
