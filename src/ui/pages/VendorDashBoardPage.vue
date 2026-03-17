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
      <Tabs v-model:value="activeTab" class="mt-8">

        <TabList>
          <Tab value="equipements">Équipements</Tab>
          <Tab value="domains">Domaines</Tab>
        </TabList>

        <TabPanels>

          <!-- ===================== -->
          <!-- EQUIPEMENTS -->
          <!-- ===================== -->
          <TabPanel value="equipements">

            <div class="bg-white rounded-xl shadow p-6">

              <!-- HEADER -->
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold">Mes équipements</h2>

                <div class="flex gap-3">
                  <InputText v-model="equipementGlobalFilter" placeholder="Rechercher..." class="w-64" />

                  <Button icon="pi pi-plus" label="Créer un équipement" class="bg-orange-500 border-none"
                    @click="showCreateDialog = true" />
                </div>
              </div>

              <!-- TABLE -->
              <DataTable :value="equipments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" sortMode="multiple"
                :filters="equipementFilters" :globalFilterFields="['displayName', 'description', 'stock']"
                responsiveLayout="scroll">

                <Column field="displayName" header="Nom" sortable filter filterPlaceholder="Nom" />

                <Column field="description" header="Description" />

                <Column field="pricePerDay" header="Prix" sortable />

                <Column field="stock" header="Stock" sortable />

                <!-- ACTIONS -->
                <Column header="Actions">
                  <template #body="slotProps">
                    <div class="flex gap-2">
                      <Button icon="pi pi-eye" severity="info" text @click="viewEquipement(slotProps.data)" />
                      <Button icon="pi pi-pencil" severity="warning" text @click="editEquipement(slotProps.data)" />
                      <Button icon="pi pi-trash" severity="danger" text
                        @click="confirmDeleteEquipement(slotProps.data)" />
                    </div>
                  </template>
                </Column>

              </DataTable>

            </div>

          </TabPanel>

          <!-- ===================== -->
          <!-- DOMAINES -->
          <!-- ===================== -->
          <TabPanel value="domains">

            <div class="bg-white rounded-xl shadow p-6">

              <!-- HEADER -->
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold">Mes domaines</h2>

                <div class="flex gap-3">
                  <InputText v-model="domainGlobalFilter" placeholder="Rechercher..." class="w-64" />

                  <Button icon="pi pi-plus" label="Créer un domaine" class="bg-orange-500 border-none"
                    @click="showCreateDomainDialog = true" />
                </div>
              </div>

              <!-- TABLE -->
              <DataTable :value="domains" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" sortMode="multiple"
                :filters="domainFilters" :globalFilterFields="['name', 'city', 'country']" responsiveLayout="scroll">

                <Column field="name" header="Nom" sortable filter filterPlaceholder="Nom" />

                <Column field="city" header="Ville" sortable />

                <Column field="country" header="Pays" sortable />

                <Column field="pricePerDay" header="Prix" sortable />

                <Column field="capacity" header="Capacité" sortable />

                <!-- ACTIONS -->
                <Column header="Actions">
                  <template #body="slotProps">
                    <div class="flex gap-2">
                      <Button icon="pi pi-eye" severity="info" text @click="viewDomain(slotProps.data)" />
                      <Button icon="pi pi-pencil" severity="warning" text @click="editDomain(slotProps.data)" />
                      <Button icon="pi pi-trash" severity="danger" text @click="confirmDeleteDomain(slotProps.data)" />
                    </div>
                  </template>
                </Column>

              </DataTable>

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

        <ImageGalleryManager
          :imageUrls="editForm.imageUrls || undefined"
          :isLoading="isEquipementImageSubmitting"
          @upload="(file) => uploadEquipementImage(editForm.equipementCompanyId ?? '', file)"
          @remove="(index) => removeEquipementImage(editForm.equipementCompanyId ?? '', index)"
        />

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting" />
          <Button label="Annuler" severity="secondary" @click="showEditDialog = false" />
        </div>

        <p v-if="submitError" class="text-red-500">{{ submitError }}</p>

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

        <ImageGalleryManager
          :imageUrls="editDomainForm.imageUrls || undefined"
          :isLoading="isDomainImageSubmitting"
          @upload="(file) => uploadDomainImage(editDomainForm.domainId ?? '', file)"
          @remove="(index) => removeDomainImage(editDomainForm.domainId ?? '', index)"
        />

        <div class="flex gap-4 mt-4">
          <Button label="Enregistrer" type="submit" :loading="isSubmitting" />
          <Button label="Annuler" severity="secondary" @click="showEditDomainDialog = false" />
        </div>

        <p v-if="submitError" class="text-red-500">{{ submitError }}</p>

      </form>

    </Dialog>

    <!-- DELETE -->
    <DeleteConfirmDialog :visible="showDeleteDialog" message="Supprimer cette annonce ?"
      :onConfirm="() => deleteAction && deleteAction()" :onCancel="() => showDeleteDialog = false" />


    <div>
      <CompanyOrdersTable :orders="filteredOrders" />
    </div>

  </div>
</template>

<script lang="ts">

import { defineComponent, ref, onMounted, watch, computed } from "vue"

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
  deleteEquipementCompany,
  getEquipementsCompanyById,
  uploadEquipementImage as uploadEquipementImageRequest,
  deleteEquipementImage as deleteEquipementImageRequest
} from "@/services/equipementCompany"

import { fetchEquipementTypes } from "@/services/equipement"

import type {
  CreateEquipementCompany,
  EquipementCompanyReadDto,
  UpdateEquipementCompanyDto
} from "@/types/equipementCompany"

import type { EquipementType } from "@/types/equipementType"

import {
  getDomains,
  createDomain,
  updateDomain,
  deleteDomain,
  getDomainsByCompanyId,
  uploadDomainImage as uploadDomainImageRequest,
  deleteDomainImage as deleteDomainImageRequest
} from "@/services/domain"

import router from "@/router"
import { useAuthStore } from "@/stores/authStore"

import type { CreateDomain, Domain, UpdateDomainDto } from "@/types/domain"
import DomainsTable from "../components/dashboard/DomainsTable.vue"
import EquipementsTable from "../components/dashboard/EquipementsTable.vue"
import { TabPanel } from "primevue"
import CompanyOrdersTable from "../components/CompanyOrdersTable.vue"
import type { Order } from "@/types/order"
import { getOrdersByCompany } from "@/services/orders"
import type { Stats } from "@/types/stats"
import ImageGalleryManager from "../components/ImageGalleryManager.vue"
import { UI } from "@/constants/const"
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
    CompanyOrdersTable,
    ImageGalleryManager
  },

  setup() {
    const activeTab = ref<'equipements' | 'domains'>('equipements')
    const authStore = useAuthStore()
    const showCreateDialog = ref(false)
    const showEditDialog = ref(false)
    const showDeleteDialog = ref(false)

    const isSubmitting = ref(false)
    const submitError = ref<string | null>(null)
    const isEquipementImageSubmitting = ref(false)
    const isDomainImageSubmitting = ref(false)

    const equipments = ref<EquipementCompanyReadDto[]>([])
    const equipementTypes = ref<EquipementType[]>([])
    const equipToDelete = ref<EquipementCompanyReadDto | null>(null)


    const domains = ref<Domain[]>([])
    const domainToDelete = ref<Domain | null>(null)

    const showCreateDomainDialog = ref(false)
    const showEditDomainDialog = ref(false)
    const deleteAction = ref<(() => Promise<void>) | null>(null)

    const stats = ref<Stats>([])
    const computeStats = () => {
      const isEquipement = activeTab.value === 'equipements'

      const filteredItems = orders.value.flatMap(order =>
        order.orderItems.filter(item =>
          isEquipement ? item.equipementCompany : item.domain
        )
      )

      const totalReservations = filteredItems.length

      const totalRevenue = filteredItems.reduce(
        (sum, item) => sum + item.unitPrice * parseInt(item.quantity),
        0
      )

      const totalAds = isEquipement
        ? equipments.value.length
        : domains.value.length

      const fillRate = totalAds
        ? Math.round((totalReservations / totalAds) * 100)
        : 0

      stats.value = [
        {
          label: "Annonces",
          value: totalAds,
          icon: "pi-briefcase",
          change: "+2"
        },
        {
          label: "Réservations",
          value: totalReservations,
          icon: "pi-calendar",
          change: "+12%"
        },
        {
          label: "Revenus",
          value: `${totalRevenue}€`,
          icon: "pi-euro",
          change: "+5%"
        },
        {
          label: "Remplissage",
          value: `${fillRate}%`,
          icon: "pi-chart-line",
          change: "+3%"
        }
      ]
    }

    const orders = ref<Order[]>([]);
    const loading = ref(false);

    const loadOrders = async () => {
      loading.value = true;
      try {
        const authStore = useAuthStore();
        const data = await getOrdersByCompany(authStore.user?.companyId ?? '');
        orders.value = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
      } finally {
        loading.value = false;
      }
    };

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


    const loadData = async () => {
      if (!authStore.user?.companyId) return

      loading.value = true
      try {
        equipments.value = await getEquipementsCompanyById(authStore.user.companyId)
        domains.value = await getDomainsByCompanyId(authStore.user.companyId)
        equipementTypes.value = await fetchEquipementTypes()

      } catch (err) {
        console.error('Erreur récupération équipements/domaines/types :', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(loadData)


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
      submitError.value = null
      showEditDialog.value = true

    }


    const handleUpdateEquipement = async (item: EquipementCompanyReadDto) => {

      if (!item.equipementCompanyId) return

      const payload: UpdateEquipementCompanyDto = {
        displayName: item.displayName,
        description: item.description ?? '',
        pricePerDay: item.pricePerDay,
        stock: item.stock ?? '',
        equipementTypeId: item.equipementTypeId,
      }

      if (item.companyId && String(item.companyId).trim() !== '') {
        payload.companyId = item.companyId
      }

      isSubmitting.value = true

      try {

        const updated = await updateEquipementCompany(item.equipementCompanyId, payload)

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
      submitError.value = null

      showEditDomainDialog.value = true
    }

    const validateImage = (file: File): string | null => {
      if (!UI.ALLOWED_IMAGE_TYPES.includes(file.type as (typeof UI.ALLOWED_IMAGE_TYPES)[number])) {
        return "Format invalide (PNG, JPEG ou WEBP)"
      }

      if (file.size > UI.MAX_UPLOAD_SIZE_BYTES) {
        return `Fichier trop volumineux (max ${(UI.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)).toFixed(0)}MB)`
      }

      return null
    }

    const uploadEquipementImage = async (equipmentId: string, file: File) => {
      if (!equipmentId || !file) return

      isEquipementImageSubmitting.value = true
      submitError.value = null

      try {
        const updated = await uploadEquipementImageRequest(equipmentId, file)

        editFormEquipement.value = { ...editFormEquipement.value, ...updated }
        const index = equipments.value.findIndex(
          e => e.equipementCompanyId === updated.equipementCompanyId
        )

        if (index !== -1) equipments.value[index] = updated
      } catch (error) {
        submitError.value = "Erreur lors du téléversement de l'image"
        console.error(error)
      } finally {
        isEquipementImageSubmitting.value = false
      }
    }

    const removeEquipementImage = async (equipmentId: string, imageIndex: number) => {
      if (!equipmentId) return

      isEquipementImageSubmitting.value = true
      submitError.value = null

      try {
        const updated = await deleteEquipementImageRequest(equipmentId, imageIndex)
        editFormEquipement.value = { ...editFormEquipement.value, ...updated }

        const index = equipments.value.findIndex(
          e => e.equipementCompanyId === updated.equipementCompanyId
        )

        if (index !== -1) equipments.value[index] = updated
      } catch (error) {
        submitError.value = "Erreur lors de la suppression de l'image"
        console.error(error)
      } finally {
        isEquipementImageSubmitting.value = false
      }
    }

    const uploadDomainImage = async (domainId: string, file: File) => {
      if (!domainId || !file) return

      isDomainImageSubmitting.value = true
      submitError.value = null

      try {
        const updated = await uploadDomainImageRequest(domainId, file)
        editDomainForm.value = { ...editDomainForm.value, ...updated }

        const index = domains.value.findIndex(
          d => d.domainId === updated.domainId
        )

        if (index !== -1) domains.value[index] = updated
      } catch (error) {
        submitError.value = "Erreur lors du téléversement de l'image"
        console.error(error)
      } finally {
        isDomainImageSubmitting.value = false
      }
    }

    const removeDomainImage = async (domainId: string, imageIndex: number) => {
      if (!domainId) return

      isDomainImageSubmitting.value = true
      submitError.value = null

      try {
        const updated = await deleteDomainImageRequest(domainId, imageIndex)
        editDomainForm.value = { ...editDomainForm.value, ...updated }

        const index = domains.value.findIndex(
          d => d.domainId === updated.domainId
        )

        if (index !== -1) domains.value[index] = updated
      } catch (error) {
        submitError.value = "Erreur lors de la suppression de l'image"
        console.error(error)
      } finally {
        isDomainImageSubmitting.value = false
      }
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
    const equipementGlobalFilter = ref("")
    const domainGlobalFilter = ref("")

    const equipementFilters = ref({
      global: { value: '', matchMode: "contains" }
    })

    const domainFilters = ref({
      global: { value: '', matchMode: "contains" }
    })

    watch(equipementGlobalFilter, (val) => {
      equipementFilters.value.global.value = val
    })

    watch(domainGlobalFilter, (val) => {
      domainFilters.value.global.value = val
    })
    const filteredOrders = computed(() =>
      orders.value.filter(order =>
        order.orderItems.some(item =>
          activeTab.value === 'equipements'
            ? item.equipementCompany
            : item.domain
        )
      )
    )


    onMounted(async () => {
      await loadData()
      await loadOrders()
      computeStats()
    })

    watch([activeTab, orders, equipments, domains], computeStats)
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
      viewDomain,
      domainGlobalFilter,
      domainFilters,
      equipementFilters,
      equipementGlobalFilter,
      activeTab,
      filteredOrders,
      onEquipementImageSelected,
      onDomainImageSelected,
      uploadEquipementImage,
      removeEquipementImage,
      uploadDomainImage,
      removeDomainImage,
      isEquipementImageSubmitting,
      isDomainImageSubmitting
    }

  }

})
</script>