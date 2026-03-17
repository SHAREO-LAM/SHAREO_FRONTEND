import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVuePlugin from './plugins/primevue'
import App from './ui/App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

import './assets/tailwind.css'
import './assets/scss/main.scss'
import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVuePlugin)

const authStore = useAuthStore()
await authStore.initialize()

app.use(router)

app.mount('#app')
