<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">

      <!-- En-tête -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl mb-2">Tableau de bord prestataire</h1>
          <p class="text-gray-600">
            Gérez vos annonces et vos réservations
          </p>
        </div>

        <Button
          icon="pi pi-plus"
          label="Créer une annonce"
          class="bg-orange-500 hover:bg-orange-600 border-none"
          @click="showCreateDialog = true"
        />
      </div>

      <!-- Dialog création annonce -->
      <Dialog
        v-model:visible="showCreateDialog"
        modal
        header="Créer une nouvelle annonce"
        class="w-full max-w-2xl"
      >
        <form class="space-y-6 mt-4">
          <div>
            <label class="block mb-2 font-medium">Type d’annonce</label>
            <Dropdown
              v-model="form.type"
              :options="listingTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un type"
              class="w-full"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Nom de l’annonce</label>
            <InputText
              v-model="form.name"
              placeholder="Ex : Grande salle de réception"
              class="w-full"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">Description</label>
            <Textarea
              v-model="form.description"
              rows="4"
              placeholder="Décrivez votre lieu ou votre équipement..."
              class="w-full"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 font-medium">Prix par jour (€)</label>
              <InputText v-model="form.price" type="number" placeholder="2500" />
            </div>
            <div>
              <label class="block mb-2 font-medium">Capacité (personnes)</label>
              <InputText v-model="form.capacity" type="number" placeholder="300" />
            </div>
          </div>

          <div>
            <label class="block mb-2 font-medium">Localisation</label>
            <InputText placeholder="Ville, Pays" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 font-medium">Équipements</label>
            <InputText placeholder="WiFi, Parking, Restauration" class="w-full" />
          </div>

          <div>
            <label class="block mb-2 font-medium">Photos</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <i class="pi pi-plus text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-600">Cliquez pour ajouter ou glissez-déposez</p>
              <p class="text-sm text-gray-500">PNG, JPG – 10 Mo max</p>
            </div>
          </div>

          <div class="flex gap-4">
            <Button label="Créer l’annonce" class="flex-1 bg-blue-600 border-none" />
            <Button
              label="Annuler"
              severity="secondary"
              outlined
              @click="showCreateDialog = false"
            />
          </div>
        </form>
      </Dialog>

      <!-- Statistiques -->
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

      <!-- Disponibilités -->
      <Card class="max-w-md">
        <template #title>Gestion des disponibilités</template>
        <template #content>
          <p class="text-sm text-gray-600 mb-4">
            Cliquez sur les dates pour les rendre indisponibles
          </p>

          <DatePicker v-model="selectedDates" selectionMode="multiple" class="w-full" />
          <Button label="Enregistrer" class="w-full mt-4" />
        </template>
      </Card>

      <!-- Réservations à venir -->
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
                  :class="data.status === 'confirmée'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'"
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
import { defineComponent, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
// ... autres imports

export default defineComponent({
  name: 'VendorDashBoardPage',
  setup() {
    const showCreateDialog = ref(false)
    const selectedDates = ref([])

    const form = ref({
      type: null,
      name: '',
      description: '',
      price: null,
      capacity: null
    })

    const listingTypes = [
      { label: 'Lieu', value: 'venue' },
      { label: 'Équipement', value: 'equipment' }
    ]

    const stats = [
      { label: 'Annonces actives', value: 12, change: '+2', icon: 'pi-home' },
      { label: 'Réservations', value: 34, change: '+5', icon: 'pi-calendar' },
      { label: 'Vues', value: 1280, change: '+12%', icon: 'pi-eye' },
      { label: 'Revenus', value: '18 500 €', change: '+8%', icon: 'pi-euro' }
    ]

    const upcomingBookings = [
      {
        listing: 'Salle Prestige',
        customer: 'Entreprise ABC',
        date: '12/03/2026',
        amount: 2500,
        status: 'confirmée'
      },
      {
        listing: 'Projecteur HD',
        customer: 'Startup XYZ',
        date: '18/03/2026',
        amount: 450,
        status: 'en attente'
      }
    ]

    return {
      showCreateDialog,
      selectedDates,
      form,
      listingTypes,
      stats,
      upcomingBookings
    }
  }
})
</script>
