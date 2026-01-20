<template>
    <header class="header">
        <div class="container">
            <div class="content">

                <!-- Header Logo -->
                <Button
                    text
                    class="logo"
                    icon="pi pi-calendar"
                    label="VenueBook"
                    @click="navigate('home')"
                />

                <!-- Desktop navigation -->
                <nav class="nav nav--desktop">
                    <Button
                        v-for="item in navItems"
                        :key="item.value"
                        text
                        class="nav-item bg-color-secondary"
                        :class="{ active: currentPage === item.value }"
                        :label="item.label"
                        @click="navigate(item.value)"
                    />
                </nav>

                <div class="actions">
                    <Button
                        v-if="userRole === 'vendor'"
                        outlined
                        class="hidden-sm"
                        label="Vendor Dashboard"
                        @click="navigate('vendor')"
                    />

                    <Button
                        v-if="userRole === 'admin'"
                        outlined
                        class="hidden-sm"
                        label="Admin Panel"
                        @click="navigate('admin')"
                    />

                    <Button
                        text
                        class="icon-button"
                        icon="pi pi-shopping-cart"
                        @click="navigate('cart')"
                        :badge="String(cart.cartItems.length)"
                        badge-severity="warn"
                    >
                    </Button>

                    <Button
                        text
                        class="icon-button"
                        icon="pi pi-user"
                        @click="navigate('account')"
                    />

                    <!-- Mobile menu -->
                    <Button
                        text
                        class="icon-button mobile-only"
                        icon="pi pi-bars"
                        @click="mobileMenuVisible = true"
                    />
                </div>
            </div>
        </div>

        <!-- Mobile Drawer -->
        <Drawer v-model:visible="mobileMenuVisible" position="right">
            <nav class="nav nav--mobile">
                <Button
                    v-for="item in navItems"
                    :key="item.value"
                    text
                    class="nav__item"
                    :label="item.label"
                    @click="navigate(item.value)"
                />

                <Button
                    v-if="userRole === 'vendor'"
                    outlined
                    label="Vendor Dashboard"
                    @click="navigate('vendor')"
                />

                <Button
                    v-if="userRole === 'admin'"
                    outlined
                    label="Admin Panel"
                    @click="navigate('admin')"
                />
            </nav>
        </Drawer>

    </header>
</template>


<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';
import { ref } from 'vue'

interface NavItem {
    label: string
    value: string
}

const cart = useCartStore();

const props = withDefaults(
    defineProps<{
        currentPage: string
        userRole?: 'guest' | 'user' | 'vendor' | 'admin'
    }>(),
    {
        userRole: 'guest',
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
