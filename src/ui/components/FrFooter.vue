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
                        <li><Button class="footer-link-btn" label="Tous les lieux" link @click="navigate('domains')" /></li>
                        <li><Button class="footer-link-btn" label="Tous les équipements" link @click="navigate('equipments')" /></li>
                        <li><Button class="footer-link-btn" label="Mes commandes" link @click="navigate('orders')" /></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-subtitle">Professionnels</h4>
                    <ul class="footer-list">
                        <li><Button class="footer-link-btn" label="Devenir vendeur" link @click="navigate('become-seller')" /></li>
                        <li><Button class="footer-link-btn" label="Espace vendeur" link @click="navigate('vendor/dashboard')" /></li>
                        <li><Button class="footer-link-btn" label="Admin" link @click="navigate('admin')" /></li>
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

<style scoped lang="scss">
.footer-list {
    :deep(.footer-link-btn.p-button-link),
    :deep(.footer-link-btn.p-button-link .p-button-label),
    :deep(.footer-link-btn.p-button-link .pi) {
        color: #ffffff !important;
    }

    :deep(.footer-link-btn.p-button-link:hover),
    :deep(.footer-link-btn.p-button-link:hover .p-button-label),
    :deep(.footer-link-btn.p-button-link:hover .pi) {
        color: #ffffff !important;
    }
}
</style>
