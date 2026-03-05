<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <Button
            text
            plain
            icon="pi pi-arrow-left"
            label="Retour à la page précédente"
            class="mb-4 !text-gray-600 hover:!text-gray-900"
            @click="goBack"
          />
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Devenir vendeur</h1>
          <p class="text-gray-600">
            Remplissez le formulaire ci-dessous pour enregistrer votre entreprise et commencer à vendre.
          </p>
        </div>

        <!-- Form Card -->
        <div class="custom-card">
          <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Informations de base -->
              <fieldset>
                <legend class="text-lg font-semibold text-gray-900 mb-4">Informations de base</legend>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'entreprise <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      id="name"
                      v-model="form.name"
                      type="text"
                      class="w-full"
                      placeholder="Ex: Mon Entreprise"
                      :class="{ 'p-invalid': errors.name }"
                      @blur="validateField('name')"
                    />
                    <small class="text-red-500 block mt-1" v-if="errors.name">{{ errors.name }}</small>
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="w-full"
                      placeholder="contact@entreprise.com"
                      :class="{ 'p-invalid': errors.email }"
                      @blur="validateField('email')"
                    />
                    <small class="text-red-500 block mt-1" v-if="errors.email">{{ errors.email }}</small>
                  </div>
                </div>
              </fieldset>

              <!-- Contact -->
              <fieldset>
                <legend class="text-lg font-semibold text-gray-900 mb-4">Informations de contact</legend>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <InputText
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="w-full"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label for="legalForm" class="block text-sm font-medium text-gray-700 mb-1">
                      Forme juridique
                    </label>
                    <Dropdown
                      id="legalForm"
                      v-model="form.legalForm"
                      :options="legalForms"
                      option-label="label"
                      option-value="value"
                      placeholder="Sélectionner..."
                      class="w-full"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Identification -->
              <fieldset>
                <legend class="text-lg font-semibold text-gray-900 mb-4">Identification légale</legend>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label for="siret" class="block text-sm font-medium text-gray-700 mb-1">
                      SIRET
                    </label>
                    <InputText
                      id="siret"
                      v-model="form.siret"
                      type="text"
                      class="w-full"
                      placeholder="12345678901234"
                    />
                  </div>

                  <div>
                    <label for="tvaNumber" class="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de TVA
                    </label>
                    <InputText
                      id="tvaNumber"
                      v-model="form.tvaNumber"
                      type="text"
                      class="w-full"
                      placeholder="FR12345678901"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Adresse -->
              <fieldset>
                <legend class="text-lg font-semibold text-gray-900 mb-4">Adresse</legend>
                <div>
                  <label for="streetName" class="block text-sm font-medium text-gray-700 mb-1">
                    Rue
                  </label>
                  <InputText
                    id="streetName"
                    v-model="form.streetName"
                    type="text"
                    class="w-full"
                    placeholder="Rue de l'Église"
                  />
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                  <div>
                    <label for="houseNumber" class="block text-sm font-medium text-gray-700 mb-1">
                      Numéro
                    </label>
                    <InputText
                      id="houseNumber"
                      v-model="form.houseNumber"
                      type="text"
                      class="w-full"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label for="postcode" class="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <InputText
                      id="postcode"
                      v-model="form.postcode"
                      type="text"
                      class="w-full"
                      placeholder="75001"
                    />
                  </div>

                  <div>
                    <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <InputText
                      id="city"
                      v-model="form.city"
                      type="text"
                      class="w-full"
                      placeholder="Paris"
                    />
                  </div>
                </div>

                <div class="mt-4">
                  <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <InputText
                    id="country"
                    v-model="form.country"
                    type="text"
                    class="w-full"
                    placeholder="France"
                  />
                </div>
              </fieldset>

              <!-- Description et Web -->
              <fieldset>
                <legend class="text-lg font-semibold text-gray-900 mb-4">Détails supplémentaires</legend>
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    v-model="form.description"
                    rows="4"
                    class="w-full"
                    placeholder="Décrivez votre entreprise..."
                  />
                </div>

                <div class="mt-4">
                  <label for="website" class="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  <InputText
                    id="website"
                    v-model="form.website"
                    type="url"
                    class="w-full"
                    placeholder="https://www.exemple.com"
                  />
                </div>
              </fieldset>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  label="Annuler"
                  severity="secondary"
                  @click="goBack"
                />
                <Button
                  type="submit"
                  label="Devenir vendeur"
                  icon="pi pi-check"
                  :loading="isLoading"
                  class="bg-primary"
                />
              </div>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import { createCompany, createUserCompany } from '@/services/company';
import { useAuthStore } from '@/stores/authStore';
import type { CreateCompany } from '@/types/company';
import type { CreateUserCompany } from '@/types/userCompany';

interface BecomeSellersForm {
  name: string;
  email: string;
  phone: string;
  legalForm: string;
  siret: string;
  tvaNumber: string;
  streetName: string;
  houseNumber: string;
  postcode: string;
  city: string;
  country: string;
  description: string;
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export default defineComponent({
  name: 'BecomeSellerPage',
  components: {
    Button,
    InputText,
    Textarea,
    Dropdown,
  },
  data() {
    return {
      isLoading: false,
      errors: {} as FormErrors,
      legalForms: [
        { label: 'SARL', value: 'SARL' },
        { label: 'EIRL', value: 'EIRL' },
        { label: 'SAS', value: 'SAS' },
        { label: 'SASU', value: 'SASU' },
        { label: 'MICRO', value: 'MICRO' },
        { label: 'Entreprise Individuelle', value: 'EI' },
        { label: 'SELARL', value: 'SELARL' },
      ],
      form: {
        name: '',
        email: '',
        phone: '',
        legalForm: '',
        siret: '',
        tvaNumber: '',
        streetName: '',
        houseNumber: '',
        postcode: '',
        city: '',
        country: '',
        description: '',
        website: '',
      } as BecomeSellersForm,
    };
  },
  methods: {
    validateField(field: keyof BecomeSellersForm): void {
      this.errors = {};

      if (field === 'name' && !this.form.name.trim()) {
        this.errors.name = 'Le nom est requis';
      }

      if (field === 'email') {
        if (!this.form.email.trim()) {
          this.errors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          this.errors.email = 'Email invalide';
        }
      }
    },
    validateForm(): boolean {
      this.errors = {};

      if (!this.form.name.trim()) {
        this.errors.name = 'Le nom est requis';
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'Email invalide';
      }

      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit(): Promise<void> {
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;
      try {
        const authStore = useAuthStore();

        // Créer la compagnie
        const companyData: CreateCompany = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          legalForm: this.form.legalForm,
          siret: this.form.siret,
          tvaNumber: this.form.tvaNumber,
          streetName: this.form.streetName,
          houseNumber: this.form.houseNumber,
          postcode: this.form.postcode,
          city: this.form.city,
          country: this.form.country,
          description: this.form.description,
          website: this.form.website,
        };

        const company = await createCompany(companyData);

        // Associer l'utilisateur à la compagnie
        const userCompanyData: CreateUserCompany = {
          companyId: (company as any).companyId as string,
          userId: String(authStore.user?.userId) as string,
        };

        await createUserCompany(userCompanyData);

        // Succès
        this.$toast.add({
          severity: 'success',
          summary: 'Bravo!',
          detail: 'Votre demande a été envoyée. Elle sera vérifiée par nos équipes.',
          life: 5000,
        });

        // Redirection après succès
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
      } catch (error: any) {
        console.error('Erreur lors de la création de l\'entreprise:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail:
            error.response?.data?.message ||
            'Une erreur s\'est produite lors de la création de l\'entreprise',
          life: 5000,
        });
      } finally {
        this.isLoading = false;
      }
    },
    goBack(): void {
      this.$router.back();
    },
  },
  mounted() {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      this.$router.push('/login');
    }
  },
});
</script>

<style scoped>
.custom-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 2rem;
  transition: box-shadow 0.3s ease;
}

.custom-card:hover {
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputtextarea) {
  width: 100%;
  border-radius: 0.375rem;
}

:deep(.p-invalid) {
  border-color: ef4444;
}

fieldset {
  border: none;
  padding: 0;
}

legend {
  padding: 0;
}
</style>
