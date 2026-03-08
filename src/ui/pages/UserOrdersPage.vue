<template>
  <div class="container mx-auto px-4 py-8 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Mes commandes</h1>

    <!-- Chargement -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <ProgressSpinner />
    </div>

    <!-- Aucune commande -->
    <div
      v-else-if="orders.length === 0"
      class="bg-white rounded-xl shadow-md p-10 text-center text-gray-500"
    >
      <i class="pi pi-inbox text-4xl mb-4 block" />
      <p class="text-lg font-medium">Vous n'avez pas encore de commande</p>
    </div>

    <!-- Liste des commandes -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.orderId"
        class="bg-white rounded-xl shadow-md overflow-hidden"
      >

        <!-- ======= HEADER COMMANDE (cliquable) ======= -->
        <div
          class="p-6 cursor-pointer flex items-center justify-between gap-4 flex-wrap"
          @click="toggleOrder(order.orderId)"
        >
          <div class="flex items-center gap-6 flex-wrap">
            <div>
              <p class="text-xs text-gray-400 mb-1">Date</p>
              <p class="font-medium">{{ formatDate(order.datetimeCreate) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Total</p>
              <p class="font-semibold text-green-600">{{ formatPrice(computeTotal(order)) }} €</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Statut</p>
              <Tag :severity="getStatusSeverity(order.status?.name)" :value="order.status?.name || 'Inconnu'" />
            </div>
          </div>

          <i :class="['pi text-gray-400 transition-transform duration-200', expandedOrders.includes(order.orderId) ? 'pi-chevron-up' : 'pi-chevron-down']" />
        </div>

        <!-- ======= ACCORDÉON : ARTICLES ======= -->
        <div v-if="expandedOrders.includes(order.orderId)" class="border-t border-gray-100 px-6 pb-6 pt-4">
          <div class="space-y-3">
            <div
              v-for="item in order.orderItems"
              :key="item.orderItemId"
              class="p-4 bg-gray-50 rounded-lg"
            >

              <!-- ===== DESKTOP ===== -->
              <div class="hidden md:grid grid-cols-12 items-center gap-4">

                <div class="col-span-5 flex items-center gap-3">
                  <div :class="['w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', item.domain ? 'bg-blue-100' : 'bg-orange-100']">
                    <i :class="['text-sm', item.domain ? 'pi pi-map-marker text-blue-500' : 'pi pi-box text-orange-500']" />
                  </div>
                  <div>
                    <p class="font-medium text-sm">
                      {{ item.domain ? item.domain.name : item.equipementCompany?.displayName }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ item.domain ? 'Lieu' : 'Équipement' }}
                      <span v-if="getCompanyName(item)"> · {{ getCompanyName(item) }}</span>
                    </p>
                  </div>
                </div>

                <!-- Dates (3 cols) -->
                <div class="col-span-3 text-sm text-center">
                  <p class="text-xs text-gray-400 mb-1">Dates</p>
                  <p>{{ formatDate(item.startDate) }} → {{ formatDate(item.endDate) }}</p>
                </div>

                <!-- Quantité (1 col) -->
                <div class="col-span-1 text-sm text-center">
                  <p class="text-xs text-gray-400 mb-1">Qté</p>
                  <p>{{ item.domain ? '—' : item.quantity }}</p>
                </div>

                <!-- Prix unitaire (1 col) -->
                <div class="col-span-1 text-sm text-right">
                  <p class="text-xs text-gray-400 mb-1">Prix U.</p>
                  <p class="font-medium">{{ formatPrice(item.unitPrice) }} €</p>
                </div>

                <!-- Sous-total (2 cols) -->
                <div class="col-span-2 text-right">
                  <p class="text-xs text-gray-400 mb-1">Sous-total</p>
                  <p class="font-semibold text-green-600">{{ formatPrice(item.unitPrice * Number(item.quantity ?? 1)) }} €</p>
                </div>

              </div>

              <!-- ===== MOBILE ===== -->
              <div class="md:hidden space-y-2">

                <!-- Ligne 1 : icône + nom + quantité -->
                <div class="flex items-center gap-3">
                  <div :class="['w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', item.domain ? 'bg-blue-100' : 'bg-orange-100']">
                    <i :class="['text-sm', item.domain ? 'pi pi-map-marker text-blue-500' : 'pi pi-box text-orange-500']" />
                  </div>
                  <div>
                    <p class="font-medium text-sm">
                      {{ item.domain ? item.domain.name : item.equipementCompany?.displayName }}
                      <span v-if="!item.domain"> (x{{ item.quantity }})</span>
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ item.domain ? 'Lieu' : 'Équipement' }}
                      <span v-if="getCompanyName(item)"> · {{ getCompanyName(item) }}</span>
                    </p>
                  </div>
                </div>

                <!-- Ligne 2 : dates + sous-total -->
                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div class="text-sm">
                    <p class="text-xs text-gray-400 mb-1">Dates</p>
                    <p>{{ formatDate(item.startDate) }} → {{ formatDate(item.endDate) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-400 mb-1">Sous-total</p>
                    <p class="font-semibold text-green-600">{{ formatPrice(item.unitPrice * Number(item.quantity ?? 1)) }} €</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { getOrdersByUser } from '@/services/orders'

import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

export default defineComponent({
  name: 'OrdersPage',

  components: {
    Tag,
    ProgressSpinner,
  },

  data() {
    return {
      auth: useAuthStore(),
      orders: [] as any[],
      loading: true,
      expandedOrders: [] as string[],
    }
  },

  async mounted() {
    await this.fetchOrders()
  },

  methods: {
    async fetchOrders() {
      try {
        const userId = this.auth.user?.userId
        if (!userId) return
        const response = await getOrdersByUser(userId)
        this.orders = response.data
      } catch {
        this.$toast?.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger vos commandes.',
          life: 4000,
        })
      } finally {
        this.loading = false
      }
    },

    toggleOrder(orderId: string) {
      const idx = this.expandedOrders.indexOf(orderId)
      if (idx === -1) this.expandedOrders.push(orderId)
      else this.expandedOrders.splice(idx, 1)
    },

    computeTotal(order: any): number {
      return order.orderItems?.reduce((sum: number, item: any) => {
        return sum + item.unitPrice * Number(item.quantity ?? 1)
      }, 0) ?? 0
    },

    formatDate(date: string): string {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    },

    formatPrice(value: number): string {
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },

    getStatusSeverity(status?: string): string {
      const map: Record<string, string> = {
        'En attente': 'warn',
        'Confirmée': 'success',
        'Annulée': 'danger',
        'Terminée': 'info',
      }
      return map[status ?? ''] ?? 'secondary'
    },

    getCompanyName(item: any): string {
      if (item.domain) return item.domain.company?.name ?? ''
      return item.equipementCompany?.company?.name ?? ''
    },
  },
})
</script>
