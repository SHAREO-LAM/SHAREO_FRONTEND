import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVuePlugin from './plugins/primevue'
import ToastService from 'primevue/toastservice';
import App from './ui/App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

import './assets/tailwind.css'
import './assets/scss/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVuePlugin)
app.use(ToastService)
app.use(router)

const authStore = useAuthStore()
await authStore.initialize()

app.mount('#app')
