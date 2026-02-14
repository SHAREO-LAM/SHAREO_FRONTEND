<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20">
      <div class="container mx-auto px-4 text-center">

        <div class="max-w-4xl mx-auto mb-12">
          <h1 class="text-4xl md:text-5xl mb-4">
            Trouvez le lieu parfait pour votre événement
          </h1>
          <p class="text-xl text-blue-100">
            Réservez facilement des lieux et équipements pour toutes vos occasions
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-6">

          <!-- Flex Form -->
          <div class="flex flex-wrap gap-4">

            <!-- Recherche -->
            <div class="flex flex-col flex-[2] min-w-[250px]">
              <label class="text-sm text-gray-700 mb-2">Recherche</label>
              <InputText
                v-model="searchQuery"
                placeholder="Nom du lieu ou équipement..."
                class="w-full"
              />
            </div>

            <!-- Localisation -->
            <div class="flex flex-col flex-1 min-w-[180px]">
              <label class="text-sm text-gray-700 mb-2">Localisation</label>
              <InputText
                v-model="location"
                placeholder="Ville, État"
                class="w-full"
              />
            </div>

            <!-- Type d'événement -->
            <div class="flex flex-col flex-1 min-w-[200px]">
              <label class="text-sm text-gray-700 mb-2">Type d'événement</label>

              <MultiSelect
                v-model="selectedEventTypes"
                :options="eventTypes"
                optionLabel="name"
                placeholder="Type d'événement"
                class="w-full"
              />
            </div>

            <!-- Capacité -->
            <div class="flex flex-col flex-1 min-w-[180px]">
              <label class="text-sm text-gray-700 mb-2">Capacité</label>
              <Select
                v-model="capacity"
                :options="capacities"
                optionLabel="label"
                optionValue="value"
                placeholder="Capacité"
                filter
                showClear
                class="w-full"
              />
            </div>

            <!-- Prix minimum -->
            <div class="flex flex-col flex-1 min-w-[150px]">
              <label class="text-sm text-gray-700 mb-2">Prix minimum</label>
              <InputNumber
                v-model="priceRangeMin"
                placeholder="0"
                class="w-full"
              />
            </div>

            <!-- Prix maximum -->
            <div class="flex flex-col flex-1 min-w-[150px]">
              <label class="text-sm text-gray-700 mb-2">Prix maximum</label>
              <InputNumber
                v-model="priceRangeMax"
                placeholder="1000+"
                class="w-full"
              />
            </div>

          </div>

          <!-- Bouton -->
          <div class="flex justify-end mt-6">
            <Button
              label="Rechercher"
              class="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white border-none"
              size="large"
              @click="handleSearch"
            />
          </div>

        </div>
      </div>
    </section>

    <!-- Popular Listings -->
    <section class="py-16 container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl mb-2">Lieux et équipements populaires</h2>
          <p class="text-gray-600">
            Découvrez nos lieux et équipements les plus réservés
          </p>
        </div>

        <Button
          label="Voir tout"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 border-none"
          @click="goToSearch"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          v-for="listing in popularListings"
          :key="listing.id"
          class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToListing(listing.id)"
        >
          <img
            :src="listing.image"
            :alt="listing.name"
            class="w-full h-48 object-cover"
          />

          <div class="p-4 flex flex-col gap-2">
            <h3>{{ listing.name }}</h3>
            <p class="text-gray-600 text-sm">{{ listing.location }}</p>

            <Badge :value="listing.type" class="bg-blue-100 text-blue-800" />

            <div class="flex items-center justify-between mt-2">
              <span class="text-gray-900 font-medium">
                ${{ listing.price }}
              </span>
              <span class="text-sm text-yellow-500">
                ★ {{ listing.rating }}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl mb-4">
          Prêt à inscrire votre établissement ?
        </h2>
        <p class="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          Donnez de la visibilité à vos lieux et équipements et attirez de nouveaux clients dès maintenant.
        </p>

        <Button
          label="Devenir vendeur"
          size="large"
          class="bg-white text-orange-600 hover:bg-gray-100 border-none"
          @click="goToVendorDashboard"
        />
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import Select from "primevue/select";
import Button from "primevue/button";
import Card from "primevue/card";
import Badge from "primevue/badge";

import { ROUTES } from "@/constants/const";
import { fetchEquipementTypes } from "@/services/equipement";
import type { EquipementType } from "@/types/equipementType";

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
  name: "HomePage",

  setup() {
    const router = useRouter();

    /* Champs formulaire */
    const searchQuery = ref("");
    const location = ref("");

    /* Options chargées depuis API */
    const eventTypes = ref<EquipementType[]>([]);

    /* Sélection utilisateur */
    const selectedEventTypes = ref<EquipementType[]>([]);

    const capacity = ref<string | null>(null);
    const priceRangeMin = ref<number | null>(null);
    const priceRangeMax = ref<number | null>(null);

    /* Capacités */
    const capacities = [
      { label: "0-50 invités", value: "0-50" },
      { label: "50-100 invités", value: "50-100" },
      { label: "100-200 invités", value: "100-200" },
      { label: "200-500 invités", value: "200-500" },
      { label: "500+ invités", value: "500+" },
    ];

    /* Listings fake */
    const popularListings = ref<Listing[]>([
      {
        id: 1,
        name: "Grand Ballroom Downtown",
        type: "Lieu",
        image: "https://images.unsplash.com/photo-1519167758481-83f29da8c68d?w=800",
        price: 2500,
        location: "New York, NY",
        rating: 4.9,
      },
      {
        id: 2,
        name: "Modern Conference Hall",
        type: "Lieu",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        price: 1200,
        location: "San Francisco, CA",
        rating: 4.8,
      },
      {
        id: 3,
        name: "Professional Audio System",
        type: "Équipement",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
        price: 350,
        location: "Los Angeles, CA",
        rating: 4.7,
      },
    ]);

    /* Charger types depuis API */
    const loadData = async () => {
      eventTypes.value = await fetchEquipementTypes();
    };

    loadData();

    /* Recherche */
    const handleSearch = () => {
      if (
        priceRangeMin.value &&
        priceRangeMax.value &&
        priceRangeMin.value > priceRangeMax.value
      ) {
        alert("Le prix minimum ne peut pas être supérieur au prix maximum.");
        return;
      }

      router.push({
        name: ROUTES.COMMON.SEARCH.name,
        query: {
          q: searchQuery.value,
          location: location.value,

          eventType:
            selectedEventTypes.value.length === 0
              ? "any"
              : selectedEventTypes.value
                  .map((e) => e.code)
                  .join(","),

          capacity: capacity.value ?? "any",
          priceRangeMin: priceRangeMin.value ?? "0",
          priceRangeMax: priceRangeMax.value ?? "1000",
        },
      });
    };

    /* Navigation */
    const goToVendorDashboard = () => {
      router.push({ name: ROUTES.VENDOR.DASHBOARD.name });
    };

    const goToSearch = () => {
      router.push({ name: ROUTES.COMMON.SEARCH.name });
    };

    const goToListing = (id: number) => {
      router.push({
        name: ROUTES.COMMON.SEARCH.name,
        query: { listingId: id },
      });
    };

    return {
      searchQuery,
      location,

      eventTypes,
      selectedEventTypes,

      capacity,
      capacities,

      priceRangeMin,
      priceRangeMax,

      popularListings,

      handleSearch,
      goToVendorDashboard,
      goToSearch,
      goToListing,
    };
  },
});
</script>

<style scoped>
</style>
