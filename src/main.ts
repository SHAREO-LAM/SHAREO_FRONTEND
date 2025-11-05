import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVuePlugin from './plugins/primevue'
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(PrimeVuePlugin)
app.use(router)
app.mount('#app')
