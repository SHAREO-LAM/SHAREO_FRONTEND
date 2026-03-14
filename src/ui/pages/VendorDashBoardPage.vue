<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">

      <!-- HEADER -->
      <div class="mb-8">
        <h1 class="text-3xl mb-2">Tableau de bord prestataire</h1>
        <p class="text-gray-600">Gérez vos annonces et vos réservations</p>
      </div>

      <!-- STATS -->
      <DashboardStats :stats="stats" />

      <!-- TABS -->
      <Tabs value="equipements" class="mt-8">

        <TabList>
          <Tab value="equipements">Équipements</Tab>
          <Tab value="domains">Domaines</Tab>
        </TabList>

        <TabPanels>

          <!-- EQUIPEMENTS -->
          <TabPanel value="equipements">

            <div class="bg-white rounded-xl shadow p-6">

              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold">Mes équipements</h2>

                <Button icon="pi pi-plus" label="Créer un équipement" class="bg-orange-500 border-none"
                  @click="showCreateDialog = true" />
              </div>

              <EquipementsTable :equipments="equipments" @view="viewEquipement" @edit="editEquipement"
                @delete="confirmDeleteEquipement" />

            </div>

          </TabPanel>

          <!-- DOMAINES -->
          <TabPanel value="domains">

            <div class="bg-white rounded-xl shadow p-6">

              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold">Mes domaines</h2>

                <Button icon="pi pi-plus" label="Créer un domaine" class="bg-orange-500 border-none"
                  @click="showCreateDomainDialog = true" />
              </div>

              <DomainsTable :domains="domains" @view="viewDomain" @edit="editDomain" @delete="confirmDeleteDomain" />

            </div>

          </TabPanel>

        </TabPanels>

      </Tabs>
    </div>

    <!-- CREATE EQUIPEMENT -->
    <Dialog v-model:visible="showCreateDialog" header="Créer un équipement" modal class="w-full max-w-2xl">

      <form class="space-y-4 mt-4" @submit.prevent="handleCreateEquipement(form)">

        <div>
          <label>Type équipement</label>
          <Select v-model="form.equipementTypeId" :options="equipementTypes" optionLabel="name"
            optionValue="equipementTypeId" placeholder="Choisir" class="w-full" />
        </div>

        <div>
          <label>Nom annonce</label>
          <InputText v-model="form.displayName" class="w-full" />
        </div>

        <div>
          <label>Description</label>
          <Textarea v-model="form.description" rows="3" class="w-full" />
        </div>

        <div>
          <label>Prix / jour</label>
          <InputNumber v-model="form.pricePerDay" class="w-full" />
        </div>

        <div>
          <label>Stock</label>
          <InputText v-model="form.stock" class="w-full" />
        </div>

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting" />
          <Button label="Annuler" severity="secondary" @click="showCreateDialog = false" />
        </div>

        <p v-if="submitError" class="text-red-500">{{ submitError }}</p>

      </form>

    </Dialog>

    <!-- CREATE DOMAIN -->
    <Dialog v-model:visible="showCreateDomainDialog" header="Créer un domaine" modal class="w-full max-w-2xl">

      <form class="space-y-4 mt-4" @submit.prevent="handleCreateDomain(domainForm)">

        <div>
          <label>Nom du domaine</label>
          <InputText v-model="domainForm.name" class="w-full" />
        </div>

        <div>
          <label>Description</label>
          <Textarea v-model="domainForm.description" rows="3" class="w-full" />
        </div>

        <div>
          <label>Ville</label>
          <InputText v-model="domainForm.city" class="w-full" />
        </div>

        <div>
          <label>Pays</label>
          <InputText v-model="domainForm.country" class="w-full" />
        </div>

        <div>
          <label>Prix / jour</label>
          <InputNumber v-model="domainForm.pricePerDay" class="w-full" :min="1" />
        </div>

        <div>
          <label>Capacité</label>
          <InputText v-model="domainForm.capacity" type="number" class="w-full" />
        </div>

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting" />
          <Button label="Annuler" severity="secondary" @click="showCreateDomainDialog = false" />
        </div>

      </form>

    </Dialog>

    <!-- EDIT EQUIPEMENT -->
    <Dialog v-model:visible="showEditDialog" header="Modifier un équipement" modal class="w-full max-w-2xl">

      <form class="space-y-4 mt-4" @submit.prevent="handleUpdateEquipement(editForm)">

        <div>
          <label>Nom annonce</label>
          <InputText v-model="editForm.displayName" class="w-full" />
        </div>

        <div>
          <label>Description</label>
          <Textarea v-model="editForm.description" rows="3" class="w-full" />
        </div>

        <div>
          <label>Prix / jour</label>
          <InputNumber v-model="editForm.pricePerDay" class="w-full" />
        </div>

        <div>
          <label>Stock</label>
          <InputText v-model="editForm.stock" class="w-full" />
        </div>

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting" />
          <Button label="Annuler" severity="secondary" @click="showEditDialog = false" />
        </div>

      </form>

    </Dialog>

    <!-- EDIT DOMAIN -->
    <Dialog v-model:visible="showEditDomainDialog" header="Modifier un domaine" modal class="w-full max-w-2xl">

      <form class="space-y-4 mt-4" @submit.prevent="handleUpdateDomain(editDomainForm)">

        <div>
          <label>Nom du domaine</label>
          <InputText v-model="editDomainForm.name" class="w-full" />
        </div>

        <div>
          <label>Description</label>
          <Textarea v-model="editDomainForm.description" rows="3" class="w-full" />
        </div>

        <div>
          <label>Ville</label>
          <InputText v-model="editDomainForm.city" class="w-full" />
        </div>

        <div>
          <label>Pays</label>
          <InputText v-model="editDomainForm.country" class="w-full" />
        </div>

        <div>
          <label>Prix / jour</label>
          <InputNumber v-model="editDomainForm.pricePerDay" class="w-full" />
        </div>

        <div>
          <label>Capacité</label>
          <InputText v-model="editDomainForm.capacity" class="w-full" />
        </div>

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting" />
          <Button label="Annuler" severity="secondary" @click="showEditDomainDialog = false" />
        </div>

      </form>

    </Dialog>

    <!-- DELETE -->
    <DeleteConfirmDialog :visible="showDeleteDialog" message="Supprimer cette annonce ?"
      :onConfirm="() => deleteAction && deleteAction()" :onCancel="() => showDeleteDialog = false" />


    <div>
      <CompanyOrdersTable></CompanyOrdersTable>
    </div>

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
import Tabs from "primevue/tabs"
import TabList from "primevue/tablist"
import Tab from "primevue/tab"
import TabPanels from "primevue/tabpanels"
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

import {
  getDomains,
  createDomain,
  updateDomain,
  deleteDomain
} from "@/services/domain"

import router from "@/router"
import { useAuthStore } from "@/stores/authStore"

import type { CreateDomain, Domain, UpdateDomainDto } from "@/types/domain"
import DomainsTable from "../components/dashboard/DomainsTable.vue"
import EquipementsTable from "../components/dashboard/EquipementsTable.vue"
import { TabPanel } from "primevue"
import CompanyOrdersTable from "../components/CompanyOrdersTable.vue"
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
    DashboardStats,
    EquipementsTable,
    DomainsTable,
    TabPanel,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    CompanyOrdersTable
  },

  setup() {
    const authStore = useAuthStore()
    const showCreateDialog = ref(false)
    const showEditDialog = ref(false)
    const showDeleteDialog = ref(false)

    const isSubmitting = ref(false)
    const submitError = ref<string | null>(null)

    const equipments = ref<EquipementCompanyReadDto[]>([])
    const equipementTypes = ref<EquipementType[]>([])
    const equipToDelete = ref<EquipementCompanyReadDto | null>(null)


    const domains = ref<Domain[]>([])
    const domainToDelete = ref<Domain | null>(null)

    const showCreateDomainDialog = ref(false)
    const showEditDomainDialog = ref(false)
    const deleteAction = ref<(() => Promise<void>) | null>(null)
    const stats = ref([
      { label: "Annonces", value: 12, change: "+2", icon: "pi-briefcase" },
      { label: "Réservations", value: 8, change: "+1", icon: "pi-calendar" },
      { label: "Revenus", value: "2450€", change: "+12%", icon: "pi-euro" },
      { label: "Remplissage", value: "78%", change: "+5%", icon: "pi-chart-line" }
    ])


    const formEquipement = ref<Partial<CreateEquipementCompany>>({
      companyId: authStore.user?.companyId ?? "",
      equipementTypeId: "",
      displayName: "",
      description: "",
      pricePerDay: undefined,
      stock: "1"
    })


    const editFormEquipement = ref<EquipementCompanyReadDto>({
      equipementCompanyId: "",
      displayName: "",
      description: "",
      pricePerDay: 0,
      stock: "",
      companyId: authStore.user?.companyId ?? "",
      equipementTypeId: ""
    })

    const domainForm = ref<Partial<CreateDomain>>({
      name: "",
      description: "",
      city: "",
      country: "",
      pricePerDay: undefined,
      capacity: "",
      companyId: authStore.user?.companyId ?? ""
    })

    const editDomainForm = ref<Domain>({
      domainId: "",
      name: "",
      description: "",
      city: "",
      country: "",
      pricePerDay: 0,
      capacity: "",
      datetimeCreate: ""
    })

    const loadDomains = async () => {
      domains.value = await getDomains()
    }
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
      item.companyId = authStore.user?.companyId
      isSubmitting.value = true

      try {

        const newEquip = await createEquipementCompany(item as CreateEquipementCompany)

        equipments.value.push(newEquip)

        showCreateDialog.value = false

        formEquipement.value = {
          companyId: authStore.user?.companyId ?? "",
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

      editFormEquipement.value = { ...row }
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
      deleteAction.value = deleteEquipementConfirmed
      showDeleteDialog.value = true
    }

    const deleteEquipementConfirmed = async () => {

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


    const handleCreateDomain = async (item: Partial<CreateDomain>) => {

      if (!item.name || !item.pricePerDay) return

      try {
        item.companyId = authStore.user?.companyId
        const newDomain = await createDomain(item as CreateDomain)

        domains.value.push(newDomain)

        showCreateDomainDialog.value = false

        domainForm.value = {
          name: "",
          description: "",
          city: "",
          country: "",
          pricePerDay: undefined,
          capacity: "",
          companyId: authStore.user?.companyId ?? ""
        }

      } catch (e) {
        console.error("Erreur création domain", e)
      }
    }
    const editDomain = (row: Domain) => {

      editDomainForm.value = { ...row }

      showEditDomainDialog.value = true
    }

    const viewDomain = (row: Domain) => {
      router.push(`/productDetails/${row.domainId}`)
    }

    const handleUpdateDomain = async (item: Domain) => {

      if (!item.domainId) return

      const updateDomainDto: UpdateDomainDto = {
        name: item.name,
        description: item.description ?? '',
        city: item.city ?? '',
        country: item.country ?? '',
        pricePerDay: item.pricePerDay ?? 0,
        capacity: item.capacity ?? ''
      }
      const updated = await updateDomain(item.domainId, updateDomainDto)

      const index = domains.value.findIndex(
        d => d.domainId === item.domainId
      )
      const updatedDomain = { ...updated, domainId: item.domainId, datetimeCreate: item.datetimeCreate } as Domain

      if (index !== -1) domains.value[index] = updatedDomain

      showEditDomainDialog.value = false
    }


    const confirmDeleteDomain = (row: Domain) => {
      domainToDelete.value = row
      deleteAction.value = deleteDomainConfirmed
      showDeleteDialog.value = true
    }

    const deleteDomainConfirmed = async () => {
      if (!domainToDelete.value?.domainId) return

      await deleteDomain(domainToDelete.value.domainId)

      domains.value = domains.value.filter(
        d => d.domainId !== domainToDelete.value!.domainId
      )

      showDeleteDialog.value = false
    }

    onMounted(async () => {
      await loadEquipementTypes()
      await loadEquipements()
      await loadDomains()
    })


    return {
      showCreateDialog,
      showEditDialog,
      showDeleteDialog,
      isSubmitting,
      submitError,
      form: formEquipement,
      editForm: editFormEquipement,
      equipments,
      equipementTypes,
      stats,
      handleCreateEquipement,
      editEquipement,
      handleUpdateEquipement,
      confirmDeleteEquipement,
      viewEquipement,
      domains,
      domainForm,
      editDomainForm,
      showCreateDomainDialog,
      showEditDomainDialog,
      handleCreateDomain,
      editDomain,
      handleUpdateDomain,
      confirmDeleteDomain,
      deleteDomainConfirmed,
      deleteAction,
      viewDomain
    }

  }

})
</script>