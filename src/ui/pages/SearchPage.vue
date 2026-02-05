<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ListingCard from '../components/ListingCard.vue';
import FilterPanel from '../components/FilterPanel.vue';

export default defineComponent({
  name: 'SearchPage',
  components: {
    ListingCard,
    FilterPanel,
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
