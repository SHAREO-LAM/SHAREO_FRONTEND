<template>
  <div class="space-y-6">
    <div>
      <h3 class="mb-4">Listing Type</h3>
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <Checkbox v-model="types.venue" inputId="venue" />
          <label for="venue">Venues</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="types.equipment" inputId="equipment" />
          <label for="equipment">Equipment</label>
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-4">Price Range</h3>
      <Slider v-model="priceRange" :min="0" :max="5000" :step="100" />
      <div class="flex justify-between text-sm text-gray-600">
        <span>${{ priceRange[0] }}</span>
        <span>${{ priceRange[1] }}</span>
      </div>
    </div>

    <div>
      <h3 class="mb-4">Capacity</h3>
      <div class="space-y-2">
        <div v-for="(label, key) in capacities" :key="key" class="flex items-center gap-2">
          <Checkbox v-model="selectedCapacities" :inputId="key" :value="key" />
          <Label :for="key">{{ label }}</Label>
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-4">Amenities</h3>
      <div class="space-y-2">
        <div v-for="amenity in amenities" :key="amenity" class="flex items-center gap-2">
          <Checkbox v-model="selectedAmenities" :inputId="amenity" :value="amenity" />
          <Label :for="amenity">{{ amenity }}</Label>
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-4">Availability</h3>
      <div class="flex items-center gap-2">
        <Checkbox v-model="availableOnly" inputId="available" />
        <Label for="available">Show available only</Label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Checkbox from 'primevue/checkbox';
import Slider from 'primevue/slider';

export default defineComponent({
  name: 'FilterPanel',
  components: {
    Checkbox,
    Slider,
  },
  data() {
    return {
      types: { venue: true, equipment: true },
      priceRange: [0, 5000],
      capacities: {
        cap1: '0-50 guests',
        cap2: '50-100 guests',
        cap3: '100-200 guests',
        cap4: '200-500 guests',
        cap5: '500+ guests',
      },
      selectedCapacities: [] as string[],
      amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'],
      selectedAmenities: [] as string[],
      availableOnly: false,
    };
  },
});
</script>
