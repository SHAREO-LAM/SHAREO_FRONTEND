<template>
  <div class="p-4">
    <h3 class="text-xl font-semibold mb-4">Commandes de l'entreprise</h3>
    <DataTable
      :value="orders"
      :loading="loading"
      responsiveLayout="scroll"
      class="w-full border border-gray-200 rounded-lg shadow-sm"
    >
      <!-- Statut avec couleur dynamique -->
      <Column field="status.name" header="Statut">
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
      <Column field="user.login" header="Utilisateur">
        <template #body="slotProps">
          <span class="text-gray-700">{{ slotProps.data.user.login }}</span>
        </template>
      </Column>

      <!-- Montant total -->
      <Column header="Montant total">
        <template #body="slotProps">
          <span class="font-medium text-gray-900">{{ getTotalAmount(slotProps.data) }} €</span>
        </template>
      </Column>

      <!-- Dates de réservation -->
      <Column header="Dates de réservation">
        <template #body="slotProps">
          <div class="flex flex-col space-y-1">
            <div v-for="item in slotProps.data.orderItems" :key="item.orderItemId">
              <span class="text-sm text-gray-600">
                {{ formatDate(item.startDate) }} → {{ formatDate(item.endDate) }}
              </span>
            </div>
          </div>
        </template>
      </Column>

      <!-- Type (Domaine ou Équipement) -->
      <Column header="Type">
        <template #body="slotProps">
          <div class="flex flex-col space-y-1">
            <div v-for="item in slotProps.data.orderItems" :key="item.orderItemId">
              <span class="text-sm text-gray-700">
                {{ item.domain ? 'Domaine' : item.equipementCompany ? 'Équipement' : 'N/A' }}
              </span>
            </div>
          </div>
        </template>
      </Column>

      <!-- Nom du Domaine ou Équipement -->
      <Column header="Nom">
        <template #body="slotProps">
          <div class="flex flex-col space-y-1">
            <div v-for="item in slotProps.data.orderItems" :key="item.orderItemId">
              <span class="text-sm text-gray-700">
                {{ item.domain?.name ?? item.equipementCompany?.displayName ?? 'N/A' }}
              </span>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import { Column } from 'primevue';
import type { Order } from '@/types/order';
import { getOrdersByCompany } from '@/services/orders';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
  name: 'CompanyOrdersTable',
  components: { DataTable, Column },

  setup() {
    const orders = ref<Order[]>([]);
    const loading = ref(false);

    const fetchOrders = async () => {
      loading.value = true;
      try {
        const authStore = useAuthStore();
        const data = await getOrdersByCompany(authStore.user?.companyId ?? '');
        orders.value = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      } finally {
        loading.value = false;
      }
    };

    const getTotalAmount = (order: Order) =>
      order.orderItems?.reduce((sum, item) => sum + item.unitPrice * parseInt(item.quantity), 0) ?? 0;

    const statusColor = (code: string) => {
      switch (code) {
        case 'PENDING':
          return 'bg-yellow-100 text-yellow-800';
        case 'PAID':
          return 'bg-green-100 text-green-800';
        case 'CANCELLED':
          return 'bg-red-100 text-red-800';
        case 'CONFIRMED':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    onMounted(fetchOrders);

    return { orders, loading, getTotalAmount, statusColor, formatDate };
  }
});
</script>