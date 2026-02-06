<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl mb-2">Tableau de bord prestataire</h1>
          <p class="text-gray-600">Gérez vos annonces et vos réservations</p>
        </div>

        <Button
          icon="pi pi-plus"
          label="Créer une annonce"
          class="bg-orange-500 hover:bg-orange-600 border-none"
          @click="showCreateDialog = true"
        />
      </div>

      <Dialog
        v-model:visible="showCreateDialog"
        modal
        header="Créer une nouvelle annonce"
        class="w-full max-w-2xl"
      >
        <form class="space-y-6 mt-4" @submit.prevent="handleCreateEquipement">
          <div>
            <label class="block mb-2 font-medium">Type d’annonce</label>
            <Select
              v-model="form.type"
              :options="listingTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un type"
              class="w-full"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Société (ID)</label>
            <InputText
              v-model="form.companyId"
              placeholder="ID de la société"
              class="w-full"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Type d’équipement</label>
            <Select
              v-model="form.equipementTypeId"
              :options="equipementTypes"
              optionLabel="name"
              optionValue="equipementTypeId"
              placeholder="Choisir un équipement"
              class="w-full"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Nom de l’annonce</label>
            <InputText
              v-model="form.name"
              placeholder="Ex : Projecteur HD"
              class="w-full"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Description</label>
            <Textarea
              v-model="form.description"
              rows="4"
              placeholder="Décrivez votre équipement..."
              class="w-full"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 font-medium">Prix par jour (€)</label>

              <InputNumber
                v-model="form.price"
                class="w-full"
                placeholder="250"
                :min="0"
              />
            </div>

            <div>
              <label class="block mb-2 font-medium">Stock disponible</label>
              <InputText v-model="form.stock" placeholder="10" />
            </div>
          </div>

          <div class="flex gap-4">
            <Button
              label="Créer l’annonce"
              class="flex-1 bg-blue-600 border-none"
              type="submit"
              :loading="isSubmitting"
            />
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              @click="showCreateDialog = false"
            />
          </div>

          <p v-if="submitError" class="text-sm text-red-600">
            {{ submitError }}
          </p>
        </form>
      </Dialog>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card v-for="(stat, i) in stats" :key="i">
          <template #content>
            <div class="flex items-center justify-between mb-4">
              <i :class="['pi', stat.icon, 'text-2xl']"></i>
              <Badge :value="stat.change" class="bg-green-100 text-green-700" />
            </div>
            <h3 class="text-2xl mb-1">{{ stat.value }}</h3>
            <p class="text-sm text-gray-600">{{ stat.label }}</p>
          </template>
        </Card>
      </div>

      <Card class="mt-8">
        <template #title>Réservations à venir</template>
        <template #content>
          <DataTable :value="upcomingBookings" responsiveLayout="scroll">
            <Column field="listing" header="Annonce" />
            <Column field="customer" header="Client" />
            <Column field="date" header="Date" />
            <Column field="amount" header="Montant (€)" />
            <Column header="Statut">
              <template #body="{ data }">
                <Badge
                  :value="data.status"
                  :class="
                    data.status === 'confirmée'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  "
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { createEquipementCompany } from '@/services/equipementCompany'
import { fetchEquipementTypes } from '@/services/equipement'
import type { EquipementType } from '@/types/equipementType'

export default defineComponent({
  name: 'VendorDashBoardPage',

  setup() {
    const showCreateDialog = ref(false)

    const form = ref({
      type: null as string | null,
      companyId: '',
      equipementTypeId: null as string | null,
      name: '',
      description: '',
      price: null as number | null,
      stock: ''
    })

    const listingTypes = [
      { label: 'Lieu', value: 'venue' },
      { label: 'Équipement', value: 'equipment' }
    ]

    const equipementTypes = ref<EquipementType[]>([])
    const isSubmitting = ref(false)
    const submitError = ref<string | null>(null)

    const stats = [
      { label: 'Annonces actives', value: 12, change: '+2', icon: 'pi-home' },
      { label: 'Réservations', value: 34, change: '+5', icon: 'pi-calendar' },
      { label: 'Vues', value: 1280, change: '+12%', icon: 'pi-eye' },
      { label: 'Revenus', value: '18 500 €', change: '+8%', icon: 'pi-euro' }
    ]

    const upcomingBookings = [
      {
        listing: 'Projecteur HD',
        customer: 'Startup XYZ',
        date: '18/03/2026',
        amount: 450,
        status: 'confirmée'
      }
    ]

    const loadEquipementTypes = async () => {
      try {
        const data = await fetchEquipementTypes()

        equipementTypes.value = data.map((t) => ({
          ...t,
          equipementTypeId: String(t.equipementTypeId)
        }))
      } catch (error) {
        console.error(error)
      }
    }

    const handleCreateEquipement = async () => {
      submitError.value = null

      if (form.value.type !== 'equipment') {
        submitError.value = 'Veuillez sélectionner "Équipement".'
        return
      }

      if (!form.value.companyId || !form.value.equipementTypeId) {
        submitError.value = 'Société et type requis.'
        return
      }

      if (!form.value.name || form.value.price === null) {
        submitError.value = 'Nom et prix obligatoires.'
        return
      }

      isSubmitting.value = true

      try {
        await createEquipementCompany({
          displayName: form.value.name,
          description: form.value.description || undefined,
          pricePerDay: form.value.price,
          stock: form.value.stock,
          companyId: form.value.companyId,
          equipementTypeId: form.value.equipementTypeId
        })

        showCreateDialog.value = false
      } catch (error) {
        submitError.value = 'Erreur lors de la création.'
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(loadEquipementTypes)

    return {
      showCreateDialog,
      form,
      listingTypes,
      equipementTypes,
      isSubmitting,
      submitError,
      handleCreateEquipement,
      stats,
      upcomingBookings
    }
  }
})
</script>
