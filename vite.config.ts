import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('/node_modules/primevue/')) {
            const primevuePath = id.split('/node_modules/primevue/')[1]
            const moduleName = primevuePath?.split('/')[0]
            return moduleName ? `primevue-${moduleName}` : 'primevue-core'
          }

          if (id.includes('/node_modules/@primeuix/')) {
            return 'primevue-theme'
          }

          if (id.includes('/node_modules/primeicons/')) {
            return 'primeicons'
          }

          if (
            id.includes('/node_modules/vue/') ||
            id.includes('/node_modules/@vue/') ||
            id.includes('/node_modules/pinia/') ||
            id.includes('/node_modules/vue-router/')
          ) {
            return 'vue-core'
          }

          return 'vendor'
        },
      },
    },
  },
})
