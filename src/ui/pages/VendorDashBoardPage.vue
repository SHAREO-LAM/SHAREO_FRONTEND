<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl mb-2">Tableau de bord prestataire</h1>
          <p class="text-gray-600">Gérez vos annonces et vos réservations</p>
        </div>
        <Button icon="pi pi-plus" label="Créer une annonce" class="bg-orange-500 hover:bg-orange-600 border-none"
          @click="showCreateDialog = true" />
      </div>

      <!-- Dialog créer annonce -->
      <Dialog v-model:visible="showCreateDialog" modal header="Créer une nouvelle annonce" class="w-full max-w-2xl">
        <form class="space-y-6 mt-4" @submit.prevent="handleCreateEquipement">
          <div>
            <label class="block mb-2 font-medium">Type d’annonce</label>
            <!-- <Select
              v-model="form.type"
              :options="listingTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un type"
              class="w-full"
            /> -->
          </div>
          <div>
            <label class="block mb-2 font-medium">Société (ID)</label>
            <InputText v-model="form.companyId" placeholder="ID de la société" class="w-full" />
          </div>
          <div>
            <label class="block mb-2 font-medium">Type d’équipement</label>
            <Select v-model="form.equipementTypeId" :options="equipementTypes" optionLabel="name"
              optionValue="equipementTypeId" placeholder="Choisir un équipement" class="w-full" />
          </div>
          <div>
            <label class="block mb-2 font-medium">Nom de l’annonce</label>
            <InputText v-model="form.displayName" placeholder="Ex : Projecteur HD" class="w-full" />
          </div>
          <div>
            <label class="block mb-2 font-medium">Description</label>
            <Textarea v-model="form.description" rows="4" placeholder="Décrivez votre équipement..." class="w-full" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 font-medium">Prix par jour (€)</label>
              <InputNumber v-model="form.pricePerDay" class="w-full" placeholder="250" :min="0" />
            </div>
            <div>
              <label class="block mb-2 font-medium">Stock disponible</label>
              <InputText v-model="form.stock" placeholder="10" class="w-full" />
            </div>
          </div>
          <div class="flex gap-4">
            <Button label="Enregistrer" class="flex-1 bg-blue-600 border-none" type="submit" :loading="isSubmitting" />
            <Button label="Annuler" severity="secondary" outlined @click="showCreateDialog = false" />
          </div>
          <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
        </form>
      </Dialog>

      <!-- Stats et réservation en dur -->
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
          <DataTable :value="equipments" responsiveLayout="scroll" class="w-full">
            <Column field="displayName" header="Nom de l’annonce" />
            <Column field="pricePerDay" header="Prix (€)" />
            <Column field="stock" header="Stock" />
            <Column field="description" header="Description" />
            <Column field="equipementType.name" header="Type" />
            <Column header="Actions">
              <template #body="{ data }">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-secondary mr-2"
                  @click="viewEquipement(data)" />
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info mr-2"
                  @click="editEquipement(data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger"
                  @click="confirmDeleteEquipement(data)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>


    <!-- Dialog modifier annonce -->
    <Dialog v-model:visible="showEditDialog" modal header="Modifier l’annonce" class="w-full max-w-2xl">
      <form class="space-y-6 mt-4" @submit.prevent="handleUpdateEquipement">
        <div>
          <label class="block mb-2 font-medium">Nom de l’annonce</label>
          <InputText v-model="editForm.displayName" class="w-full" />
        </div>
        <div>
          <label class="block mb-2 font-medium">Description</label>
          <Textarea v-model="editForm.description" rows="4" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 font-medium">Prix par jour (€)</label>
            <InputNumber v-model="editForm.pricePerDay" class="w-full" :min="0" />
          </div>
          <div>
            <label class="block mb-2 font-medium">Stock disponible</label>
            <InputText v-model="editForm.stock" class="w-full" />
          </div>
        </div>
        <div class="flex gap-4">
          <Button label="Enregistrer" class="flex-1 bg-blue-600 border-none" type="submit" :loading="isSubmitting" />
          <Button label="Annuler" severity="secondary" outlined @click="showEditDialog = false" />
        </div>
      </form>
    </Dialog>

    <!-- Dialog suppression -->
    <Dialog v-model:visible="showDeleteDialog" modal header="Confirmer suppression">
      <p>Êtes-vous sûr de vouloir supprimer cette annonce ?</p>
      <div class="flex gap-4 mt-4">
        <Button label="Oui" severity="danger" @click="deleteConfirmed" />
        <Button label="Non" outlined @click="showDeleteDialog = false" />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import {
  getEquipementsCompany,
  createEquipementCompany,
  updateEquipementCompany,
  deleteEquipementCompany
} from '@/services/equipementCompany'
import { fetchEquipementTypes } from '@/services/equipement'
import type {
  CreateEquipementCompany,
  EquipementCompanyReadDto
} from '@/types/equipementCompany'
import type { EquipementType } from '@/types/equipementType'



export default defineComponent({
  name: 'VendorDashBoardPage',

  setup() {
    const showCreateDialog = ref(false)
    const showEditDialog = ref(false)
    const showDeleteDialog = ref(false)
    const isSubmitting = ref(false)
    const submitError = ref<string | null>(null)

    const equipments = ref<EquipementCompanyReadDto[]>([])
    const equipementTypes = ref<EquipementType[]>([])
    const equipToDelete = ref<EquipementCompanyReadDto | null>(null)
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

    const listingTypes = [
      { label: 'Lieu', value: 'venue' },
      { label: 'Équipement', value: 'equipment' }
    ]

    const form = ref<Partial<CreateEquipementCompany>>({
      companyId: '',
      equipementTypeId: '',
      displayName: '',
      description: '',
      pricePerDay: undefined,
      stock: '1',
    })

    const editForm = ref<EquipementCompanyReadDto>({
      equipementCompanyId: '',
      displayName: '',
      description: '',
      pricePerDay: 0,
      stock: '',
      companyId: '',
      equipementTypeId: ''
    })


    const loadEquipementTypes = async () => {
      try {
        equipementTypes.value = await fetchEquipementTypes()
      } catch (err) {
        console.error(err)
      }
    }

    const loadEquipements = async () => {
      try {
        const raw: EquipementCompanyReadDto[] = await getEquipementsCompany()
        console.log('Raw equipements data:', raw) 
        equipments.value = raw
      } catch (err) {
        console.error('Erreur chargement équipements:', err)
      }
    }


    const handleCreateEquipement = async () => {
      submitError.value = null

      if (!form.value.displayName || !form.value.pricePerDay || !form.value.equipementTypeId) {
        submitError.value = 'Nom, prix et type requis.'
        return
      }

      isSubmitting.value = true

      try {
        const newEquip = await createEquipementCompany(
          form.value as CreateEquipementCompany
        )

        equipments.value.push({
          ...newEquip,
        })

        showCreateDialog.value = false

        form.value = {
          companyId: '',
          equipementTypeId: '',
          displayName: '',
          description: '',
          pricePerDay: undefined,
          stock: ''
        }

      } catch {
        submitError.value = 'Erreur lors de la création.'
      } finally {
        isSubmitting.value = false
      }
    }


    const editEquipement = (rowData: EquipementCompanyReadDto) => {
      editForm.value = { ...rowData }
      showEditDialog.value = true
    }


    const handleUpdateEquipement = async () => {
      console.log('Updating equipement with data:', editForm.value.equipementCompanyId)
      if (!editForm.value.equipementCompanyId) return

      isSubmitting.value = true

      try {
        console.log('Sending update request for equipement ID:', editForm.value.equipementCompanyId)
        const updated = await updateEquipementCompany(
          editForm.value.equipementCompanyId,
          editForm.value
        )

        const index = equipments.value.findIndex(
          e => e.equipementCompanyId === updated.equipementCompanyId
        )

        if (index !== -1) {
          equipments.value[index] = {
            ...updated,
          }
        }

        showEditDialog.value = false

      } finally {
        isSubmitting.value = false
      }
    }



    const confirmDeleteEquipement = (rowData: EquipementCompanyReadDto) => {
      console.log('Confirm delete for equipement:', rowData)
      equipToDelete.value = rowData
      showDeleteDialog.value = true
    }

    const deleteConfirmed = async () => {
      if (!equipToDelete.value || !equipToDelete.value.equipementTypeId) {
        alert("ID NULL") 
        return
      }

      try {
        await deleteEquipementCompany(equipToDelete.value.equipementTypeId)

        equipments.value = equipments.value.filter(
          e => e.equipementCompanyId !== equipToDelete.value!.equipementCompanyId
        )

      } catch {
        alert('Erreur lors de la suppression.')
      } finally {
        showDeleteDialog.value = false
      }
    }

    const viewEquipement = (rowData: EquipementCompanyReadDto) => {
      alert(
        `Nom: ${rowData.displayName}
        Prix: ${rowData.pricePerDay} €
        Stock: ${rowData.stock}
        Description: ${rowData.description}`
      )
    }


    onMounted(async () => {
      await loadEquipementTypes()
      await loadEquipements()
    })

    return {
      showCreateDialog,
      showEditDialog,
      showDeleteDialog,
      isSubmitting,
      submitError,
      form,
      editForm,
      equipments,
      equipementTypes,
      stats,
      listingTypes,
      handleCreateEquipement,
      editEquipement,
      handleUpdateEquipement,
      confirmDeleteEquipement,
      deleteConfirmed,
      viewEquipement,
    }
  }
})
</script>