<template>
  <div class="space-y-4">
    <AdminSectionHeader title="Demandes de Vendeurs" />

    <!-- DataTable -->
    <DataTable
      :value="filteredSellerRequests"
      :loading="isLoading"
      paginator
      :rows="10"
      responsive-layout="scroll"
      class="custom-datatable"
      striped-rows
      sortMode="multiple"
    >
      <template #header>
        <AdminTableToolbar
          v-model:search-value="sellerSearch"
          v-model:filter-value="sellerCityFilter"
          :filter-options="sellerCityFilterOptions"
          search-placeholder="Rechercher (entreprise, email, téléphone, siret)"
          filter-placeholder="Filtre ville"
          @reset="resetSellerFilters"
        />
      </template>

      <Column field="name" header="Nom de l'entreprise" style="width: 20%" sortable />
      <Column field="email" header="Email" style="width: 20%" sortable />
      <Column field="phone" header="Téléphone" style="width: 15%" sortable />
      <Column field="siret" header="SIRET" style="width: 12%" sortable>
        <template #body="slotProps">
          <span v-if="slotProps.data.siret" class="text-xs bg-gray-100 px-2 py-1 rounded">{{ slotProps.data.siret }}</span>
          <span v-else class="text-gray-400">-</span>
        </template>
      </Column>
      <Column field="city" header="Ville" style="width: 12%" sortable />
      <Column header="Actions" style="width: 21%">
        <template #body="slotProps">
          <Button
            icon="pi pi-info"
            label="Informations"
            severity="info"
            size="small"
            @click="approveSeller(slotProps.data)"
            class="mr-2"
          />
          <Button
            icon="pi pi-times"
            label="Rejeter"
            severity="danger"
            size="small"
            @click="rejectSeller(slotProps.data.companyId)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Approval Dialog -->
    <Dialog
      v-model:visible="approvalDialogVisible"
      header="Détails de l'entreprise"
      :modal="true"
      class="w-full md:w-2/3"
      @hide="resetApprovalDialog"
    >
      <div v-if="selectedRequest" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <p class="mt-1 text-gray-900">{{ selectedRequest.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <p class="mt-1 text-gray-900">{{ selectedRequest.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone</label>
            <p class="mt-1 text-gray-900">{{ selectedRequest.phone || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Forme juridique</label>
            <p class="mt-1 text-gray-900">{{ selectedRequest.legalForm || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">SIRET</label>
            <p class="mt-1 text-gray-900">{{ selectedRequest.siret || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">TVA</label>
            <p class="mt-1 text-gray-900">{{ selectedRequest.tvaNumber || '-' }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Adresse</label>
            <p class="mt-1 text-gray-900">
              {{
                `${selectedRequest.houseNumber || ''} ${selectedRequest.streetName || ''}`
                  .trim()
              }}
              <br />
              {{ selectedRequest.postcode }} {{ selectedRequest.city }} {{ selectedRequest.country }}
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <p class="mt-1 text-gray-900">{{ selectedRequest.description || '-' }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Annuler" severity="secondary" @click="approvalDialogVisible = false" />
        <Button label="Approuver" severity="success" @click="confirmApprove" :loading="isApproving" />
      </template>
    </Dialog>

    <!-- Empty State -->
    <AdminEmptyState
      v-if="!isLoading && sellerRequests.length === 0"
      message="Aucune demande de vendeur"
      icon="pi pi-inbox"
      container-class="py-12"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import AdminEmptyState from '@/ui/components/admin/components/AdminEmptyState.vue';
import AdminSectionHeader from '@/ui/components/admin/components/AdminSectionHeader.vue';
import AdminTableToolbar from '@/ui/components/admin/components/AdminTableToolbar.vue';
import { getCompanies, updateCompany, deleteCompany } from '@/services/company';
import { useAuthStore } from '@/stores/authStore';
import type { Company } from '@/types/company';

export default defineComponent({
  name: 'SellerRequestsManagement',
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    InputText,
    Dropdown,
    AdminEmptyState,
    AdminSectionHeader,
    AdminTableToolbar,
  },
  data() {
    return {
      sellerRequests: [] as Company[],
      sellerSearch: '',
      sellerCityFilter: 'all',
      isLoading: false,
      isApproving: false,
      approvalDialogVisible: false,
      selectedRequest: null as Company | null,
      sellerCityFilterOptions: [{ label: 'Toutes', value: 'all' }] as Array<{
        label: string;
        value: string;
      }>,
    };
  },
  methods: {
    resetSellerFilters() {
      this.sellerSearch = '';
      this.sellerCityFilter = 'all';
    },
    async loadSellerRequests() {
      this.isLoading = true;
      try {
        const allCompanies = await getCompanies();
        // Filtrer les entreprises non approuvées (status = "pending" ou similaire)
        // Adapter selon votre logique métier
        this.sellerRequests = allCompanies;
        this.sellerCityFilterOptions = [
          { label: 'Toutes', value: 'all' },
          ...Array.from(
            new Set(
              this.sellerRequests
                .map((company) => String(company.city || '').trim())
                .filter((city) => city.length > 0),
            ),
          )
            .sort((a, b) => a.localeCompare(b))
            .map((city) => ({ label: city, value: city })),
        ];
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les demandes',
          life: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    approveSeller(company: Company) {
      this.selectedRequest = company;
      this.approvalDialogVisible = true;
    },
    async confirmApprove() {
      if (!this.selectedRequest) return;

      const authStore = useAuthStore();
      if (!authStore.user?.userId) return;

      this.isApproving = true;
      try {
        // Ajouter un status "approved" ou mettre à jour selon votre logique
        await updateCompany((this.selectedRequest as any).companyId as string, {
          ...this.selectedRequest,
          companyId: (this.selectedRequest as any).companyId,
          userUpdateId: String(authStore.user.userId),
        });

        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Vendeur approuvé avec succès',
          life: 3000,
        });

        this.approvalDialogVisible = false;
        await this.loadSellerRequests();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Une erreur s\'est produite',
          life: 3000,
        });
      } finally {
        this.isApproving = false;
      }
    },
    async rejectSeller(companyId: string) {
      if (!confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) return;

      try {
        await deleteCompany(companyId);
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Demande rejetée',
          life: 3000,
        });
        await this.loadSellerRequests();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de rejeter la demande',
          life: 3000,
        });
      }
    },
    resetApprovalDialog() {
      this.selectedRequest = null;
    },
  },
  computed: {
    filteredSellerRequests(): Company[] {
      const search = this.sellerSearch.trim().toLowerCase();

      return this.sellerRequests.filter((company) => {
        const matchesSearch =
          search.length === 0 ||
          String(company.name || '').toLowerCase().includes(search) ||
          String(company.email || '').toLowerCase().includes(search) ||
          String(company.phone || '').toLowerCase().includes(search) ||
          String(company.siret || '').toLowerCase().includes(search);

        if (!matchesSearch) return false;

        if (this.sellerCityFilter !== 'all') {
          return String(company.city || '') === this.sellerCityFilter;
        }

        return true;
      });
    },
  },
  mounted() {
    this.loadSellerRequests();
  },
});
</script>
