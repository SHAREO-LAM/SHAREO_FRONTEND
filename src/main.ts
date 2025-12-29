import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVuePlugin from './plugins/primevue';
import App from './ui/App.vue';
import router from './router';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import './assets/scss/main.scss';


const app = createApp(App)

app.use(createPinia())
app.use(PrimeVuePlugin)
app.use(router)
app.mount('#app')
