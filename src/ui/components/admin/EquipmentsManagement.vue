<template>
  <div class="space-y-4">
    <AdminSectionHeader
      title="Gestion des Équipements"
      action-label="Ajouter un équipement"
      action-icon="pi pi-plus"
      @action="openCreateDialog"
    />

    <AdminTableToolbar
      v-model:search-value="equipmentSearch"
      v-model:filter-value="equipmentCompanyFilter"
      :filter-options="equipmentCompanyFilterOptions"
      search-placeholder="Rechercher (nom, description, société)"
      filter-placeholder="Filtre société"
      @reset="resetEquipmentFilters"
    />

    <!-- Equipments Grouped by Company -->
    <div v-if="isLoading" class="text-center py-8">
      <span class="text-gray-500">Chargement des équipements...</span>
    </div>

    <AdminEmptyState
      v-else-if="Object.keys(filteredGroupedEquipments).length === 0"
      message="Aucun équipement trouvé"
      container-class="py-8"
    />

    <Accordion v-else>
      <AccordionTab v-for="(equipmentGroup, companyId) in filteredGroupedEquipments" :key="companyId" :header="`${getCompanyName(companyId)} (${equipmentGroup.length} équipement${equipmentGroup.length > 1 ? 's' : ''})`">
        <DataTable
          :value="equipmentGroup"
          responsive-layout="scroll"
          class="custom-datatable"
          striped-rows
          sortMode="multiple"
        >
          <Column field="displayName" header="Nom" style="width: 25%" sortable />
          <Column field="stock" header="Quantité" style="width: 12%" sortable>
            <template #body="slotProps">
              <Tag :value="`${slotProps.data.stock}`" severity="info" />
            </template>
          </Column>
          <Column field="pricePerDay" header="Tarif Jour" style="width: 12%" sortable>
            <template #body="slotProps">
              <span class="font-semibold">{{ slotProps.data.pricePerDay }}€</span>
            </template>
          </Column>
          <Column field="description" header="Description" style="width: 25%" sortable>
            <template #body="slotProps">
              <span class="text-sm text-gray-600 truncate">{{ slotProps.data.description }}</span>
            </template>
          </Column>
          <Column header="Actions" style="width: 26%">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                severity="info"
                rounded
                text
                @click="editEquipment(slotProps.data)"
                class="mr-2"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                @click="deleteEquipment(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </AccordionTab>
    </Accordion>

    <!-- Dialog Create/Edit -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Ajouter un équipement' : 'Modifier l\'équipement'"
      :modal="true"
      class="w-full md:w-2/3"
      @hide="resetForm"
    >
      <form @submit.prevent="saveEquipment" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <InputText id="name" v-model="formData.name" type="text" class="w-full" />
          </div>

          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <InputNumber id="quantity" v-model="formData.quantity" :use-grouping="false" class="w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="dailyRate" class="block text-sm font-medium text-gray-700 mb-1">Tarif/Jour (€)</label>
            <InputNumber id="dailyRate" v-model="formData.dailyRate" :min-fraction-digits="2" class="w-full" />
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <Dropdown
              id="category"
              v-model="formData.equipmentCategoryId"
              :options="categories"
              option-label="name"
              option-value="id"
              placeholder="Sélectionner..."
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
        <Button label="Sauvegarder" @click="saveEquipment" :loading="isSaving" />
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
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import AdminEmptyState from '@/ui/components/admin/components/AdminEmptyState.vue';
import AdminSectionHeader from '@/ui/components/admin/components/AdminSectionHeader.vue';
import AdminTableToolbar from '@/ui/components/admin/components/AdminTableToolbar.vue';
import { getEquipementsCompany, createEquipementCompany, updateEquipementCompany, deleteEquipementCompany } from '@/services/equipementCompany';
import { getCompanies } from '@/services/company';
import { useAuthStore } from '@/stores/authStore';
import type { EquipementCompany, CreateEquipementCompany } from '@/types/equipementCompany';

interface FormData {
  name: string;
  quantity: number;
  dailyRate: number;
  description: string;
  equipmentCategoryId: string;
}

export default defineComponent({
  name: 'EquipmentsManagement',
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    InputText,
    InputNumber,
    Textarea,
    Dropdown,
    Tag,
    Accordion,
    AccordionTab,
    AdminEmptyState,
    AdminSectionHeader,
    AdminTableToolbar,
  },
  data() {
    return {
      equipments: [] as any[],
      groupedEquipments: {} as Record<string, any[]>,
      companies: [] as any[],
      companyMap: {} as Record<string, string>,
      categories: [] as any[],
      equipmentSearch: '',
      equipmentCompanyFilter: 'all',
      isLoading: false,
      isSaving: false,
      dialogVisible: false,
      dialogMode: 'create' as 'create' | 'edit',
      selectedEquipmentId: null as string | null,
      formData: {
        name: '',
        quantity: 1,
        dailyRate: 0,
        description: '',
        equipmentCategoryId: '',
      } as FormData,
      equipmentCompanyFilterOptions: [{ label: 'Toutes', value: 'all' }] as Array<{
        label: string;
        value: string;
      }>,
    };
  },
  methods: {
    resetEquipmentFilters() {
      this.equipmentSearch = '';
      this.equipmentCompanyFilter = 'all';
    },
    async loadEquipments() {
      this.isLoading = true;
      try {
        if (Object.keys(this.companyMap).length === 0) {
          await this.loadCompanies();
        }
        this.equipments = await getEquipementsCompany();
        this.groupEquipmentsByCompany();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les équipements',
          life: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    groupEquipmentsByCompany() {
      this.groupedEquipments = {};
      for (const equipment of this.equipments) {
        const companyId = equipment.companyId || 'Non assigné';
        if (!this.groupedEquipments[companyId]) {
          this.groupedEquipments[companyId] = [];
        }
        this.groupedEquipments[companyId].push(equipment);
      }
      // Trier par nom de compagnie
      const sortedGroupedEquipments: Record<string, any[]> = {};
      Object.keys(this.groupedEquipments)
        .sort((a, b) => this.getCompanyName(a).localeCompare(this.getCompanyName(b)))
        .forEach(key => {
          const group = this.groupedEquipments[key];
          if (group) {
            sortedGroupedEquipments[key] = group;
          }
        });
      this.groupedEquipments = sortedGroupedEquipments;
    },
    getCompanyName(companyId: string): string {
      return this.companyMap[companyId] || (companyId === 'Non assigné' ? 'Non assigné' : companyId);
    },
    async loadCompanies() {
      try {
        this.companies = await getCompanies();
        // Créer une map companyId -> companyName
        this.companyMap = {};
        for (const company of this.companies) {
          this.companyMap[(company as any).companyId] = (company as any).name || 'Sans nom';
        }
        this.equipmentCompanyFilterOptions = [
          { label: 'Toutes', value: 'all' },
          ...this.companies
            .map((company) => ({
              label: String((company as any).name || 'Sans nom'),
              value: String((company as any).companyId || ''),
            }))
            .filter((option) => option.value.length > 0)
            .sort((a, b) => a.label.localeCompare(b.label)),
        ];
      } catch (error: any) {
        console.error('Impossible de charger les entreprises', error);
      }
    },
    openCreateDialog() {
      this.dialogMode = 'create';
      this.resetForm();
      this.dialogVisible = true;
    },
    editEquipment(equipment: any) {
      this.dialogMode = 'edit';
      this.selectedEquipmentId = equipment.equipementCompanyId;
      this.formData = {
        name: equipment.displayName || '',
        quantity: equipment.stock ? parseInt(equipment.stock) : 1,
        dailyRate: equipment.pricePerDay || 0,
        description: equipment.description || '',
        equipmentCategoryId: equipment.equipementTypeId || '',
      };
      this.dialogVisible = true;
    },
    async saveEquipment() {
      const authStore = useAuthStore();
      if (!authStore.user?.userId) return;

      this.isSaving = true;
      try {
        if (this.dialogMode === 'create') {
          await createEquipementCompany({
            displayName: this.formData.name,
            stock: String(this.formData.quantity),
            pricePerDay: this.formData.dailyRate,
            description: this.formData.description,
            equipementTypeId: this.formData.equipmentCategoryId,
            companyId: '',
            userCreateId: String(authStore.user.userId),
          });
          this.$toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Équipement créé avec succès',
            life: 3000,
          });
        } else if (this.selectedEquipmentId) {
          await updateEquipementCompany(this.selectedEquipmentId, {
            displayName: this.formData.name,
            stock: String(this.formData.quantity),
            pricePerDay: this.formData.dailyRate,
            description: this.formData.description,
            equipementTypeId: this.formData.equipmentCategoryId,
            companyId: '',
            userUpdateId: String(authStore.user.userId),
          });
          this.$toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Équipement modifié avec succès',
            life: 3000,
          });
        }
        this.dialogVisible = false;
        await this.loadEquipments();
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
    async deleteEquipment(equipment: any) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) return;

      try {
        const equipmentId = equipment.equipementCompanyId;
        await deleteEquipementCompany(equipmentId);
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Équipement supprimé avec succès',
          life: 3000,
        });
        await this.loadEquipments();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de supprimer l\'équipement',
          life: 3000,
        });
      }
    },
    resetForm() {
      this.selectedEquipmentId = null;
      this.formData = {
        name: '',
        quantity: 1,
        dailyRate: 0,
        description: '',
        equipmentCategoryId: '',
      };
    },
  },
  computed: {
    filteredGroupedEquipments(): Record<string, any[]> {
      const search = this.equipmentSearch.trim().toLowerCase();
      const filteredEquipments = this.equipments.filter((equipment) => {
        const companyId = String(equipment.companyId || 'Non assigné');
        const companyName = this.getCompanyName(companyId).toLowerCase();
        const matchesSearch =
          search.length === 0 ||
          String(equipment.displayName || '').toLowerCase().includes(search) ||
          String(equipment.description || '').toLowerCase().includes(search) ||
          companyName.includes(search);

        if (!matchesSearch) return false;

        if (this.equipmentCompanyFilter !== 'all') {
          return companyId === this.equipmentCompanyFilter;
        }

        return true;
      });

      const grouped: Record<string, any[]> = {};
      for (const equipment of filteredEquipments) {
        const companyId = equipment.companyId || 'Non assigné';
        if (!grouped[companyId]) {
          grouped[companyId] = [];
        }
        grouped[companyId].push(equipment);
      }

      const sortedGrouped: Record<string, any[]> = {};
      Object.keys(grouped)
        .sort((a, b) => this.getCompanyName(a).localeCompare(this.getCompanyName(b)))
        .forEach((key) => {
          sortedGrouped[key] = grouped[key] || [];
        });

      return sortedGrouped;
    },
  },
  mounted() {
    this.loadCompanies();
    this.loadEquipments();
  },
});
</script>
