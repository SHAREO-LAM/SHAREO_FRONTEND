<template>
  <div class="home-page">
    <section class="page-wrap">
      <div class="glass-panel hero-color-panel home-hero p-5 md:p-7">
        <div class="home-hero__grid">
          <div class="home-hero__content">
            <div class="mb-5 md:mb-6">
              <h1 class="section-title home-hero__title">Trouvez un lieu et du matériel sans perdre de temps.</h1>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p class="home-label mb-2 text-sm">Recherche</p>
                <InputText
                  v-model="searchQuery"
                  placeholder="Nom du lieu ou équipement..."
                  class="w-full"
                />
              </div>

              <div>
                <p class="home-label mb-2 text-sm">Localisation</p>
                <InputText
                  v-model="location"
                  placeholder="Ville, pays"
                  class="w-full"
                />
              </div>
            </div>

            <div class="my-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p class="home-label mb-2 text-sm">Date de début</p>
                <DatePicker
                  v-model="startDate"
                  placeholder="Début"
                  class="w-full"
                  dateFormat="dd/mm/yy"
                />
              </div>

              <div>
                <p class="home-label mb-2 text-sm">Date de fin</p>
                <DatePicker
                  v-model="endDate"
                  placeholder="Fin"
                  class="w-full"
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>

            <div class="my-2">
              <p class="home-label mb-2 text-sm font-semibold">Que souhaitez-vous réserver ?</p>
              <SelectButton
                v-model="selectedCategory"
                :options="categoryOptions"
                optionLabel="label"
                optionValue="value"
                dataKey="value"
                class="home-search-toggle w-full"
              >
                <template #option="slotProps">
                  <span
                    class="home-search-toggle__option flex items-center gap-2"
                    :class="{ 'home-search-toggle__option--active': selectedCategory === slotProps.option.value }"
                  >
                    <i :class="slotProps.option.icon" />
                    <span>{{ slotProps.option.label }}</span>
                  </span>
                </template>
              </SelectButton>
            </div>

            <div class="mt-4 flex">
              <Button
                label="Rechercher"
                icon="pi pi-search"
                class="home-search-button w-full md:w-auto md:min-w-60 mt-5"
                severity="warn"
                @click="handleSearch"
              />
            </div>
          </div>

          <aside class="home-hero__aside">
            <div class="home-spotlight">
              <div class="home-spotlight__topline">
                <span>Sélection SHAREO</span>
              </div>

              <router-link
                v-if="spotlightListing.id > 0"
                :to="`/productDetails/${spotlightListing.id}`"
                class="home-spotlight__media"
              >
                <img :src="spotlightListing.image" :alt="spotlightListing.name" class="home-spotlight__image">
                <div class="home-spotlight__overlay">
                  <span class="home-spotlight__badge">Coup de cœur</span>
                  <div>
                    <p class="home-spotlight__place">{{ spotlightListing.location }}</p>
                    <h3 class="home-spotlight__name">{{ spotlightListing.name }}</h3>
                  </div>
                </div>
              </router-link>
              <div v-else class="home-spotlight__media">
                <img :src="spotlightListing.image" :alt="spotlightListing.name" class="home-spotlight__image">
                <div class="home-spotlight__overlay">
                  <span class="home-spotlight__badge">Coup de cœur</span>
                  <div>
                    <p class="home-spotlight__place">{{ spotlightListing.location }}</p>
                    <h3 class="home-spotlight__name">{{ spotlightListing.name }}</h3>
                  </div>
                </div>
              </div>

              <div class="home-spotlight__body">
                <h2>Des lieux qui donnent envie de réserver en 1 coup d'oeil</h2>

                <div class="home-spotlight__features">
                  <div>
                    <strong>À partir de {{ spotlightListing.price }} EUR</strong>
                    <span>par jour pour des offres visibles immédiatement</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="page-wrap">
      <div class="home-section-heading mb-8 flex items-center justify-between gap-4">
        <div>
          <p class="home-hero__eyebrow">À la une</p>
          <h2 class="section-title">Populaire cette semaine</h2>
          <p class="section-lead">Une sélection dynamique de lieux appréciés par la communauté.</p>
        </div>

        <Button
          label="Voir tous les lieux"
          icon="pi pi-arrow-right"
          iconPos="right"
          outlined
          @click="goToDomains"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ListingCard
          v-for="listing in popularListings"
          :key="listing.id"
          :listing="listing"
          viewMode="grid"
          :onNavigate="() => goToDetails(listing)"
        />
      </div>
    </section>

    <section class="page-wrap pb-12">
      <div v-if="showBecomeSellerCta" class="glass-panel highlight-panel home-cta p-7 md:p-9">
        <div>
          <p class="home-hero__eyebrow">Côté vendeur</p>
          <h2 class="section-title">Vous avez un lieu ou du matériel à louer ?</h2>
          <p class="section-lead mx-auto mb-0 max-w-2xl md:mx-0">
            Activez votre espace vendeur, publiez vos offres et suivez vos demandes en temps réel.
          </p>
        </div>

        <Button
          label="Devenir vendeur"
          size="large"
          severity="warn"
          icon="pi pi-briefcase"
          @click="goToVendorDashboard"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import SelectButton from 'primevue/selectbutton'

import { ROUTES } from '@/constants/const'
import ListingCard from '../components/ListingCard.vue'
import { getDomains } from '@/services/domain'
import type { Domain } from '@/types/domain'
import { useAuthStore } from '@/stores/authStore'

interface PopularListing {
  id: number
  name: string
  type: string
  image: string
  price: number
  location: string
  capacity?: number
  rating?: number
}

type SearchCategory = 'equipment' | 'venue'

export default defineComponent({
  name: 'HomePage',
  components: {
    ListingCard,
    SelectButton,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const searchQuery = ref('')
    const location = ref('')

    const startDate = ref<Date | null>(null)
    const endDate = ref<Date | null>(null)

    const selectedCategory = ref<SearchCategory>('equipment')
    const categoryOptions = [
      {
        label: 'Je cherche des équipements',
        value: 'equipment' as SearchCategory,
        icon: 'pi pi-cog',
      },
      {
        label: 'Je cherche une salle',
        value: 'venue' as SearchCategory,
        icon: 'pi pi-building',
      },
    ]

    const showBecomeSellerCta = computed(() => authStore.userRole !== 'admin' && authStore.userRole !== 'superadmin')

    const popularListings = ref<PopularListing[]>([])
    const spotlightListing = computed<PopularListing>(() => popularListings.value[0] ?? {
      id: 0,
      name: 'Studio Signature SHAREO',
      type: 'Domaine',
      image: 'https://placehold.co/640x720?text=Selection+Shareo',
      price: 190,
      location: 'Paris, France',
      capacity: 40,
      rating: 4.8,
    })

    const fetchPopularDomains = async () => {
      const domains = await getDomains()
      popularListings.value = domains.slice(0, 4).map((d: Domain, index: number) => ({
        id: Number(d.domainId ?? index + 1),
        name: d.name ?? 'Nom indisponible',
        type: 'Domaine',
        image: d.imageUrl ? d.imageUrl : 'https://placehold.co/400x300?text=No+Image',
        price: d.pricePerDay ?? 0,
        location: d.city && d.country ? `${d.city}, ${d.country}` : 'Localisation indisponible',
        capacity: d.capacity ? parseInt(d.capacity) : undefined,
        rating: Math.round(Math.random() * 5 * 10) / 10 || 4.5,
      }))
    }

    const formatDateForQuery = (date: Date | null) => {
      if (!date) return ''

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const handleSearch = () => {
      const targetRoute = selectedCategory.value === 'venue' ? ROUTES.COMMON.DOMAINS.name : ROUTES.COMMON.EQUIPMENTS.name

      router.push({
        name: targetRoute,
        query: {
          q: searchQuery.value || '',
          location: location.value || '',
          startDate: formatDateForQuery(startDate.value),
          endDate: formatDateForQuery(endDate.value),
        },
      })
    }

    const goToVendorDashboard = () => {
      if (!authStore.isLoggedIn) {
        router.push('/login')
        return
      }

      if (!authStore.user?.companyId) {
        router.push('/become-seller')
        return
      }

      router.push({ name: ROUTES.VENDOR.DASHBOARD.name })
    }

    const goToDomains = () => {
      router.push({ name: ROUTES.COMMON.DOMAINS.name })
    }

    const goToDetails = (listing: PopularListing) => {
      router.push({
        name: ROUTES.COMMON.DOMAINS.name,
        query: { listingId: listing.id },
      })
    }

    return {
      searchQuery,
      location,
      startDate,
      endDate,
      selectedCategory,
      categoryOptions,
      showBecomeSellerCta,
      popularListings,
      spotlightListing,
      handleSearch,
      goToVendorDashboard,
      goToDomains,
      goToDetails,
      fetchPopularDomains,
    }
  },
  mounted() {
    this.fetchPopularDomains()
  },
})
</script>

<style scoped lang="scss">
.home-page {
  .page-wrap:first-child {
    padding-top: 1.2rem;
    padding-bottom: 2rem;
  }

  .home-hero {
    position: relative;
  }

  .home-hero__grid {
    display: grid;
    gap: 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.95fr);
      align-items: stretch;
    }
  }

  .home-hero__content {
    position: relative;
    z-index: 1;
  }

  .home-hero__eyebrow {
    margin: 0 0 0.6rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #8d5f3e;
  }

  .home-hero__title {
    max-width: 13ch;
    font-size: clamp(1.8rem, 3vw, 3.1rem);
    line-height: 1.02;
    letter-spacing: -0.04em;
  }

  .home-hero__lead {
    max-width: 34rem;
    font-size: 0.95rem;
    margin-top: 0.55rem;
  }

  .home-label {
    color: var(--muted-color);
  }

  .home-hero__aside {
    display: flex;
    align-self: stretch;
  }

  .home-spotlight {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid rgba(37, 52, 74, 0.2);
    border-radius: 1.5rem;
    background: linear-gradient(180deg, rgba(31, 59, 91, 0.95) 0%, rgba(46, 77, 114, 0.97) 100%);
    color: #f6f8fb;
    box-shadow: 0 20px 40px rgba(31, 59, 91, 0.2);
  }

  .home-spotlight__topline {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(246, 248, 251, 0.72);
  }

  .home-spotlight h2 {
    margin: 0 0 0.6rem;
    font-size: clamp(1.2rem, 1.8vw, 1.65rem);
    line-height: 1.12;
  }

  .home-spotlight__media {
    position: relative;
    display: block;
    overflow: hidden;
    min-height: 14.5rem;
    margin-bottom: 1rem;
    border-radius: 1.15rem;
  }

  .home-spotlight__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .home-spotlight__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    background: linear-gradient(180deg, rgba(19, 34, 51, 0.12) 0%, rgba(19, 34, 51, 0.75) 100%);
  }

  .home-spotlight__badge {
    align-self: flex-start;
    padding: 0.38rem 0.7rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #213550;
    background: rgba(245, 237, 224, 0.95);
  }

  .home-spotlight__place {
    margin: 0 0 0.35rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(246, 248, 251, 0.72);
  }

  .home-spotlight__name {
    margin: 0;
    font-size: 1.35rem;
    line-height: 1.1;
    color: #fffaf4;
  }

  .home-spotlight__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .home-spotlight p {
    margin: 0;
    font-size: 0.92rem;
    color: rgba(246, 248, 251, 0.78);
    line-height: 1.45;
  }

  .home-spotlight__features {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0.6rem;
    margin-top: 1rem;
  }

  .home-spotlight__features > div {
    padding: 0.8rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.14);
  }

  .home-spotlight__features strong {
    display: block;
    font-size: 0.92rem;
    font-weight: 700;
  }

  .home-spotlight__features span {
    display: block;
    margin-top: 0.2rem;
    font-size: 0.8rem;
    color: rgba(246, 248, 251, 0.72);
  }

  .home-spotlight__cta {
    margin-top: auto;
    align-self: flex-start;
  }

  .home-search-toggle { 
    :deep(.p-selectbutton) {
      display: flex;
      gap: 0.55rem;
      background: transparent;
    }

    :deep(.p-togglebutton) {
      transition:
        transform 0.18s ease,
        box-shadow 0.22s ease,
        background-color 0.22s ease,
        border-color 0.22s ease;
      min-height: 2.55rem;
      padding: 0.55rem 0.8rem;
      border-radius: 1rem !important;
      overflow: hidden;
      border: 1px solid rgba(37, 52, 74, 0.22);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(243, 240, 235, 0.9) 100%);
      color: #475468;
    }

    :deep(.p-togglebutton .p-togglebutton-content) {
      border-radius: inherit;
      background: transparent;
    }

    :deep(.p-togglebutton + .p-togglebutton) {
      margin-left: 0;
    }

    :deep(.p-togglebutton.p-togglebutton-checked),
    :deep(.p-togglebutton.p-highlight),
    :deep(.p-togglebutton[aria-pressed='true']) {
      border-color: rgba(31, 59, 91, 0.95);
      background: linear-gradient(135deg, rgba(51, 80, 116, 0.98) 0%, rgba(31, 59, 91, 0.98) 100%) !important;
      background-color: rgba(31, 59, 91, 0.98) !important;
      color: #f6f8fb;
      box-shadow: 0 10px 18px rgba(31, 59, 91, 0.24);
    }

    :deep(.p-togglebutton.p-togglebutton-checked:hover),
    :deep(.p-togglebutton.p-highlight:hover),
    :deep(.p-togglebutton[aria-pressed='true']:hover) {
      border-color: rgba(31, 59, 91, 1);
      background: linear-gradient(135deg, rgba(59, 90, 127, 1) 0%, rgba(31, 59, 91, 1) 100%);
      color: #f6f8fb;
    }
  }

  .home-search-toggle__option {
    width: 100%;
    justify-content: center;
    font-size: 0.88rem;
    line-height: 1.1;
    font-weight: 600;
    color: inherit;
  }

  .home-search-toggle__option--active {
    color: #fffaf4;
  }

  .home-search-button {
    min-height: 3.15rem;
    font-size: 0.98rem;
    padding-inline: 1.2rem;
  }

  .home-section-heading {
    align-items: end;
  }

  .home-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  @media (max-width: 1023px) {
    .home-hero__title {
      max-width: none;
    }

    .home-hero__aside {
      display: none;
    }
  }

  @media (max-width: 767px) {
    .home-section-heading,
    .home-cta {
      flex-direction: column;
      align-items: stretch;
    }

    .home-spotlight__topline {
      flex-direction: column;
      gap: 0.4rem;
    }

    .home-spotlight__features {
      grid-template-columns: 1fr;
    }
  }
}
</style>
