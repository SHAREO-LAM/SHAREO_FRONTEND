<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
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

      <!-- Dialog créer annonce -->
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
            <InputText v-model="form.name" placeholder="Ex : Projecteur HD" class="w-full" />
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
              <InputNumber v-model="form.price" class="w-full" placeholder="250" :min="0" />
            </div>
            <div>
              <label class="block mb-2 font-medium">Stock disponible</label>
              <InputText v-model="form.stock" placeholder="10" class="w-full" />
            </div>
          </div>
          <div class="flex gap-4">
            <Button
              label="Enregistrer"
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
          <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
        </form>
      </Dialog>

      <!-- Stats -->
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

      <!-- Tableau annonces avec actions -->
      <Card class="mt-8">
        <template #title>Mes annonces</template>
        <template #content>
          <DataTable
            :value="equipmentsWithTypeName"
            responsiveLayout="scroll"
            class="w-full"
          >
            <Column field="displayName" header="Nom de l’annonce" />
            <Column field="pricePerDay" header="Prix (€)" />
            <Column field="stock" header="Stock" />
            <Column field="description" header="Description" />
            <Column field="typeName" header="Type" />
            <Column header="Actions">
              <template #body="{ data }">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-info mr-2"
                  @click="editEquipement(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  @click="deleteEquipement(data)"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Dialog modifier annonce -->
    <Dialog
      v-model:visible="showEditDialog"
      modal
      header="Modifier l’annonce"
      class="w-full max-w-2xl"
    >
      <form class="space-y-6 mt-4" @submit.prevent="handleUpdateEquipement">
        <div>
          <label class="block mb-2 font-medium">Nom de l’annonce</label>
          <InputText v-model="editForm.name" class="w-full" />
        </div>
        <div>
          <label class="block mb-2 font-medium">Description</label>
          <Textarea v-model="editForm.description" rows="4" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 font-medium">Prix par jour (€)</label>
            <InputNumber v-model="editForm.price" class="w-full" :min="0" />
          </div>
          <div>
            <label class="block mb-2 font-medium">Stock disponible</label>
            <InputText v-model="editForm.stock" class="w-full" />
          </div>
        </div>
        <div class="flex gap-4">
          <Button
            label="Enregistrer"
            class="flex-1 bg-blue-600 border-none"
            type="submit"
            :loading="isSubmitting"
          />
          <Button
            label="Annuler"
            severity="secondary"
            outlined
            @click="showEditDialog = false"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Badge from 'primevue/badge'

import { getEquipementsCompany, createEquipementCompany, updateEquipementCompany, deleteEquipementCompany } from '@/services/equipementCompany'
import { fetchEquipementTypes } from '@/services/equipement'
import type { EquipementType } from '@/types/equipementType'
import type { EquipementCompany } from '@/types/equipementCompany'

export default defineComponent({
  name: 'VendorDashBoardPage',
  setup() {
    const showCreateDialog = ref(false)
    const showEditDialog = ref(false)
    const isSubmitting = ref(false)
    const submitError = ref<string | null>(null)

    const equipments = ref<EquipementCompany[]>([])
    const equipementTypes = ref<EquipementType[]>([])


    const stats = ref([
  {
    label: 'Annonces actives',
    value: 12,
    change: '+2',
    icon: 'pi-briefcase'
  },
  {
    label: 'Réservations',
    value: 8,
    change: '+1',
    icon: 'pi-calendar'
  },
  {
    label: 'Revenus du mois',
    value: '2 450€',
    change: '+12%',
    icon: 'pi-euro'
  },
  {
    label: 'Taux de remplissage',
    value: '78%',
    change: '+5%',
    icon: 'pi-chart-line'
  }
])

    const form = ref({
      type: null as string | null,
      companyId: '',
      equipementTypeId: null as string | null,
      name: '',
      description: '',
      price: null as number | null,
      stock: ''
    })

    const editForm = ref<any>({})
    let editingId: string | null = null

    const listingTypes = [
      { label: 'Lieu', value: 'venue' },
      { label: 'Équipement', value: 'equipment' }
    ]

    const equipmentsWithTypeName = computed(() =>
      equipments.value.map(e => {
        const type = equipementTypes.value.find(t => t.equipementTypeId === e.equipementTypeId)
        return { ...e, typeName: type ? type.name : 'Inconnu' }
      })
    )

    const loadEquipements = async () => {
      try {
        equipments.value = await getEquipementsCompany()
      } catch (err) {
        console.error(err)
      }
    }

    const loadEquipementTypes = async () => {
      try {
        const data = await fetchEquipementTypes()
        equipementTypes.value = data.map(t => ({ ...t, equipementTypeId: String(t.equipementTypeId) }))
      } catch (err) {
        console.error(err)
      }
    }

    const handleCreateEquipement = async () => {
      submitError.value = null
      if (!form.value.name || form.value.price === null || !form.value.equipementTypeId) {
        submitError.value = 'Nom, prix et type requis.'
        return
      }

      isSubmitting.value = true
      try {
        const newEquip = await createEquipementCompany({
          displayName: form.value.name,
          description: form.value.description,
          pricePerDay: form.value.price,
          stock: form.value.stock,
          companyId: form.value.companyId,
          equipementTypeId: form.value.equipementTypeId
        })
        equipments.value.push(newEquip)
        showCreateDialog.value = false
      } catch {
        submitError.value = 'Erreur lors de la création.'
      } finally {
        isSubmitting.value = false
      }
    }

    const editEquipement = (equip: EquipementCompany) => {
      editingId = equip.id
      editForm.value = { ...equip, price: equip.pricePerDay }
      showEditDialog.value = true
    }

    const handleUpdateEquipement = async () => {
      if (!editingId) return
      isSubmitting.value = true
      try {
        const updated = await updateEquipementCompany(editingId, {
          ...editForm.value,
          pricePerDay: editForm.value.price
        })
        const index = equipments.value.findIndex(e => e.id === editingId)
        if (index !== -1) equipments.value[index] = updated
        showEditDialog.value = false
      } catch {
        submitError.value = 'Erreur lors de la modification.'
      } finally {
        isSubmitting.value = false
      }
    }

    const deleteEquipement = async (equip: EquipementCompany) => {
      if (!confirm(`Supprimer ${equip.displayName} ?`)) return
      try {
        await deleteEquipementCompany(equip.id)
        equipments.value = equipments.value.filter(e => e.id !== equip.id)
      } catch {
        alert('Erreur lors de la suppression.')
      }
    }

    onMounted(async () => {
      await loadEquipementTypes()
      await loadEquipements()
    })

    return {
      showCreateDialog,
      showEditDialog,
      isSubmitting,
      submitError,
      form,
      editForm,
      listingTypes,
      equipementTypes,
      equipments,
      equipmentsWithTypeName,
      handleCreateEquipement,
      editEquipement,
      handleUpdateEquipement,
      deleteEquipement,
      stats
    }
  }
})
</script>
