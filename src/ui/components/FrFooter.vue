<template>
    <footer class="app-footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-column">
                    <h3 class="footer-title">SHAREO</h3>
                    <p class="footer-description">
                        Plateforme de location nouvelle génération pour trouver un lieu, ajouter du matériel et réserver en quelques clics.
                    </p>
                </div>

                <div class="footer-column">
                    <h4 class="footer-subtitle">Explorer</h4>
                    <ul class="footer-list">
                        <li><Button label="Tous les lieux" link @click="navigate('domains')" /></li>
                        <li><Button label="Tous les équipements" link @click="navigate('equipments')" /></li>
                        <li><Button label="Mes commandes" link @click="navigate('orders')" /></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-subtitle">Professionnels</h4>
                    <ul class="footer-list">
                        <li><Button label="Devenir vendeur" link @click="navigate('become-seller')" /></li>
                        <li><Button label="Espace vendeur" link @click="navigate('vendor/dashboard')" /></li>
                        <li><Button label="Admin" link @click="navigate('admin')" /></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2026 SHAREO</p>
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
