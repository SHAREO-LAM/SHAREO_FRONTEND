<template>
    <div class="homepage">

        <!-- Header -->
        <Header
            current-page="home"
            user-role="guest"
            :cart-item-count="0"
            @navigate="onNavigate"
        />

        <div class="flex flex-col gap-16">

            <!-- Hero Section -->
            <section class="hero">
                <div class="container">
                    <h1>Book the Perfect Venue or Equipment</h1>
                    <p>
                        Easily find and reserve venues and event equipment for any occasion
                    </p>

                    <div class="search">
                        <InputText
                            v-model="searchQuery"
                            placeholder="Search venues or equipment..."
                            class="w-full md:w-96"
                        />
                        <Button label="Search" @click="onSearch" />
                    </div>
                </div>
            </section>

            <!-- Featured Venues -->
            <section class="section bg-gray-50">
                <div class="container">
                    <h2>Featured Venues</h2>

                    <div class="cards-row">
                        <Card
                            v-for="venue in featuredVenues"
                            :key="venue.id"
                            class="card"
                        >
                            <template #header>
                                <img
                                    :src="venue.image"
                                    :alt="venue.name"
                                />
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
                        <Card
                            v-for="equipment in featuredEquipment"
                            :key="equipment.id"
                            class="card"
                        >
                            <template #header>
                                <img
                                    :src="equipment.image"
                                    :alt="equipment.name"
                                />
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

            <!-- CTA -->
            <section class="cta">
                <h2>Start Booking Today</h2>
                <p>
                    Sign up now and discover hundreds of venues and equipment
                </p>
                <Button label="Get Started" @click="onNavigateAccount" />
            </section>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Header from '../components/Header.vue'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Badge from 'primevue/badge'

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
]

function onSearch() {
    router.push({
        path: '/search',
        query: { q: searchQuery.value }
    })
}

function onNavigate(page: string) {
    router.push(`/${page}`)
}

function onNavigateAccount() {
    router.push('/account')
}
</script>

<style scoped lang="scss">
.homepage {
    display: flex;
    flex-direction: column;
}

.hero {
    background: #2563eb;
    color: white;
    padding: 5rem 1rem;
    text-align: center;

    .container {
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    h1 {
        font-size: 2.5rem;
        font-weight: 700;
    }

    p {
        font-size: 1.125rem;
    }

    .search {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        @media (min-width: 768px) {
            flex-direction: row;
            justify-content: center;
        }
    }
}

.section {
    padding: 4rem 1rem;

    h2 {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
    }
}

.cards-row {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    padding-bottom: 1rem;
}

.card {
    width: 18rem;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 12rem;
        object-fit: cover;
    }

    .card-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
}

.cta {
    background: #2563eb;
    color: white;
    text-align: center;
    padding: 5rem 1rem;

    h2 {
        font-size: 2.25rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.125rem;
        margin-bottom: 2rem;
    }
}
</style>
