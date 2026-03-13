<template>
    <footer class="app-footer">
        <div class="footer-container">
            <div class="footer-grid">
                <!-- Brand -->
                <div class="footer-column">
                    <h3 class="footer-title">SHAREO</h3>
                    <p class="footer-description">
                        Le moyen le plus simple de réserver des salles et du matériel pour vos événements.
                    </p>
                </div>

                <!-- Customers -->
                <div class="footer-column">
                    <h4 class="footer-subtitle">Particuliers</h4>
                    <ul class="footer-list">
                        <li>
                            <Button label="Parcourir les lieux" link @click="navigate('domains')" />
                        </li>
                        <li>
                            <Button label="Parcourir le matériel" link @click="navigate('equipments')" />
                        </li>
                    </ul>
                </div>

                <!-- Vendors -->
                <div class="footer-column">
                    <h4 class="footer-subtitle">Professionnels</h4>
                    <ul class="footer-list">
                        <li>
                            <Button label="Proposer un equipement ou un lieu" link @click="navigate('become-seller')" />
                        </li>
                        <li>
                            <Button label="Espace entreprise" link @click="navigate('become-seller')" />
                        </li>
                    </ul>
                </div>

                <!-- Company -->
                <div class="hidden">
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
                <p>© 2025 SHAREO. All rights reserved.</p>
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
