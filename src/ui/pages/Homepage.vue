<template>
  <div class="min-h-screen">
    <div class="flex flex-col gap-16">

      <!-- Hero Section -->
      <section class="bg-(--primary-color) text-(--primary-color-text) py-20 px-4 text-center">
        <div class="max-w-3xl mx-auto flex flex-col gap-6">
          <h1 class="text-4xl font-bold">Book the Perfect Venue or Equipment</h1>
          <p class="text-lg">Easily find and reserve venues and event equipment for any occasion</p>

          <div class="flex flex-col gap-4 md:flex-row md:justify-center">
            <InputText v-model:modelValue="searchQuery" placeholder="Search venues or equipment..."
              class="w-full md:w-md" />
            <Button label="Search" @click="onSearch" />
          </div>
        </div>
      </section>

      <!-- Featured Venues -->
      <section class="py-16 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-center text-3xl font-semibold mb-8">Featured Venues</h2>

          <div class="flex flex-wrap justify-center gap-6">
            <Card v-for="venue in featuredVenues" :key="venue.id" class="w-72 shrink-0 overflow-hidden">
              <template #header>
                <img :src="venue.image" :alt="venue.name" class="w-full h-48 object-cover" />
              </template>

              <div class="p-4 flex flex-col gap-1">
                <h3 class="text-lg font-medium">{{ venue.name }}</h3>
                <p class="text-(--muted-color)">{{ venue.location }}</p>
                <div class="mt-2">
                  <Badge :value="`$${venue.price}/day`" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <!-- Featured Equipment -->
      <section class="py-16 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-center text-3xl font-semibold mb-8">Featured Equipment</h2>

          <div class="flex flex-wrap justify-center gap-6">
            <Card v-for="equipment in featuredEquipment" :key="equipment.id" class="w-72 shrink-0 overflow-hidden">
              <template #header>
                <img :src="equipment.image" :alt="equipment.name" class="w-full h-48 object-cover" />
              </template>

              <div class="p-4 flex flex-col gap-1">
                <h3 class="text-lg font-medium">{{ equipment.name }}</h3>
                <p class="text-(--muted-color)">{{ equipment.type }}</p>
                <div class="mt-2">
                  <Badge :value="`$${equipment.price}/day`" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl mb-2">Pourquoi choisir VenueBook ?</h2>
            <p class="text-gray-600">
              La manière la plus simple de réserver des lieux et des équipements
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(benefit, index) in benefits" :key="index" class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <i :class="['pi', benefit.icon, 'text-2xl text-blue-600']"></i>
              </div>

              <h3 class="mb-2 font-semibold">
                {{ benefit.title }}
              </h3>

              <p class="text-gray-600">
                {{ benefit.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Appel à l’action -->
      <section class="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl mb-4">
            Prêt à inscrire votre établissement ?
          </h2>

          <p class="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Donnez de la visibilité à vos lieux et équipements et attirez de nouveaux clients dès maintenant.
          </p>

          <Button size="large" class="bg-white text-orange-600 hover:bg-gray-100 border-none" @click="goToVendorDashboard">
            Devenir vendeur
          </Button>
        </div>
      </section>


    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { ROUTES } from '../../constants/const';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Badge from 'primevue/badge';

interface Venue {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
}

interface Equipment {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
}

export default defineComponent({
  name: 'HomePage',
  components: {
    InputText,
    Card,
    Badge,
  },
  data() {
    return {
      searchQuery: '',
      featuredVenues: [
        {
          id: 1,
          name: 'Grand Ballroom',
          location: 'New York',
          price: 2500,
          image: 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=400',
        },
        {
          id: 2,
          name: 'Conference Hall',
          location: 'Los Angeles',
          price: 1800,
          image: 'https://images.unsplash.com/photo-1603430416744-a47cee46b0ae?w=400',
        },
        {
          id: 3,
          name: 'Garden Event Space',
          location: 'Chicago',
          price: 2000,
          image: 'https://images.unsplash.com/photo-1760972594010-e217e2f2845c?w=400',
        },
      ] as Venue[],
      featuredEquipment: [
        {
          id: 1,
          name: 'Professional Audio System',
          type: 'Audio',
          price: 350,
          image: 'https://images.unsplash.com/photo-1745848413083-cfea604edb6a?w=400',
        },
        {
          id: 2,
          name: 'Lighting Package',
          type: 'Lighting',
          price: 200,
          image: 'https://images.unsplash.com/photo-1582719478250-93f1b20a0372?w=400',
        },
        {
          id: 3,
          name: 'Projector & Screen',
          type: 'AV',
          price: 150,
          image: 'https://images.unsplash.com/photo-1582719478806-d1b4a4d5e734?w=400',
        },
      ] as Equipment[],
      benefits: [
        { title: 'Easy Booking', description: 'Quickly reserve venues', icon: 'pi pi-check' },
        { title: 'Trusted Vendors', description: 'Verified suppliers', icon: 'pi pi-users' },
        { title: 'Secure Payments', description: 'Safe and reliable', icon: 'pi pi-lock' },
        { title: '24/7 Support', description: 'Always here to help', icon: 'pi pi-headset' },
      ],
    };
  },
  methods: {
    onSearch() {
      this.$router.push({
        path: ROUTES.COMMON.SEARCH.path,
        query: { q: this.searchQuery },
      });
    },
    goToVendorDashboard() {
      this.$router.push({ name: ROUTES.VENDOR.DASHBOARD.name });
    }
  },
});
</script>
