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

      <Column field="name" header="Nom" style="width: 20%" sortable />
      <Column header="Image" style="width: 10%">
        <template #body="slotProps">
          <img
            v-if="(slotProps.data.imageUrls && slotProps.data.imageUrls.length > 0) || slotProps.data.imageUrl"
            :src="(slotProps.data.imageUrls && slotProps.data.imageUrls.length > 0) ? slotProps.data.imageUrls[0] : slotProps.data.imageUrl"
            alt="Image du lieu"
            class="h-12 w-16 rounded object-cover"
          />
          <span v-else class="text-xs text-gray-400">Aucune</span>
        </template>
      </Column>
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
            icon="pi pi-link"
            severity="secondary"
            rounded
            text
            @click="goToDomainProduct(slotProps.data.domainId)"
            class="mr-1"
            aria-label="Ouvrir la page produit du lieu"
          />
          <Button
            icon="pi pi-pencil"
            severity="info"
            rounded
            text
            @click="editDomain(slotProps.data)"
            class="mr-1"
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
      <form @submit.prevent="saveDomain" class="space-y-4" aria-label="Formulaire lieu admin">
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
            aria-required="true"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <InputText id="name" v-model="formData.name" type="text" class="w-full" aria-required="true" />
          </div>

          <div>
            <label for="pricePerDay" class="block text-sm font-medium text-gray-700 mb-1">Tarif/Jour (€)</label>
            <InputNumber
              id="pricePerDay"
              v-model="formData.pricePerDay"
              class="w-full"
              :min-fraction-digits="2"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label for="streetName" class="block text-sm font-medium text-gray-700 mb-1">Rue</label>
            <InputText id="streetName" v-model="formData.streetName" type="text" class="w-full" />
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

        <div v-if="dialogMode === 'create'" class="space-y-2">
          <label for="domain-create-images" class="block text-sm font-medium text-gray-700 mb-1">
            Photos a televerser apres creation (max 5)
          </label>
          <input
            id="domain-create-images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            class="block w-full text-sm"
            aria-describedby="domain-images-help"
            @change="onCreateImagesSelected"
          />
          <p id="domain-images-help" class="text-xs text-gray-500">
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

        <div v-if="selectedDomainId">
          <ImageGalleryManager
            :imageUrls="selectedDomainImageUrls"
            :isLoading="isImageSaving"
            @upload="(file) => uploadDomainImageHandler(file)"
            @remove="(index) => removeDomainImageHandler(index)"
          />
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
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import AdminSectionHeader from '@/ui/components/admin/components/AdminSectionHeader.vue';
import AdminTableToolbar from '@/ui/components/admin/components/AdminTableToolbar.vue';
import ImageGalleryManager from '@/ui/components/ImageGalleryManager.vue';
import {
  getDomains,
  createDomain,
  updateDomain,
  deleteDomain,
  uploadDomainImage,
  deleteDomainImage,
} from '@/services/domain';
import router from '@/router';
import { getValidatedCompanies } from '@/services/company';
import { useAuthStore } from '@/stores/authStore';
import type { Domain, CreateDomain } from '@/types/domain';
import type { Company } from '@/types/company';
import { UI } from '@/constants/const';

interface FormData {
  companyId: string;
  name: string;
  description: string;
  streetName: string;
  city: string;
  postcode: string;
  country: string;
  pricePerDay: number | null;
}

export default defineComponent({
  name: 'DomainsManagement',
  components: {
    DataTable,
    Column,
    Dialog,
    Button,
    InputText,
    InputNumber,
    Textarea,
    Dropdown,
    AdminSectionHeader,
    AdminTableToolbar,
    ImageGalleryManager,
  },
  data() {
    return {
      domains: [] as Domain[],
      companies: [] as Company[],
      domainSearch: '',
      domainCityFilter: 'all',
      isLoading: false,
      isSaving: false,
      dialogVisible: false,
      dialogMode: 'create' as 'create' | 'edit',
      selectedDomainId: null as string | null,
      formData: {
        companyId: '',
        name: '',
        description: '',
        streetName: '',
        city: '',
        postcode: '',
        country: '',
        pricePerDay: null,
      } as FormData,
      domainCityFilterOptions: [{ label: 'Toutes', value: 'all' }] as Array<{
        label: string;
        value: string;
      }>,
      selectedDomainFile: null as File | null,
      pendingCreateImages: [] as File[],
      selectedDomainImageUrl: '' as string,
      selectedDomainImageUrls: [] as string[],
      isImageSaving: false,
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
        if (this.companies.length === 0) {
          await this.loadCompanies();
        }
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
    async loadCompanies() {
      try {
        this.companies = await getValidatedCompanies();
      } catch (error: any) {
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les entreprises validées',
          life: 3000,
        });
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
      this.selectedDomainFile = null;
      this.selectedDomainImageUrl = String(domain.imageUrl || '');
      this.selectedDomainImageUrls = domain.imageUrls || [domain.imageUrl || ''].filter(Boolean);
      this.formData = {
        companyId: String((domain as any).companyId || ''),
        name: domain.name || '',
        description: domain.description || '',
        streetName: String((domain as any).streetName || ''),
        city: domain.city || '',
        postcode: domain.postcode || '',
        country: domain.country || '',
        pricePerDay: (domain as any).pricePerDay != null ? Number((domain as any).pricePerDay) : null,
      };
      this.dialogVisible = true;
    },
    async saveDomain() {
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

      this.isSaving = true;
      try {
        if (this.dialogMode === 'create') {
          const createdDomain = await createDomain({
            name: this.formData.name,
            description: this.formData.description,
            city: this.formData.city,
            postcode: this.formData.postcode,
            country: this.formData.country,
            streetName: this.formData.streetName,
            pricePerDay: this.formData.pricePerDay ?? undefined,
            companyId: this.formData.companyId,
            userCreateId: String(authStore.user.userId),
          });

          const uploadFailures = await this.uploadPendingCreateDomainImages(
            String((createdDomain as any).domainId || ''),
          );

          this.$toast.add({
            severity: uploadFailures.length > 0 ? 'warn' : 'success',
            summary: 'Succès',
            detail:
              uploadFailures.length > 0
                ? `Lieu créé, mais ${uploadFailures.length} photo(s) n'ont pas pu être téléversées`
                : 'Lieu créé avec succès',
            life: 3000,
          });
        } else if (this.selectedDomainId) {
          await updateDomain(this.selectedDomainId, {
            name: this.formData.name,
            description: this.formData.description,
            city: this.formData.city,
            postcode: this.formData.postcode,
            country: this.formData.country,
            streetName: this.formData.streetName,
            pricePerDay: this.formData.pricePerDay ?? undefined,
            companyId: this.formData.companyId,
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
    async uploadPendingCreateDomainImages(domainId: string): Promise<string[]> {
      if (!domainId || this.pendingCreateImages.length === 0) return [];

      this.isImageSaving = true;
      const failedFiles: string[] = [];
      try {
        for (const file of this.pendingCreateImages) {
          try {
            await uploadDomainImage(domainId, file);
          } catch (_error) {
            failedFiles.push(file.name);
          }
        }
        return failedFiles;
      } finally {
        this.isImageSaving = false;
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
    goToDomainProduct(domainId: string) {
      if (!domainId) return;
      router.push(`/productDetails/${domainId}`);
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
    onDomainFileSelected(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0] ?? null;

      if (!file) {
        this.selectedDomainFile = null;
        return;
      }

      const validationError = this.validateImage(file);
      if (validationError) {
        this.selectedDomainFile = null;
        this.$toast.add({
          severity: 'warn',
          summary: 'Fichier invalide',
          detail: validationError,
          life: 3000,
        });
        return;
      }

      this.selectedDomainFile = file;
    },
    async uploadDomainImageHandler(file: File) {
      if (!this.selectedDomainId) return;

      this.isImageSaving = true;
      try {
        const updated = await uploadDomainImage(this.selectedDomainId, file);
        this.selectedDomainImageUrl = String(updated.imageUrl || '');
        this.selectedDomainImageUrls = updated.imageUrls || [updated.imageUrl || ''].filter(Boolean);
        await this.loadDomains();
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
    async removeDomainImageHandler(index: number) {
      if (!this.selectedDomainId) return;

      this.isImageSaving = true;
      try {
        const updated = await deleteDomainImage(this.selectedDomainId, index);
        this.selectedDomainImageUrl = String(updated.imageUrl || '');
        this.selectedDomainImageUrls = updated.imageUrls || [updated.imageUrl || ''].filter(Boolean);
        await this.loadDomains();
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
      this.selectedDomainId = null;
      this.selectedDomainFile = null;
      this.pendingCreateImages = [];
      this.selectedDomainImageUrl = '';
      this.selectedDomainImageUrls = [];
      this.formData = {
        companyId: '',
        name: '',
        description: '',
        streetName: '',
        city: '',
        postcode: '',
        country: '',
        pricePerDay: null,
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
    this.loadCompanies();
    this.loadDomains();
  },
});
</script>
