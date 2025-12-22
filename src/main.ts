import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVuePlugin from './plugins/primevue'
import App from './views/App.vue'
import router from './router'
import '@/assets/styles/main.scss'
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import './styles/main.css';


const app = createApp(App)

app.use(createPinia())
app.use(PrimeVuePlugin)
app.use(router)
app.mount('#app')
