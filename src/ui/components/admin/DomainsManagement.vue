<template>
  <div class="space-y-4">
    <AdminSectionHeader
      title="Gestion des Lieux"
      action-label="Ajouter un lieu"
      action-icon="pi pi-plus"
      @action="openCreateDialog"
    />

    <!-- DataTable -->
    <DataTable
      :value="filteredDomains"
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
          v-model:search-value="domainSearch"
          v-model:filter-value="domainCityFilter"
          :filter-options="domainCityFilterOptions"
          search-placeholder="Rechercher (nom, description, ville, code postal)"
          filter-placeholder="Filtre ville"
          @reset="resetDomainFilters"
        />
      </template>

      <Column field="name" header="Nom" style="width: 25%" sortable />
      <Column field="description" header="Description" style="width: 30%" sortable>
        <template #body="slotProps">
          <span class="text-sm text-gray-600 truncate">{{ slotProps.data.description }}</span>
        </template>
      </Column>
      <Column field="city" header="Ville" style="width: 15%" sortable />
      <Column field="postcode" header="Code Postal" style="width: 10%" sortable />
      <Column header="Actions" style="width: 20%">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            severity="info"
            rounded
            text
            @click="editDomain(slotProps.data)"
            class="mr-2"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            rounded
            text
            @click="deleteDomain(slotProps.data.domainId)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog Create/Edit -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Ajouter un lieu' : 'Modifier le lieu'"
      :modal="true"
      class="w-full md:w-2/3"
      @hide="resetForm"
    >
      <form @submit.prevent="saveDomain" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <InputText id="name" v-model="formData.name" type="text" class="w-full" />
          </div>

          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <InputText id="city" v-model="formData.city" type="text" class="w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="postcode" class="block text-sm font-medium text-gray-700 mb-1">Code Postal</label>
            <InputText id="postcode" v-model="formData.postcode" type="text" class="w-full" />
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <InputText id="country" v-model="formData.country" type="text" class="w-full" />
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea id="description" v-model="formData.description" rows="3" class="w-full" />
        </div>
      </form>

      <template #footer>
        <Button label="Annuler" severity="secondary" @click="dialogVisible = false" />
        <Button label="Sauvegarder" @click="saveDomain" :loading="isSaving" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import AdminSectionHeader from '@/ui/components/admin/components/AdminSectionHeader.vue';
import AdminTableToolbar from '@/ui/components/admin/components/AdminTableToolbar.vue';
import { getDomains, createDomain, updateDomain, deleteDomain } from '@/services/domain';
import { useAuthStore } from '@/stores/authStore';
import type { Domain, CreateDomain } from '@/types/domain';

interface FormData {
  name: string;
  description: string;
  city: string;
  postcode: string;
  country: string;
}

export default defineComponent({
  name: 'DomainsManagement',
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    InputText,
    Textarea,
    Dropdown,
    AdminSectionHeader,
    AdminTableToolbar,
  },
  data() {
    return {
      domains: [] as Domain[],
      domainSearch: '',
      domainCityFilter: 'all',
      isLoading: false,
      isSaving: false,
      dialogVisible: false,
      dialogMode: 'create' as 'create' | 'edit',
      selectedDomainId: null as string | null,
      formData: {
        name: '',
        description: '',
        city: '',
        postcode: '',
        country: '',
      } as FormData,
      domainCityFilterOptions: [{ label: 'Toutes', value: 'all' }] as Array<{
        label: string;
        value: string;
      }>,
    };
  },
  methods: {
    resetDomainFilters() {
      this.domainSearch = '';
      this.domainCityFilter = 'all';
    },
    async loadDomains() {
      this.isLoading = true;
      try {
        this.domains = await getDomains();
        this.domainCityFilterOptions = [
          { label: 'Toutes', value: 'all' },
          ...Array.from(
            new Set(
              this.domains
                .map((domain) => String(domain.city || '').trim())
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
          detail: 'Impossible de charger les lieux',
          life: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    openCreateDialog() {
      this.dialogMode = 'create';
      this.resetForm();
      this.dialogVisible = true;
    },
    editDomain(domain: Domain) {
      this.dialogMode = 'edit';
      this.selectedDomainId = (domain as any).domainId as string;
      this.formData = {
        name: domain.name || '',
        description: domain.description || '',
        city: domain.city || '',
        postcode: domain.postcode || '',
        country: domain.country || '',
      };
      this.dialogVisible = true;
    },
    async saveDomain() {
      const authStore = useAuthStore();
      if (!authStore.user?.userId) return;

      this.isSaving = true;
      try {
        // Use a fixed system company UUID for admin-created domains
        const systemCompanyId = '00000000-0000-0000-0000-000000000000';
        
        if (this.dialogMode === 'create') {
          await createDomain({
            name: this.formData.name,
            description: this.formData.description,
            city: this.formData.city,
            postcode: this.formData.postcode,
            country: this.formData.country,
            streetName: '',
            companyId: systemCompanyId,
            userCreateId: String(authStore.user.userId),
          });
          this.$toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Lieu créé avec succès',
            life: 3000,
          });
        } else if (this.selectedDomainId) {
          await updateDomain(this.selectedDomainId, {
            name: this.formData.name,
            description: this.formData.description,
            city: this.formData.city,
            postcode: this.formData.postcode,
            country: this.formData.country,
            streetName: '',
            userUpdateId: String(authStore.user.userId),
          });
          this.$toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Lieu modifié avec succès',
            life: 3000,
          });
        }
        this.dialogVisible = false;
        await this.loadDomains();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Une erreur s\'est produite',
          life: 3000,
        });
      } finally {
        this.isSaving = false;
      }
    },
    async deleteDomain(domainId: string) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return;

      try {
        await deleteDomain(domainId);
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Lieu supprimé avec succès',
          life: 3000,
        });
        await this.loadDomains();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de supprimer le lieu',
          life: 3000,
        });
      }
    },
    resetForm() {
      this.selectedDomainId = null;
      this.formData = {
        name: '',
        description: '',
        city: '',
        postcode: '',
        country: '',
      };
    },
  },
  computed: {
    filteredDomains(): Domain[] {
      const search = this.domainSearch.trim().toLowerCase();

      return this.domains.filter((domain) => {
        const matchesSearch =
          search.length === 0 ||
          String(domain.name || '').toLowerCase().includes(search) ||
          String(domain.description || '').toLowerCase().includes(search) ||
          String(domain.city || '').toLowerCase().includes(search) ||
          String(domain.postcode || '').toLowerCase().includes(search);

        if (!matchesSearch) return false;

        if (this.domainCityFilter !== 'all') {
          return String(domain.city || '') === this.domainCityFilter;
        }

        return true;
      });
    },
  },
  mounted() {
    this.loadDomains();
  },
});
</script>

<style scoped>
:deep(.custom-datatable) {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  font-weight: 600;
}

:deep(.p-inputtext),
:deep(.p-inputtextarea) {
  width: 100%;
  border-radius: 0.375rem;
}
</style>
