// src/plugins/primevue.ts
import type { App } from 'vue'
import PrimeVue from 'primevue/config'

// Composants PrimeVue globaux
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

export default {
  install(app: App) {
    app.use(PrimeVue)
    app.component('Button', Button)
    app.component('InputText', InputText)
  }
}
