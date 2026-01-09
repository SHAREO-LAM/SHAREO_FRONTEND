
<template>
    <div class="homepage">

        <!-- Header -->
        <Header :current-page="ROUTES.COMMON.HOME.name" user-role="guest" :cart-item-count="0" @navigate="onNavigate" />

        <div class="flex flex-col gap-16">

            <DatePicker  inline showWeek class="w-full sm:w-[30rem]" />

            <Button></Button>
            <!-- Hero Section -->
            <section class="hero">
                <div class="container">
                    <h1>Book the Perfect Venue or Equipment</h1>
                    <p>
                        Easily find and reserve venues and event equipment for any occasion
                    </p>

                    <div class="search">
                        <InputText v-model="searchQuery" placeholder="Search venues or equipment..."
                            class="" />
                        <Button label="Search" @click="onSearch" />
                    </div>
                </div>
            </section>

            <!-- Featured Venues -->
            <section class="section">
                <div class="container">
                    <h2>Featured Venues</h2>

                    <div class="cards-row">
                        <Card v-for="venue in featuredVenues" :key="venue.id" class="card">
                            <template #header>
                                <img :src="venue.image" :alt="venue.name" />
                            </template>

                            <div class="card-body">
                                <h3>{{ venue.name }}</h3>
                                <p>{{ venue.location }}</p>
                                <Badge :value="`$${venue.price}/day`" />
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <!-- Featured Equipment -->
            <section class="section">
                <div class="container">
                    <h2>Featured Equipment</h2>

                    <div class="cards-row">
                        <Card v-for="equipment in featuredEquipment" :key="equipment.id" class="card">
                            <template #header>
                                <img :src="equipment.image" :alt="equipment.name" />
                            </template>

                            <div class="card-body">
                                <h3>{{ equipment.name }}</h3>
                                <p>{{ equipment.type }}</p>
                                <Badge :value="`$${equipment.price}/day`" />
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <!-- Benefits Section -->
            <section class="section-benefits">
                <div class="container">
                    <div class="section-header">
                        <h2>Why Choose VenueBook?</h2>
                        <p>The easiest way to book venues and equipment</p>
                    </div>

                    <div class="benefits-grid">
                        <div v-for="(benefit, index) in benefits" :key="index" class="benefit-item">
                            <div class="benefit-icon">
                                <i :class="benefit.icon"></i>
                            </div>
                            <h3>{{ benefit.title }}</h3>
                            <p>{{ benefit.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="section-cta">
                <div class="container">
                    <h2>Ready to List Your Venue?</h2>
                    <p>
                        Join thousands of vendors earning revenue by listing their venues and equipment
                    </p>
                    <Button class="cta-button" size="large" @click="onNavigate('vendor')">
                        Become a Vendor
                    </Button>
                </div>
            </section>

            <Footer>
                
            </Footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { APP, ROUTES } from '../../constants/const.ts'

import Header from '../components/Header.vue'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Footer from '../components/Footer.vue'

interface Venue {
    id: number
    name: string
    location: string
    price: number
    image: string
}

interface Equipment {
    id: number
    name: string
    type: string
    price: number
    image: string
}

const router = useRouter()
const searchQuery = ref('')

const featuredVenues: Venue[] = [
    {
        id: 1,
        name: 'Grand Ballroom',
        location: 'New York',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=400'
    },
    {
        id: 2,
        name: 'Conference Hall',
        location: 'Los Angeles',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1603430416744-a47cee46b0ae?w=400'
    },
    {
        id: 3,
        name: 'Garden Event Space',
        location: 'Chicago',
        price: 2000,
        image: 'https://images.unsplash.com/photo-1760972594010-e217e2f2845c?w=400'
    }
]

const featuredEquipment: Equipment[] = [
    {
        id: 1,
        name: 'Professional Audio System',
        type: 'Audio',
        price: 350,
        image: 'https://images.unsplash.com/photo-1745848413083-cfea604edb6a?w=400'
    },
    {
        id: 2,
        name: 'Lighting Package',
        type: 'Lighting',
        price: 200,
        image: 'https://images.unsplash.com/photo-1582719478250-93f1b20a0372?w=400'
    },
    {
        id: 3,
        name: 'Projector & Screen',
        type: 'AV',
        price: 150,
        image: 'https://images.unsplash.com/photo-1582719478806-d1b4a4d5e734?w=400'
    }
];
const benefits = ref([
    { title: 'Easy Booking', description: 'Quickly reserve venues', icon: 'pi pi-check' },
    { title: 'Trusted Vendors', description: 'Verified suppliers', icon: 'pi pi-users' },
    { title: 'Secure Payments', description: 'Safe and reliable', icon: 'pi pi-lock' },
    { title: '24/7 Support', description: 'Always here to help', icon: 'pi pi-headset' },
])




function onSearch() {
    router.push({
        path: ROUTES.COMMON.SEARCH.path,
        query: { q: searchQuery.value }
    })
}

function onNavigate(page: string) {
    router.push(`/${page}`)
}


</script>

<style scoped lang="scss">
@use '../../assets/scss/views/homepage.scss';
</style>