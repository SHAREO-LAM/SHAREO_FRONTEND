<template>
  <div class="admin-shell page-wrap">
    <div class="glass-panel admin-panel">
      <div class="mb-6">
        <h1 class="section-title">Admin Dashboard</h1>
        <p class="section-lead">Gérez les utilisateurs, les lieux, les équipements et les demandes de vendeurs.</p>
        <div class="color-strip mt-4" />
      </div>

      <TabView v-model:activeIndex="activeTabIndex" class="admin-tabs">
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

        <!-- Validated Companies Tab -->
        <TabPanel header="Entreprises" value="validated-companies" leftIcon="pi pi-building">
          <div class="py-4">
            <ValidatedCompaniesManagement ref="validatedCompaniesRef" />
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import UsersManagement from '@/ui/components/admin/UsersManagement.vue';
import DomainsManagement from '@/ui/components/admin/DomainsManagement.vue';
import EquipmentsManagement from '@/ui/components/admin/EquipmentsManagement.vue';
import SellerRequestsManagement from '@/ui/components/admin/SellerRequestsManagement.vue';
import ValidatedCompaniesManagement from '@/ui/components/admin/ValidatedCompaniesManagement.vue';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
  name: 'AdminDashboard',
  components: {
    Button,
    TabView,
    TabPanel,
    UsersManagement,
    DomainsManagement,
    EquipmentsManagement,
    SellerRequestsManagement,
    ValidatedCompaniesManagement,
  },
  data() {
    return {
      activeTabIndex: 0,
    };
  },
  methods: {
    async openCreateCompanyFromDashboard() {
      // Entreprises tab is the 5th tab (index 4)
      this.activeTabIndex = 4;
      await nextTick();

      const child = this.$refs.validatedCompaniesRef as any;
      if (child && typeof child.openCreateCompanyDialog === 'function') {
        child.openCreateCompanyDialog();
      }
    },
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
