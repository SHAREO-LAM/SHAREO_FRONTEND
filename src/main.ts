import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVuePlugin from './plugins/primevue'
import App from './ui/App.vue'
import router from './router'

import './assets/tailwind.css'
import './assets/scss/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVuePlugin)
app.use(router)
app.mount('#app')
