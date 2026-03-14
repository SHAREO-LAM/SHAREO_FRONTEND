<template>
  <div class="min-h-screen bg-gray-50">
    <section class="bg-linear-to-br from-blue-600 to-blue-700 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-4xl mx-auto mb-12">
          <h1 class="text-4xl md:text-5xl mb-4">
            Trouvez le lieu parfait pour votre événement
          </h1>
          <p class="text-xl text-blue-100">
            Réservez facilement des lieux et équipements pour toutes vos occasions
          </p>
        </div>

        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 text-gray-900">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p class="block text-sm text-gray-700 mb-2">Recherche</p>
              <InputText
                v-model="searchQuery"
                placeholder="Nom du lieu ou équipement..."
                class="w-full"
              />
            </div>

            <div>
              <p class="block text-sm text-gray-700 mb-2">Localisation</p>
              <InputText
                v-model="location"
                placeholder="Ville, Pays"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex w-full justify-around md:flex-row gap-4 mb-6">
            <div>
              <p class=" text-sm text-gray-700 mb-2">Date de début</p>
              <DatePicker
                v-model="startDate"
                placeholder="Début"
                class="w-full"
                dateFormat="dd/mm/yy"
              />
            </div>

            <div>
              <p class=" text-sm text-gray-700 mb-2">Date de fin</p>
              <DatePicker
                v-model="endDate"
                placeholder="Fin"
                class="w-full"
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div class="flex justify-between gap-4">
            <Button
              label="Équipements"
              icon="pi pi-cog"
              class="flex-1"
              :outlined="selectedCategory !== 'equipment'"
              @click="selectedCategory = 'equipment'"
            />

            <Button
              label="Salle"
              icon="pi pi-building"
              class="flex-1"
              :outlined="selectedCategory !== 'venue'"
              @click="selectedCategory = 'venue'"
            />

            <Button
              label="Rechercher"
              icon="pi pi-search"
              class="flex-1 bg-orange-500 border-none text-white"
              @click="handleSearch"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 container mx-auto px-4">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl mb-2">Lieux et équipements populaires</h2>
        <p class="text-gray-600">Découvrez nos lieux et équipements les plus réservés</p>
      </div>

      <Button
        label="Voir tout"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 border-none"
        @click="goToDomains"
      />
    </div>

    <div class="overflow-x-auto flex gap-4 pb-4">
      <ListingCard
        v-for="listing in popularListings"
        :key="listing.id"
        :listing="listing"
        viewMode="grid"
        :onNavigate="() => goToDetails(listing)"
        class="shrink-0 w-64"
      />
    </div>
  </section>

    <section class="py-16 bg-linear-to-br from-orange-500 to-orange-600 text-white">
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
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";

import { ROUTES } from "@/constants/const";
import ListingCard from "../components/ListingCard.vue";
import { getDomains } from "@/services/domain";
import type { Domain, UpdateDomainDto } from "@/types/domain";

interface PopularListing {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
  location: string;
  capacity?: number;
  rating?: number;
}

export default defineComponent({
  name: "HomePage",
  components: {
    ListingCard, 
  },
  setup() {
    const router = useRouter();

    const searchQuery = ref("");
    const location = ref("");

    const startDate = ref<Date | null>(null);
    const endDate = ref<Date | null>(null);

    const selectedCategory = ref<"equipment" | "venue">("equipment");
    
    const popularListings = ref<PopularListing[]>([]);

    const fetchPopularDomains = async () => {
      const domains = await getDomains();
      popularListings.value = domains.map((d: Domain, index: number) => ({
        id: 1,
        name: d.name ?? 'Nom indisponible',
        type: 'Domaine',
        image: typeof d.imageUrl === 'string'
    ? d.imageUrl
    : 'https://placehold.co/400x300?text=No+Image',
        price: d.pricePerDay ?? 0,
        location: typeof d.city === 'string' ? d.city : '',
        capacity: typeof d.capacity === 'number' ? d.capacity : undefined,
        rating: Math.round(Math.random() * 5 * 10) / 10 || 4.5, // note aléatoire pour exemple
      }));
    };


    const handleSearch = () => {
      const targetRoute =
        selectedCategory.value === "venue"
          ? ROUTES.COMMON.DOMAINS.name
          : ROUTES.COMMON.EQUIPMENTS.name;

      router.push({
        name: targetRoute,
        query: {
          q: searchQuery.value || "",
          location: location.value || "",
          startDate: startDate.value?.toISOString() ?? "",
          endDate: endDate.value?.toISOString() ?? "",
        },
      });
    };


    const goToVendorDashboard = () => {
      router.push({ name: ROUTES.VENDOR.DASHBOARD.name });
    };


    const goToDomains = () => {
      router.push({ name: ROUTES.COMMON.DOMAINS.name });
    };

    const goToDetails = (listing: PopularListing) => {
      router.push({
        name: ROUTES.COMMON.DOMAINS.name,
        query: { listingId: listing.id },
      });
    };

    return {
      searchQuery,
      location,
      startDate,
      endDate,
      selectedCategory,
      popularListings,
      handleSearch,
      goToVendorDashboard,
      goToDomains,
      goToDetails,
      fetchPopularDomains,
    };
  },
  mounted() {
    this.fetchPopularDomains();
  },
});
</script>

<style scoped></style>