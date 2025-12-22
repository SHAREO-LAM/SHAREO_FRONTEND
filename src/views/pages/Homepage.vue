<template>
    <div class="flex flex-col gap-16">

        <!-- Hero Section -->
        <section class="bg-blue-600 text-white py-20">
            <div class="container mx-auto text-center px-4 flex flex-col gap-6">
                <h1 class="text-4xl md:text-5xl font-bold">Book the Perfect Venue or Equipment</h1>
                <p class="text-lg md:text-xl">Easily find and reserve venues and event equipment for any occasion</p>

                <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <InputText v-model="searchQuery" placeholder="Search venues or equipment..."
                        class="w-full md:w-96" />
                    <Button label="Search" class="p-button-primary" @click="onSearch" />
                </div>
            </div>
        </section>

        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-semibold mb-8 text-center">Featured Venues</h2>

                <div class="flex gap-6 overflow-x-auto pb-4">
                    <Card v-for="venue in featuredVenues" :key="venue.id"
                        class="flex-shrink-0 w-72 hover:shadow-lg transition-shadow">
                        <template #header>
                            <img :src="venue.image" :alt="venue.name" class="w-full h-48 object-cover rounded-t-md" />
                        </template>

                        <div class="p-4 flex flex-col gap-1">
                            <h3 class="text-lg font-semibold">{{ venue.name }}</h3>
                            <p class="text-gray-600">{{ venue.location }}</p>
                            <Badge :value="`$${venue.price}/day`" class="mt-2" />
                        </div>
                    </Card>
                </div>

            </div>
        </section>

        <section class="py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-semibold mb-8 text-center">Featured Equipment</h2>

                <Card v-for="equipment in featuredEquipment" :key="equipment.id"
                    class="hover:shadow-lg transition-shadow">
                    <template #header>
                        <img :src="equipment.image" :alt="equipment.name"
                            class="w-full h-48 object-cover rounded-t-md" />
                    </template>

                    <div class="p-4 flex flex-col gap-1">
                        <h3 class="text-lg font-semibold">{{ equipment.name }}</h3>
                        <p class="text-gray-600">{{ equipment.type }}</p>
                        <Badge :value="`$${equipment.price}/day`" class="mt-2" />
                    </div>
                </Card>
            </div>
        </section>

        <section class="bg-blue-600 text-white py-20 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Start Booking Today</h2>
            <p class="mb-8 text-lg md:text-xl">Sign up now and discover hundreds of venues and equipment</p>
            <Button label="Get Started" class="p-button-primary" @click="onNavigateAccount" />
        </section>

    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

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
    name: 'Homepage',
    setup() {
        const router = useRouter();
        const searchQuery = ref('');

        const featuredVenues: Venue[] = [
            { id: 1, name: 'Grand Ballroom', location: 'New York', price: 2500, image: 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?w=400' },
            { id: 2, name: 'Conference Hall', location: 'Los Angeles', price: 1800, image: 'https://images.unsplash.com/photo-1603430416744-a47cee46b0ae?w=400' },
            { id: 3, name: 'Garden Event Space', location: 'Chicago', price: 2000, image: 'https://images.unsplash.com/photo-1760972594010-e217e2f2845c?w=400' },
        ];

        const featuredEquipment: Equipment[] = [
            { id: 1, name: 'Professional Audio System', type: 'Audio', price: 350, image: 'https://images.unsplash.com/photo-1745848413083-cfea604edb6a?w=400' },
            { id: 2, name: 'Lighting Package', type: 'Lighting', price: 200, image: 'https://images.unsplash.com/photo-1582719478250-93f1b20a0372?w=400' },
            { id: 3, name: 'Projector & Screen', type: 'AV', price: 150, image: 'https://images.unsplash.com/photo-1582719478806-d1b4a4d5e734?w=400' },
        ];

        const onSearch = () => {
            router.push({ path: '/search', query: { q: searchQuery.value } });
        };

        const onNavigateAccount = () => {
            router.push('/account');
        };

        return { searchQuery, featuredVenues, featuredEquipment, onSearch, onNavigateAccount };
    }
});
</script>

<style scoped></style>
