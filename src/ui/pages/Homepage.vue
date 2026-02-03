<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-4xl mx-auto mb-12">
          <h1 class="text-4xl md:text-5xl mb-4">Trouvez le lieu parfait pour votre événement</h1>
          <p class="text-xl text-blue-100">
            Réservez facilement des lieux et équipements pour toutes vos occasions
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="lg:col-span-2">
              <label class="block text-sm text-gray-700 mb-2">Recherche</label>
              <InputText v-model="searchQuery" placeholder="Nom du lieu ou équipement..." class="w-full" />
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-2">Localisation</label>
              <InputText v-model="location" placeholder="Ville, État" class="w-full" />
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-2">Type d'événement</label>
              <MultiSelect v-model="eventType" :options="eventTypes" optionLabel="label" optionValue="value"
                placeholder="Type d'événement" class="w-full" />
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-2">Capacité</label>
              <Select v-model="capacity" :options="capacities" optionLabel="label" optionValue="value"
                placeholder="Capacité" filter showClear class="w-full" />

            </div>
          </div>

          <Button label="Rechercher"
            class="w-full md:w-auto mt-6 bg-orange-500 hover:bg-orange-600 text-white border-none" size="large"
            @click="handleSearch" />
        </div>
      </div>
    </section>

    <!-- Popular Listings -->
    <section class="py-16 container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl mb-2">Lieux et équipements populaires</h2>
          <p class="text-gray-600">Découvrez nos lieux et équipements les plus réservés</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card v-for="listing in popularListings" :key="listing.id"
          class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" @click="goToListing(listing.id)">
          <img :src="listing.image" :alt="listing.name" class="w-full h-48 object-cover" />
          <div class="p-4 flex flex-col gap-2">
            <h3 class="mb-1">{{ listing.name }}</h3>
            <p class="text-gray-600 text-sm">{{ listing.location }}</p>
            <Badge :value="listing.type" class="bg-blue-100 text-blue-800" />
            <div class="flex items-center justify-between mt-2">
              <span class="text-gray-900 font-medium">${{ listing.price }}</span>
              <span class="text-sm text-yellow-500">★ {{ listing.rating }}</span>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl mb-2">Pourquoi choisir VenueBook ?</h2>
          <p class="text-gray-600">La manière la plus simple de réserver des lieux et équipements</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(benefit, index) in benefits" :key="index" class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <i :class="['pi', benefit.icon, 'text-2xl text-blue-600']"></i>
            </div>
            <h3 class="mb-2 font-semibold">{{ benefit.title }}</h3>
            <p class="text-gray-600">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl mb-4">Prêt à inscrire votre établissement ?</h2>
        <p class="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          Donnez de la visibilité à vos lieux et équipements et attirez de nouveaux clients dès maintenant.
        </p>
        <Button label="Devenir vendeur" size="large" class="bg-white text-orange-600 hover:bg-gray-100 border-none"
          @click="goToVendorDashboard" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Dropdown from 'primevue/dropdown';
import { ROUTES } from '@/constants/const';

interface Listing {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  image: string;
  rating: number;
}

export default defineComponent({
  name: 'HomePage',
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const location = ref('');
    const eventType = ref<string[]>([])
    const capacity = ref<string | null>(null)
    const eventTypes = [
      { label: 'Mariage', value: 'wedding' },
      { label: 'Corporate', value: 'corporate' },
      { label: 'Conférence', value: 'conference' },
      { label: 'Fête', value: 'party' },
      { label: 'Autre', value: 'other' },
    ];

    const capacities = [
      { label: '0-50 invités', value: '0-50' },
      { label: '50-100 invités', value: '50-100' },
      { label: '100-200 invités', value: '100-200' },
      { label: '200-500 invités', value: '200-500' },
      { label: '500+ invités', value: '500+' },
    ];



    const popularListings = ref<Listing[]>([
      {
        id: 1,
        name: 'Grand Ballroom Downtown',
        type: 'Lieu',
        image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c68d?w=800',
        price: 2500,
        location: 'New York, NY',
        rating: 4.9,
      },
      {
        id: 2,
        name: 'Modern Conference Hall',
        type: 'Lieu',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        price: 1200,
        location: 'San Francisco, CA',
        rating: 4.8,
      },
      {
        id: 3,
        name: 'Professional Audio System',
        type: 'Équipement',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
        price: 350,
        location: 'Los Angeles, CA',
        rating: 4.7,
      },
    ]);

    const benefits = [
      { icon: 'pi-search', title: 'Découverte facile', description: 'Trouvez facilement le lieu ou équipement parfait' },
      { icon: 'pi-shield', title: 'Réservation sécurisée', description: 'Réservez en toute confiance avec notre système sécurisé' },
      { icon: 'pi-clock', title: 'Disponibilité instantanée', description: 'Vérifiez les disponibilités et réservez en quelques minutes' },
      { icon: 'pi-trending-up', title: 'Meilleurs prix', description: 'Tarifs compétitifs auprès de prestataires vérifiés' },
    ];

    const handleSearch = () => {
      router.push({
        name: ROUTES.COMMON.SEARCH.name,
        query: {
          q: searchQuery.value || '',
          location: location.value || '',
          eventType: eventType.value.length === 0
            ? 'any'
            : eventType.value.join(','),
          capacity: capacity.value ?? 'any',
        },
      });
    };

    const goToVendorDashboard = () => {
      router.push({ name: ROUTES.VENDOR.DASHBOARD.name });
    };

    const goToListing = (id: number) => {
      router.push({ name: ROUTES.COMMON.SEARCH.name, query: { listingId: id } });
    };

    return {
      searchQuery,
      location,
      eventType,
      capacity,
      eventTypes,
      capacities,
      popularListings,
      benefits,
      handleSearch,
      goToVendorDashboard,
      goToListing,
    };
  },
});
</script>

<style scoped>
/* Ajustements optionnels pour PrimeVue */
</style>
