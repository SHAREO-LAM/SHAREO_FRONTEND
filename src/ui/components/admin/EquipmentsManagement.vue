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
          <Column header="Image" style="width: 10%">
            <template #body="slotProps">
              <img
                v-if="(slotProps.data.imageUrls && slotProps.data.imageUrls.length > 0) || slotProps.data.imageUrl"
                :src="(slotProps.data.imageUrls && slotProps.data.imageUrls.length > 0) ? slotProps.data.imageUrls[0] : slotProps.data.imageUrl"
                alt="Image de l'équipement"
                class="h-12 w-16 rounded object-cover"
              />
              <span v-else class="text-xs text-gray-400">Aucune</span>
            </template>
          </Column>
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
                icon="pi pi-link"
                severity="secondary"
                rounded
                text
                @click="goToEquipmentProduct(slotProps.data.equipementCompanyId)"
                class="mr-1"
                aria-label="Ouvrir la page produit de l'équipement"
              />
              <Button
                icon="pi pi-pencil"
                severity="info"
                rounded
                text
                @click="editEquipment(slotProps.data)"
                class="mr-1"
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
      <form @submit.prevent="saveEquipment" class="space-y-4" aria-label="Formulaire équipement admin">
        <div>
          <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
          <Dropdown
            id="company"
            v-model="formData.companyId"
            :options="companies"
            option-label="name"
            option-value="companyId"
            placeholder="Sélectionner une entreprise"
            class="w-full"
          />
        </div>

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
            <div class="relative">
              <input
                id="category"
                v-model="formData.equipmentCategoryInput"
                type="text"
                class="p-inputtext p-component w-full"
                :class="isCategoryInputOpen ? 'rounded-b-none border-b-0' : ''"
                autocomplete="off"
                aria-describedby="equipment-category-help"
                aria-controls="equipment-category-suggestions"
                :aria-expanded="isCategoryInputOpen ? 'true' : 'false'"
                @focus="onCategoryInputFocus"
                @blur="onCategoryInputBlur"
              />

              <div
                v-if="isCategoryInputOpen"
                id="equipment-category-suggestions"
                class="absolute left-0 right-0 z-20 rounded-b-md border border-gray-200 bg-white shadow-lg max-h-52 overflow-auto"
                role="listbox"
                aria-label="Suggestions de catégories"
              >
                <ul class="py-1">
                  <li v-for="suggestion in equipmentCategorySuggestions" :key="suggestion.id">
                    <button
                      type="button"
                      class="w-full text-left text-sm px-3 py-2 hover:bg-orange-50 focus:outline-none focus:bg-orange-50"
                      @mousedown.prevent="selectEquipmentCategorySuggestion(suggestion.name, suggestion.id)"
                    >
                      {{ suggestion.name }}
                    </button>
                  </li>
                  <li v-if="equipmentCategorySuggestions.length === 0" class="px-3 py-2 text-sm text-gray-500">
                    Aucun résultat. Continuez à écrire pour créer.
                  </li>
                </ul>
              </div>
            </div>
            <small id="equipment-category-help" class="text-gray-500 block mt-1">
              La saisie cherche parmi l'existant. Si introuvable, la catégorie/type sera créé automatiquement.
            </small>
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea id="description" v-model="formData.description" rows="3" class="w-full" />
        </div>

        <div v-if="dialogMode === 'create'" class="space-y-2">
          <label for="equipment-create-images" class="block text-sm font-medium text-gray-700 mb-1">
            Photos a televerser apres creation (max 5)
          </label>
          <input
            id="equipment-create-images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            class="block w-full text-sm"
            aria-describedby="equipment-images-help"
            @change="onCreateImagesSelected"
          />
          <p id="equipment-images-help" class="text-xs text-gray-500">
            Formats acceptés: PNG, JPEG, WEBP. Jusqu'à 5 images.
          </p>
          <div v-if="pendingCreateImages.length > 0" class="space-y-1">
            <div
              v-for="(file, index) in pendingCreateImages"
              :key="`${file.name}-${index}`"
              class="flex items-center justify-between text-sm"
            >
              <span class="truncate mr-2">{{ file.name }}</span>
              <Button
                icon="pi pi-times"
                severity="secondary"
                rounded
                text
                @click="removePendingCreateImage(index)"
              />
            </div>
          </div>
        </div>

        <div v-if="selectedEquipmentId">
          <ImageGalleryManager
            :imageUrls="selectedEquipmentImageUrls"
            :isLoading="isImageSaving"
            @upload="(file) => uploadEquipmentImageHandler(file)"
            @remove="(index) => removeEquipmentImageHandler(index)"
          />
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
import ImageGalleryManager from '@/ui/components/ImageGalleryManager.vue';
import {
  getEquipementsCompany,
  createEquipementCompany,
  updateEquipementCompany,
  deleteEquipementCompany,
  uploadEquipementImage,
  deleteEquipementImage,
} from '@/services/equipementCompany';
import {
  fetchEquipementTypes,
  fetchEquipementCategories,
  createEquipementCategory,
  createEquipementType,
} from '@/services/equipement';
import router from '@/router';
import { getValidatedCompanies } from '@/services/company';
import { useAuthStore } from '@/stores/authStore';
import type { EquipementCompany, CreateEquipementCompany } from '@/types/equipementCompany';
import { UI } from '@/constants/const';

interface FormData {
  companyId: string;
  name: string;
  quantity: number;
  dailyRate: number;
  description: string;
  equipmentCategoryId: string;
  equipmentCategoryInput: string;
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
    ImageGalleryManager,
  },
  data() {
    return {
      equipments: [] as any[],
      groupedEquipments: {} as Record<string, any[]>,
      companies: [] as any[],
      companyMap: {} as Record<string, string>,
      categories: [] as any[],
      equipmentCategories: [] as any[],
      equipmentSearch: '',
      equipmentCompanyFilter: 'all',
      isLoading: false,
      isSaving: false,
      dialogVisible: false,
      dialogMode: 'create' as 'create' | 'edit',
      selectedEquipmentId: null as string | null,
      formData: {
        companyId: '',
        name: '',
        quantity: 1,
        dailyRate: 0,
        description: '',
        equipmentCategoryId: '',
        equipmentCategoryInput: '',
      } as FormData,
      equipmentCompanyFilterOptions: [{ label: 'Toutes', value: 'all' }] as Array<{
        label: string;
        value: string;
      }>,
      selectedEquipmentFile: null as File | null,
      pendingCreateImages: [] as File[],
      selectedEquipmentImageUrl: '' as string,
      selectedEquipmentImageUrls: [] as string[],
      isImageSaving: false,
      isCategoryInputFocused: false,
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
        if (this.categories.length === 0) {
          await this.loadEquipmentTypes();
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
        this.companies = await getValidatedCompanies();
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
        console.error('Impossible de charger les entreprises validées', error);
      }
    },
    async loadEquipmentTypes() {
      try {
        const equipementTypes = await fetchEquipementTypes();
        this.categories = (equipementTypes || []).map((type: any) => ({
          id: String(type.equipementTypeId || type.id || ''),
          name: String(type.name || ''),
          code: String(type.code || ''),
          equipementCategoryId: String(type.equipementCategoryId || ''),
        })).filter((type: { id: string; name: string }) => type.id.length > 0);
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les types d\'équipement',
          life: 3000,
        });
      }
    },
    async loadEquipmentCategories() {
      try {
        const categories = await fetchEquipementCategories();
        this.equipmentCategories = (categories || []).map((category: any) => ({
          id: String(category.equipementCategoryId || category.id || ''),
          name: String(category.name || ''),
          code: String(category.code || ''),
        })).filter((category: { id: string }) => category.id.length > 0);
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les catégories d\'équipement',
          life: 3000,
        });
      }
    },
    normalizeLabel(value: string): string {
      return String(value || '').trim().toLowerCase();
    },
    toCode(value: string): string {
      return String(value || '')
        .normalize('NFD')
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toUpperCase();
    },
    uniqueCode(baseValue: string, usedCodes: Set<string>): string {
      const safeBase = this.toCode(baseValue) || 'CATEGORY';
      if (!usedCodes.has(safeBase)) return safeBase;

      let index = 2;
      let candidate = `${safeBase}_${index}`;
      while (usedCodes.has(candidate)) {
        index += 1;
        candidate = `${safeBase}_${index}`;
      }
      return candidate;
    },
    async resolveEquipmentTypeId(): Promise<string> {
      const authStore = useAuthStore();
      const inputName = String(this.formData.equipmentCategoryInput || '').trim();

      if (!inputName) return '';

      const normalizedInput = this.normalizeLabel(inputName);
      const matchedType = this.categories.find(
        (type) => this.normalizeLabel(type.name) === normalizedInput,
      );

      if (matchedType?.id) {
        this.formData.equipmentCategoryId = String(matchedType.id);
        this.formData.equipmentCategoryInput = String(matchedType.name);
        return String(matchedType.id);
      }

      if (this.equipmentCategories.length === 0) {
        await this.loadEquipmentCategories();
      }

      const usedCodes = new Set<string>([
        ...this.equipmentCategories.map((item: any) => String(item.code || '').toUpperCase()),
        ...this.categories.map((item: any) => String(item.code || '').toUpperCase()),
      ]);

      let category = this.equipmentCategories.find(
        (item) => this.normalizeLabel(item.name) === normalizedInput,
      );

      if (!category) {
        const categoryCode = this.uniqueCode(inputName, usedCodes);
        const createdCategory = await createEquipementCategory({
          name: inputName,
          code: categoryCode,
          userCreateId: String(authStore.user?.userId || ''),
        });

        category = {
          id: String(createdCategory.equipementCategoryId || createdCategory.id || ''),
          name: String(createdCategory.name || inputName),
          code: String(createdCategory.code || categoryCode),
        };
      }

      const typeCode = this.uniqueCode(inputName, usedCodes);
      const createdType = await createEquipementType({
        name: inputName,
        code: typeCode,
        equipementCategoryId: String(category.id),
        userCreateId: String(authStore.user?.userId || ''),
      });

      const createdTypeId = String(createdType.equipementTypeId || createdType.id || '');

      await this.loadEquipmentTypes();
      await this.loadEquipmentCategories();

      this.formData.equipmentCategoryId = createdTypeId;
      this.formData.equipmentCategoryInput = inputName;

      return createdTypeId;
    },
    selectEquipmentCategorySuggestion(name: string, id: string) {
      this.formData.equipmentCategoryInput = String(name || '');
      this.formData.equipmentCategoryId = String(id || '');
      this.isCategoryInputFocused = false;
    },
    onCategoryInputFocus() {
      this.isCategoryInputFocused = true;
    },
    onCategoryInputBlur() {
      setTimeout(() => {
        this.isCategoryInputFocused = false;
      }, 120);
    },
    openCreateDialog() {
      this.dialogMode = 'create';
      this.resetForm();
      this.dialogVisible = true;
    },
    editEquipment(equipment: any) {
      this.dialogMode = 'edit';
      this.selectedEquipmentId = equipment.equipementCompanyId;
      this.selectedEquipmentFile = null;
      this.selectedEquipmentImageUrl = String(equipment.imageUrl || '');
      this.selectedEquipmentImageUrls = equipment.imageUrls || [equipment.imageUrl || ''].filter(Boolean);
      this.formData = {
        companyId: String(equipment.companyId || ''),
        name: equipment.displayName || '',
        quantity: equipment.stock ? parseInt(equipment.stock) : 1,
        dailyRate: equipment.pricePerDay || 0,
        description: equipment.description || '',
        equipmentCategoryId: equipment.equipementTypeId || '',
        equipmentCategoryInput: String(
          equipment.equipementType?.name ||
          this.categories.find((item) => String(item.id) === String(equipment.equipementTypeId || ''))?.name ||
          '',
        ),
      };
      this.dialogVisible = true;
    },
    async saveEquipment() {
      const authStore = useAuthStore();
      if (!authStore.user?.userId) return;

      if (!this.formData.companyId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Champ requis',
          detail: 'Sélectionnez une entreprise',
          life: 3000,
        });
        return;
      }

      if (!this.formData.equipmentCategoryInput.trim()) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Champ requis',
          detail: 'Saisissez une catégorie/type d\'équipement',
          life: 3000,
        });
        return;
      }

      this.isSaving = true;
      try {
        const resolvedTypeId = await this.resolveEquipmentTypeId();

        if (!resolvedTypeId) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Champ requis',
            detail: 'Impossible de résoudre le type d\'équipement',
            life: 3000,
          });
          return;
        }

        if (this.dialogMode === 'create') {
          const createdEquipment = await createEquipementCompany({
            displayName: this.formData.name,
            stock: String(this.formData.quantity),
            pricePerDay: this.formData.dailyRate,
            description: this.formData.description,
            equipementTypeId: resolvedTypeId,
            companyId: this.formData.companyId,
            userCreateId: String(authStore.user.userId),
          });

          const uploadFailures = await this.uploadPendingCreateEquipmentImages(
            String((createdEquipment as any).equipementCompanyId || ''),
          );

          this.$toast.add({
            severity: uploadFailures.length > 0 ? 'warn' : 'success',
            summary: 'Succès',
            detail:
              uploadFailures.length > 0
                ? `Équipement créé, mais ${uploadFailures.length} photo(s) n'ont pas pu être téléversées`
                : 'Équipement créé avec succès',
            life: 3000,
          });
        } else if (this.selectedEquipmentId) {
          await updateEquipementCompany(this.selectedEquipmentId, {
            displayName: this.formData.name,
            stock: String(this.formData.quantity),
            pricePerDay: this.formData.dailyRate,
            description: this.formData.description,
            equipementTypeId: resolvedTypeId,
            companyId: this.formData.companyId,
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
    onCreateImagesSelected(event: Event) {
      const target = event.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      if (files.length === 0) {
        return;
      }

      const availableSlots = Math.max(0, 5 - this.pendingCreateImages.length);
      if (availableSlots === 0) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Limite atteinte',
          detail: 'Vous pouvez ajouter au maximum 5 photos',
          life: 3000,
        });
        target.value = '';
        return;
      }

      const nextFiles: File[] = [...this.pendingCreateImages];

      for (const file of files.slice(0, availableSlots)) {
        const validationError = this.validateImage(file);
        if (!validationError) {
          nextFiles.push(file);
          continue;
        }

        this.$toast.add({
          severity: 'warn',
          summary: 'Fichier ignoré',
          detail: `${file.name}: ${validationError}`,
          life: 3000,
        });
      }

      if (files.length > availableSlots) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Limite atteinte',
          detail: `Seules ${availableSlots} image(s) supplémentaire(s) ont été ajoutées`,
          life: 3000,
        });
      }

      this.pendingCreateImages = nextFiles.slice(0, 5);
      target.value = '';
    },
    removePendingCreateImage(index: number) {
      this.pendingCreateImages = this.pendingCreateImages.filter((_, i) => i !== index);
    },
    async uploadPendingCreateEquipmentImages(equipmentId: string): Promise<string[]> {
      if (!equipmentId || this.pendingCreateImages.length === 0) return [];

      this.isImageSaving = true;
      const failedFiles: string[] = [];
      try {
        for (const file of this.pendingCreateImages) {
          try {
            await uploadEquipementImage(equipmentId, file);
          } catch (_error) {
            failedFiles.push(file.name);
          }
        }
        return failedFiles;
      } finally {
        this.isImageSaving = false;
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
    goToEquipmentProduct(equipmentId: string) {
      if (!equipmentId) return;
      router.push(`/productDetails/${equipmentId}?type=equipment`);
    },
    validateImage(file: File): string | null {
      if (!UI.ALLOWED_IMAGE_TYPES.includes(file.type as (typeof UI.ALLOWED_IMAGE_TYPES)[number])) {
        return 'Format invalide (PNG, JPEG ou WEBP)';
      }

      if (file.size > UI.MAX_UPLOAD_SIZE_BYTES) {
        return `Fichier trop volumineux (max ${(UI.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)).toFixed(0)}MB)`;
      }

      return null;
    },
    onEquipmentFileSelected(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0] ?? null;

      if (!file) {
        this.selectedEquipmentFile = null;
        return;
      }

      const validationError = this.validateImage(file);
      if (validationError) {
        this.selectedEquipmentFile = null;
        this.$toast.add({
          severity: 'warn',
          summary: 'Fichier invalide',
          detail: validationError,
          life: 3000,
        });
        return;
      }

      this.selectedEquipmentFile = file;
    },
    async uploadEquipmentImageHandler(file: File) {
      if (!this.selectedEquipmentId) return;

      this.isImageSaving = true;
      try {
        const updated = await uploadEquipementImage(this.selectedEquipmentId, file);
        this.selectedEquipmentImageUrl = String(updated.imageUrl || '');
        this.selectedEquipmentImageUrls = updated.imageUrls || [updated.imageUrl || ''].filter(Boolean);
        await this.loadEquipments();
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Image mise à jour',
          life: 3000,
        });
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de téléverser l\'image',
          life: 3000,
        });
      } finally {
        this.isImageSaving = false;
      }
    },
    async removeEquipmentImageHandler(index: number) {
      if (!this.selectedEquipmentId) return;

      this.isImageSaving = true;
      try {
        const updated = await deleteEquipementImage(this.selectedEquipmentId, index);
        this.selectedEquipmentImageUrl = String(updated.imageUrl || '');
        this.selectedEquipmentImageUrls = updated.imageUrls || [updated.imageUrl || ''].filter(Boolean);
        await this.loadEquipments();
        this.$toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Image supprimée',
          life: 3000,
        });
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.response?.data?.message || 'Impossible de supprimer l\'image',
          life: 3000,
        });
      } finally {
        this.isImageSaving = false;
      }
    },
    resetForm() {
      this.selectedEquipmentId = null;
      this.selectedEquipmentFile = null;
      this.pendingCreateImages = [];
      this.selectedEquipmentImageUrl = '';
      this.selectedEquipmentImageUrls = [];
      this.formData = {
        companyId: '',
        name: '',
        quantity: 1,
        dailyRate: 0,
        description: '',
        equipmentCategoryId: '',
        equipmentCategoryInput: '',
      };
    },
  },
  computed: {
    isCategoryInputOpen(): boolean {
      return this.isCategoryInputFocused;
    },
    equipmentCategorySuggestions(): Array<{ id: string; name: string }> {
      const input = this.normalizeLabel(this.formData.equipmentCategoryInput);
      if (!input) {
        return this.categories.slice(0, 10).map((category) => ({
          id: String(category.id || ''),
          name: String(category.name || ''),
        }));
      }

      return this.categories
        .filter((category) => this.normalizeLabel(category.name).includes(input))
        .slice(0, 10)
        .map((category) => ({
          id: String(category.id || ''),
          name: String(category.name || ''),
        }));
    },
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
    this.loadEquipmentTypes();
    this.loadEquipmentCategories();
    this.loadEquipments();
  },
});
</script>
