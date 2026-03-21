<template>
  <div class="p-4">
    <h3 class="text-xl font-semibold mb-4">Commandes de l'entreprise</h3>

    <DataTable
      :value="orders"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10,20,50]"
      sortMode="multiple"
      responsiveLayout="scroll"
      class="w-full border border-gray-200 rounded-lg shadow-sm"
    >

      <!-- Statut -->
      <Column field="status.name" header="Statut" sortable>
        <template #body="slotProps">
          <span
            :class="[
              'px-2 py-1 rounded-full font-semibold text-sm',
              statusColor(slotProps.data.status.code)
            ]"
          >
            {{ slotProps.data.status.name }}
          </span>
        </template>
      </Column>

      <!-- Utilisateur -->
      <Column field="user.login" header="Utilisateur" sortable />

      <!-- Montant -->
      <Column header="Montant total" sortable>
        <template #body="slotProps">
          {{ getTotalAmount(slotProps.data) }} €
        </template>
      </Column>

      <!-- Dates -->
      <Column header="Dates">
        <template #body="slotProps">
          <div v-for="item in slotProps.data.orderItems" :key="item.orderItemId">
            {{ formatDate(item.startDate) }} → {{ formatDate(item.endDate) }}
          </div>
        </template>
      </Column>

      <!-- Type -->
      <Column header="Type">
        <template #body="slotProps">
          <div v-for="item in slotProps.data.orderItems" :key="item.orderItemId">
            {{ item.domain ? 'Domaine' : item.equipementCompany ? 'Équipement' : 'N/A' }}
          </div>
        </template>
      </Column>

      <!-- Nom -->
      <Column header="Nom">
        <template #body="slotProps">
          <div v-for="item in slotProps.data.orderItems" :key="item.orderItemId">
            {{ item.domain?.name ?? item.equipementCompany?.displayName ?? 'N/A' }}
          </div>
        </template>
      </Column>

    </DataTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { Order } from '@/types/order'

export default defineComponent({
  name: 'CompanyOrdersTable',
  components: { DataTable, Column },

  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup() {

    const getTotalAmount = (order: Order) =>
      order.orderItems?.reduce(
        (sum, item) => sum + item.unitPrice * parseInt(item.quantity),
        0
      ) ?? 0

    const statusColor = (code: string) => {
      switch (code) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800'
        case 'PAID': return 'bg-green-100 text-green-800'
        case 'CANCELLED': return 'bg-red-100 text-red-800'
        case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
        default: return 'bg-gray-100 text-gray-700'
      }
    }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('fr-FR')
    }

    return {
      getTotalAmount,
      statusColor,
      formatDate
    }
  }
})
</script>