<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Gérez les utilisateurs, les lieux, les équipements et les demandes de vendeurs</p>
      </div>

      <!-- Tabs -->
      <TabView class="custom-tabs">
        <!-- Users Tab -->
        <TabPanel header="Utilisateurs" value="users" leftIcon="pi pi-users">
          <div class="py-4">
            <UsersManagement />
          </div>
        </TabPanel>

        <!-- Domains Tab -->
        <TabPanel header="Lieux" value="domains" leftIcon="pi pi-map">
          <div class="py-4">
            <DomainsManagement />
          </div>
        </TabPanel>

        <!-- Equipments Tab -->
        <TabPanel header="Équipements" value="equipments" leftIcon="pi pi-inbox">
          <div class="py-4">
            <EquipmentsManagement />
          </div>
        </TabPanel>

        <!-- Seller Requests Tab -->
        <TabPanel header="Demandes Vendeurs" value="requests" leftIcon="pi pi-shopping-bag">
          <div class="py-4">
            <SellerRequestsManagement />
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import UsersManagement from '@/ui/components/admin/UsersManagement.vue';
import DomainsManagement from '@/ui/components/admin/DomainsManagement.vue';
import EquipmentsManagement from '@/ui/components/admin/EquipmentsManagement.vue';
import SellerRequestsManagement from '@/ui/components/admin/SellerRequestsManagement.vue';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
  name: 'AdminDashboard',
  components: {
    TabView,
    TabPanel,
    UsersManagement,
    DomainsManagement,
    EquipmentsManagement,
    SellerRequestsManagement,
  },
  mounted() {
    const authStore = useAuthStore();
    if (!authStore.isAdmin && !authStore.isSuperAdmin) {
      this.$router.push('/');
      this.$toast.add({
        severity: 'error',
        summary: 'Accès refusé',
        detail: 'Vous n\'avez pas accès au dashboard admin.',
        life: 3000,
      });
    }
  },
});
</script>

<style scoped>
:deep(.custom-tabs .p-tabview-nav) {
  background-color: white;
  border-bottom: 2px solid #e5e7eb;
}

:deep(.custom-tabs .p-tabview-nav button) {
  color: #6b7280;
  font-weight: 500;
  border: none;
}

:deep(.custom-tabs .p-tabview-nav button:hover) {
  background-color: #f3f4f6;
  color: #111827;
}

:deep(.custom-tabs .p-tabview-nav button.p-tabview-selected) {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

:deep(.custom-tabs .p-tabview-panels) {
  padding: 2rem 0;
}
</style>
