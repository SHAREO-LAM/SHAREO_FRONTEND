<template>
    <header class="header">
        <div class="container">
            <div class="content">

                <!-- Header Logo -->
                <Button text class="logo" @click="navigate('home')">
                    <div class="logo__icon">
                        <i class="pi pi-calendar"></i>
                    </div>
                    <span class="logo__text">VenueBook</span>
                </Button>


                <!-- Desktop navigation -->
                <nav class="nav nav--desktop">
                    <Button v-for="item in navItems" :key="item.value" text class="nav__item"
                        :class="{ active: currentPage === item.value }" @click="navigate(item.value)">
                        {{ item.label }}
                    </Button>
                </nav>

                <div class="actions">
                    <Button v-if="userRole === 'vendor'" outlined class="hidden-sm" @click="navigate('vendor')">
                        Vendor Dashboard
                    </Button>

                    <Button v-if="userRole === 'admin'" outlined class="hidden-sm" @click="navigate('admin')">
                        Admin Panel
                    </Button>

                    <Button text class="icon-button" @click="navigate('cart')">
                        <i class="pi pi-shopping-cart"></i>
                        <Badge v-if="cartItemCount > 0" :value="cartItemCount" severity="warning" class="cart-badge" />
                    </Button>

                    <Button text class="icon-button" @click="navigate('account')">
                        <i class="pi pi-user"></i>
                    </Button>

                    <!-- Mobile menu -->
                    <Button text class="icon-button mobile-only" @click="mobileMenuVisible = true">
                        <i class="pi pi-bars"></i>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Mobile Sidebar -->
        <Sidebar v-model:visible="mobileMenuVisible" position="right">
            <nav class="nav nav--mobile">
                <Button v-for="item in navItems" :key="item.value" text class="nav__item" @click="navigate(item.value)">
                    {{ item.label }}
                </Button>

                <Button v-if="userRole === 'vendor'" outlined @click="navigate('vendor')">
                    Vendor Dashboard
                </Button>

                <Button v-if="userRole === 'admin'" outlined @click="navigate('admin')">
                    Admin Panel
                </Button>
            </nav>
        </Sidebar>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'
import Badge from 'primevue/badge'

interface NavItem {
    label: string
    value: string
}

const props = withDefaults(
    defineProps<{
        currentPage: string
        userRole?: 'guest' | 'user' | 'vendor' | 'admin'
        cartItemCount?: number
    }>(),
    {
        userRole: 'guest',
        cartItemCount: 0
    }
)

const emit = defineEmits<{
    (e: 'navigate', page: string): void
}>()

const navItems: NavItem[] = [
    { label: 'Home', value: 'home' },
    { label: 'Browse Venues', value: 'search' },
    { label: 'How It Works', value: 'home' }
]

const mobileMenuVisible = ref(false)

function navigate(page: string) {
    emit('navigate', page)
    mobileMenuVisible.value = false
}
</script>
