<template>
  <div class="product-details-page">

    <Header
      :current-page="ROUTES.COMMON.HOME.name"
      user-role="guest"
      :cart-item-count="0"
      @navigate="onNavigate"
    />

    <main class="product-details">

      <!-- IMAGE GALLERY -->
      <section class="gallery">
        <!-- Ici tu pourras brancher un carousel ou ImageWithFallback -->
      </section>

      <div class="content-grid">

        <!-- LEFT CONTENT -->
        <div class="left-content">

          <!-- TITLE -->
          <section class="title-section">
            <Badge :value="product.type" class="mb-2" />
            <h1>{{ product.name }}</h1>
            <div class="meta">
              <span v-if="product.location">📍 {{ product.location }}</span>
              <span v-if="product.capacity">👥 Up to {{ product.capacity }} guests</span>
            </div>
          </section>

          <!-- DESCRIPTION -->
          <section class="description">
            <h2>About This Venue</h2>
            <div class="text">{{ product.description }}</div>
          </section>


          <!-- AMENITIES
          <section class="amenities">
            <h2>Amenities</h2>
            <div class="amenities-grid">

            </div>
          </section>

          <section class="included">
            <h2>What's Included</h2>
            <div class="included-grid">
            </div>
          </section> -->

          <!-- VENDOR -->
          <section class="vendor">
            <h2>About the Vendor</h2>
            <!-- On pourra y mettre VendorCard -->
          </section>

          <!-- REVIEWS
          <section class="reviews">
            <h2>Reviews</h2>
            <div class="reviews-list">
            </div>
          </section> -->

        </div>

        <!-- RIGHT CONTENT -->
        <aside class="booking-card">
          <div class="price">{{ product.price }} € / jour</div>
          <Calendar v-model="selectedDate" inline :min-date="minDate" />
          <Button label="Réserver" severity="warning" @click="handleBookNow" />
        </aside>

      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '../../constants/const'

import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Badge from 'primevue/badge'
import { getDomain } from '@/services/domain'
import type { Domain } from '@/types/domain'

const router = useRouter()
const domain = ref<Domain>()


async function loadDomain() {
  domain.value = await getDomain('1')
  console.log('Fetched domain:', domain.value)
}

function onNavigate(page: string) {
  router.push(`/${page}`)
}
onMounted(() => {
  loadDomain()
})

const product = ref({
  name: '',
  type: '',
  location: '',
  capacity: null as number | null,
  description: '',
  price: null as number | null,
  vendor: {
    name: '',
    since: null as number | null,
    listingsCount: null as number | null,
    rating: null as number | null
  }
})

const selectedDate = ref<Date | null>(null)
const minDate = new Date()

function handleBookNow() {
  console.log('Book now clicked')
}
</script>

<style scoped lang="scss">
@use '../../assets/scss/views/productDetailsPage.scss';
</style>
