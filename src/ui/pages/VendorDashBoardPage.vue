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

      <!-- Stats -->
      <DashboardStats :stats="stats" />

      <!-- TABLE EQUIPEMENTS -->
    <EquipementsTable
      :equipments="equipments"
      @view="viewEquipement"
      @edit="editEquipement"
      @delete="confirmDeleteEquipement"
    />

    <!-- TABLE DOMAINS -->
    <DomainsTable
      :domains="domains"
      @view="viewDomain"
      @edit="editDomain"
      @delete="confirmDeleteDomain"
    />

    </div>

    <!-- CREATE DIALOG -->

    <Dialog v-model:visible="showCreateDialog" header="Créer un équipement" modal class="w-full max-w-2xl">

      <form class="space-y-4 mt-4" @submit.prevent="handleCreateEquipement(form)">

        <div>
          <label>Société ID</label>
          <InputText v-model="form.companyId" class="w-full"/>
        </div>

        <div>
          <label>Type équipement</label>
          <Select
            v-model="form.equipementTypeId"
            :options="equipementTypes"
            optionLabel="name"
            optionValue="equipementTypeId"
            placeholder="Choisir"
            class="w-full"
          />
        </div>

        <div>
          <label>Nom annonce</label>
          <InputText v-model="form.displayName" class="w-full"/>
        </div>

        <div>
          <label>Description</label>
          <Textarea v-model="form.description" rows="3" class="w-full"/>
        </div>

        <div>
          <label>Prix / jour</label>
          <InputNumber v-model="form.pricePerDay" class="w-full"/>
        </div>

        <div>
          <label>Stock</label>
          <InputText v-model="form.stock" class="w-full"/>
        </div>

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting"/>
          <Button label="Annuler" severity="secondary" @click="showCreateDialog=false"/>
        </div>

        <p v-if="submitError" class="text-red-500">{{ submitError }}</p>

      </form>

    </Dialog>


    <!-- EDIT DIALOG -->

    <Dialog v-model:visible="showEditDialog" header="Modifier un équipement" modal class="w-full max-w-2xl">

      <form class="space-y-4 mt-4" @submit.prevent="handleUpdateEquipement(editForm)">

        <div>
          <label>Nom annonce</label>
          <InputText v-model="editForm.displayName" class="w-full"/>
        </div>

        <div>
          <label>Description</label>
          <Textarea v-model="editForm.description" rows="3" class="w-full"/>
        </div>

        <div>
          <label>Prix / jour</label>
          <InputNumber v-model="editForm.pricePerDay" class="w-full"/>
        </div>

        <div>
          <label>Stock</label>
          <InputText v-model="editForm.stock" class="w-full"/>
        </div>

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting"/>
          <Button label="Annuler" severity="secondary" @click="showEditDialog=false"/>
        </div>

      </form>

    </Dialog>


    <!-- DELETE DIALOG -->

    <DeleteConfirmDialog
      :visible="showDeleteDialog"
      message="Supprimer cette annonce ?"
      :onConfirm="deleteConfirmed"
      :onCancel="() => showDeleteDialog = false"
    />

  </div>
</template>


<script lang="ts">

import { defineComponent, ref, onMounted } from "vue"

import Button from "primevue/button"
import Card from "primevue/card"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Dialog from "primevue/dialog"
import InputText from "primevue/inputtext"
import InputNumber from "primevue/inputnumber"
import Textarea from "primevue/textarea"
import Select from "primevue/select"

import DeleteConfirmDialog from "@/ui/components/dashboard/DeleteConfirmDialog.vue"
import DashboardStats from "@/ui/components/dashboard/DashboardStats.vue"

import {
  getEquipementsCompany,
  createEquipementCompany,
  updateEquipementCompany,
  deleteEquipementCompany
} from "@/services/equipementCompany"

import { fetchEquipementTypes } from "@/services/equipement"

import type {
  CreateEquipementCompany,
  EquipementCompanyReadDto
} from "@/types/equipementCompany"

import type { EquipementType } from "@/types/equipementType"

import router from "@/router"
import type { UpdateDomainDto } from "@/types/domain"


export default defineComponent({

  name: "VendorDashBoardPage",

  components: {
    Button,
    Card,
    DataTable,
    Column,
    Dialog,
    InputText,
    InputNumber,
    Textarea,
    Select,
    DeleteConfirmDialog,
    DashboardStats
  },

  setup() {

    const showCreateDialog = ref(false)
    const showEditDialog = ref(false)
    const showDeleteDialog = ref(false)

    const isSubmitting = ref(false)
    const submitError = ref<string | null>(null)

    const equipments = ref<EquipementCompanyReadDto[]>([])
    const equipementTypes = ref<EquipementType[]>([])
    const equipToDelete = ref<EquipementCompanyReadDto | null>(null)
    const domains = ref<Domain[]>([])

    const stats = ref([
      { label: "Annonces", value: 12, change: "+2", icon: "pi-briefcase" },
      { label: "Réservations", value: 8, change: "+1", icon: "pi-calendar" },
      { label: "Revenus", value: "2450€", change: "+12%", icon: "pi-euro" },
      { label: "Remplissage", value: "78%", change: "+5%", icon: "pi-chart-line" }
    ])


    const form = ref<Partial<CreateEquipementCompany>>({
      companyId: "",
      equipementTypeId: "",
      displayName: "",
      description: "",
      pricePerDay: undefined,
      stock: "1"
    })


    const editForm = ref<EquipementCompanyReadDto>({
      equipementCompanyId: "",
      displayName: "",
      description: "",
      pricePerDay: 0,
      stock: "",
      companyId: "",
      equipementTypeId: ""
    })


    const loadEquipementTypes = async () => {
      equipementTypes.value = await fetchEquipementTypes()
    }

    const loadEquipements = async () => {
      equipments.value = await getEquipementsCompany()
    }


    const handleCreateEquipement = async (item: Partial<CreateEquipementCompany>) => {

      submitError.value = null

      if (!item.displayName || !item.pricePerDay || !item.equipementTypeId) {
        submitError.value = "Nom, prix et type requis"
        return
      }

      isSubmitting.value = true

      try {

        const newEquip = await createEquipementCompany(item as CreateEquipementCompany)

        equipments.value.push(newEquip)

        showCreateDialog.value = false

        form.value = {
          companyId: "",
          equipementTypeId: "",
          displayName: "",
          description: "",
          pricePerDay: undefined,
          stock: "1"
        }

      } catch {

        submitError.value = "Erreur création"

      } finally {

        isSubmitting.value = false

      }

    }


    const editEquipement = (row: EquipementCompanyReadDto) => {

      editForm.value = { ...row }
      showEditDialog.value = true

    }


    const handleUpdateEquipement = async (item: EquipementCompanyReadDto) => {

      if (!item.equipementCompanyId) return

      isSubmitting.value = true

      try {

        const updated = await updateEquipementCompany(item.equipementCompanyId, item)

        const index = equipments.value.findIndex(
          e => e.equipementCompanyId === updated.equipementCompanyId
        )

        if (index !== -1) equipments.value[index] = updated

        showEditDialog.value = false

      } finally {

        isSubmitting.value = false

      }

    }


    const confirmDeleteEquipement = (row: EquipementCompanyReadDto) => {
      equipToDelete.value = row
      showDeleteDialog.value = true
    }


    const deleteConfirmed = async () => {

      if (!equipToDelete.value?.equipementCompanyId) return

      await deleteEquipementCompany(equipToDelete.value.equipementCompanyId)

      equipments.value = equipments.value.filter(
        e => e.equipementCompanyId !== equipToDelete.value!.equipementCompanyId
      )

      showDeleteDialog.value = false

    }


    const viewEquipement = (row: EquipementCompanyReadDto) => {
      router.push(`/productDetails/${row.equipementCompanyId}`)
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
      handleCreateEquipement,
      editEquipement,
      handleUpdateEquipement,
      confirmDeleteEquipement,
      deleteConfirmed,
      viewEquipement
    }

  }

})
</script>