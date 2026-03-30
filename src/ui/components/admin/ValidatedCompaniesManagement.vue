<template>
  <div class="space-y-4">
    <AdminSectionHeader
      title="Entreprises"
      action-label="Ajouter une entreprise"
      action-icon="pi pi-plus"
      @action="openCreateCompanyDialog"
    />

    <DataTable
      :value="filteredCompanies"
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
          v-model:search-value="companySearch"
          v-model:filter-value="companyCityFilter"
          :filter-options="companyCityFilterOptions"
          search-placeholder="Rechercher (nom, email, téléphone, siret)"
          filter-placeholder="Filtre ville"
          @reset="resetFilters"
        />
      </template>

      <Column field="name" header="Entreprise" style="width: 20%" sortable />
      <Column field="email" header="Email" style="width: 22%" sortable />
      <Column field="phone" header="Téléphone" style="width: 14%" sortable />
      <Column field="city" header="Ville" style="width: 12%" sortable />
      <Column field="status" header="Statut" style="width: 12%" sortable>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.status === 'VALIDATED' ? 'Validée' : 'En attente'"
            :severity="slotProps.data.status === 'VALIDATED' ? 'success' : 'warning'"
          />
        </template>
      </Column>
      <Column header="Actions" style="width: 20%">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            severity="info"
            rounded
            text
            class="mr-2"
            @click="editCompany(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            rounded
            text
            @click="deleteValidatedCompany(slotProps.data.companyId as string)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Ajouter une entreprise' : 'Modifier une entreprise validée'"
      :modal="true"
      class="w-full md:w-2/3"
      @hide="resetForm"
    >
      <form @submit.prevent="saveCompany" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <InputText id="name" v-model="formData.name" type="text" class="w-full" />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <InputText id="email" v-model="formData.email" type="text" class="w-full" />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <InputText id="phone" v-model="formData.phone" type="text" class="w-full" />
          </div>

          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <InputText id="city" v-model="formData.city" type="text" class="w-full" />
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <InputText id="country" v-model="formData.country" type="text" class="w-full" />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <Dropdown
              id="status"
              v-model="formData.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea id="description" v-model="formData.description" rows="3" class="w-full" />
        </div>
      </form>

      <template #footer>
        <Button label="Annuler" severity="secondary" @click="dialogVisible = false" />
        <Button label="Sauvegarder" :loading="isSaving" @click="saveCompany" />
      </template>
    </Dialog>

    <AdminEmptyState
      v-if="!isLoading && companies.length === 0"
      message="Aucune entreprise validée"
      icon="pi pi-building"
      container-class="py-10"
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
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import AdminEmptyState from '@/ui/components/admin/components/AdminEmptyState.vue';
import AdminSectionHeader from '@/ui/components/admin/components/AdminSectionHeader.vue';
import AdminTableToolbar from '@/ui/components/admin/components/AdminTableToolbar.vue';
import { createCompany, getValidatedCompanies, updateCompany, deleteCompany } from '@/services/company';
import type { Company, CompanyStatus } from '@/types/company';
import { useAuthStore } from '@/stores/authStore';

interface FormData {
  companyId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  description: string;
  status: CompanyStatus;
}

export default defineComponent({
  name: 'ValidatedCompaniesManagement',
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    InputText,
    Textarea,
    Dropdown,
    Tag,
    AdminEmptyState,
    AdminSectionHeader,
    AdminTableToolbar,
  },
  data() {
    return {
      companies: [] as Company[],
      companySearch: '',
      companyCityFilter: 'all',
      companyCityFilterOptions: [{ label: 'Toutes', value: 'all' }] as Array<{ label: string; value: string }>,
      isLoading: false,
      isSaving: false,
      dialogVisible: false,
      dialogMode: 'edit' as 'create' | 'edit',
      statusOptions: [
        { label: 'En attente', value: 'PENDING_VALIDATION' },
        { label: 'Validée', value: 'VALIDATED' },
      ] as Array<{ label: string; value: CompanyStatus }>,
      formData: {
        companyId: '',
        name: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        description: '',
        status: 'VALIDATED' as CompanyStatus,
      } as FormData,
    };
  },
  methods: {
    openCreateCompanyDialog() {
      this.resetForm();
      this.dialogMode = 'create';
      this.dialogVisible = true;
    },
    resetFilters() {
      this.companySearch = '';
      this.companyCityFilter = 'all';
    },
    async loadValidatedCompanies() {
      this.isLoading = true;
      try {
        this.companies = await getValidatedCompanies();
        this.companyCityFilterOptions = [
          { label: 'Toutes', value: 'all' },
          ...Array.from(
            new Set(
              this.companies
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
          detail: 'Impossible de charger les entreprises validées',
          life: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    editCompany(company: Company) {
      this.dialogMode = 'edit';
      this.formData = {
        companyId: String((company as any).companyId || ''),
        name: String(company.name || ''),
        email: String(company.email || ''),
        phone: String(company.phone || ''),
        city: String(company.city || ''),
        country: String(company.country || ''),
        description: String(company.description || ''),
        status: ((company.status || 'VALIDATED') as CompanyStatus),
      };
      this.dialogVisible = true;
    },
    async saveCompany() {
      const authStore = useAuthStore();
      if (!authStore.user?.userId) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Utilisateur non connecté',
          life: 3000,
        });
        return;
      }

      if (!this.formData.name.trim()) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Champ requis',
          detail: 'Le nom de l\'entreprise est obligatoire',
          life: 3000,
        });
        return;
      }

      this.isSaving = true;
      try {
        if (this.dialogMode === 'create') {
          await createCompany({
            name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone,
            city: this.formData.city,
            country: this.formData.country,
            description: this.formData.description,
            status: this.formData.status,
            userCreateId: String(authStore.user.userId),
          });
        } else {
          if (!this.formData.companyId) {
            this.$toast.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Identifiant entreprise manquant',
              life: 3000,
            });
            return;
          }

          await updateCompany(this.formData.companyId, {
            name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone,
            city: this.formData.city,
            country: this.formData.country,
            description: this.formData.description,
            status: this.formData.status,
            userUpdateId: String(authStore.user.userId),
          });
        }

        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: this.dialogMode === 'create' ? 'Entreprise créée' : 'Entreprise mise à jour',
          life: 3000,
        });

        this.dialogVisible = false;
        await this.loadValidatedCompanies();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de mettre à jour l\'entreprise',
          life: 3000,
        });
      } finally {
        this.isSaving = false;
      }
    },
    async deleteValidatedCompany(companyId: string) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise validée ?')) return;

      try {
        await deleteCompany(companyId);
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Entreprise supprimée',
          life: 3000,
        });
        await this.loadValidatedCompanies();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de supprimer l\'entreprise',
          life: 3000,
        });
      }
    },
    resetForm() {
      this.formData = {
        companyId: '',
        name: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        description: '',
        status: 'VALIDATED',
      };
    },
  },
  computed: {
    filteredCompanies(): Company[] {
      const search = this.companySearch.trim().toLowerCase();

      return this.companies.filter((company) => {
        const matchesSearch =
          search.length === 0 ||
          String(company.name || '').toLowerCase().includes(search) ||
          String(company.email || '').toLowerCase().includes(search) ||
          String(company.phone || '').toLowerCase().includes(search) ||
          String(company.siret || '').toLowerCase().includes(search);

        if (!matchesSearch) return false;

        if (this.companyCityFilter !== 'all') {
          return String(company.city || '') === this.companyCityFilter;
        }

        return true;
      });
    },
  },
  mounted() {
    this.loadValidatedCompanies();
  },
});
</script>
