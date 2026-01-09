import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from "primevue/config"
import PrimeVuePlugin from './plugins/primevue';
import App from './ui/App.vue';
import router from './router';

import './assets/scss/main.scss';
import Aura from '@primevue/themes/aura'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVuePlugin)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(router)
app.mount('#app')
