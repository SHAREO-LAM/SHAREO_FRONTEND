<template>
    <footer class="app-footer">
        <div class="footer-container">
            <div class="footer-grid">
                <!-- Brand -->
                <div class="footer-column">
                    <h3 class="footer-title">VenueBook</h3>
                    <p class="footer-description">
                        The easiest way to book venues and equipment for your events.
                    </p>
                </div>

                <!-- Customers -->
                <div class="footer-column">
                    <h4 class="footer-subtitle">For Customers</h4>
                    <ul class="footer-list">
                        <li>
                            <Button label="Browse Venues" link @click="navigate('search')" />
                        </li>
                        <li>
                            <Button label="Browse Equipment" link @click="navigate('search')" />
                        </li>
                        <li>
                            <Button label="How It Works" link />
                        </li>
                        <li>
                            <Button label="FAQ" link />
                        </li>
                    </ul>
                </div>

                <!-- Vendors -->
                <div class="footer-column">
                    <h4 class="footer-subtitle">For Vendors</h4>
                    <ul class="footer-list">
                        <li>
                            <Button label="List Your Venue" link @click="navigate('vendor')" />
                        </li>
                        <li>
                            <Button label="Vendor Dashboard" link @click="navigate('vendor')" />
                        </li>
                        <li>
                            <Button label="Pricing" link />
                        </li>
                        <li>
                            <Button label="Resources" link />
                        </li>
                    </ul>
                </div>

                <!-- Company -->
                <div class="footer-column">
                    <h4 class="footer-subtitle">Company</h4>
                    <ul class="footer-list">
                        <li>
                            <Button label="About Us" link />
                        </li>
                        <li>
                            <Button label="Contact" link />
                        </li>
                        <li>
                            <Button label="Privacy Policy" link />
                        </li>
                        <li>
                            <Button label="Terms of Service" link />
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2025 VenueBook. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

const navigate = (route: string) => {
    router.push({ path: `/${route}` });
};
</script>
