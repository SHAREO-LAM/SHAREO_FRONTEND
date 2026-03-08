<template>
  <Card>
    <template #title>Mes annonces</template>

    <template #content>

      <DataTable :value="equipments" responsiveLayout="scroll">

        <Column field="displayName" header="Nom" />
        <Column field="pricePerDay" header="Prix (€)" />
        <Column field="stock" header="Stock" />
        <Column field="description" header="Description" />
        <Column field="equipementType.name" header="Type" />

        <Column header="Actions">

          <template #body="{ data }">

            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-text p-button-secondary mr-2"
              @click="$emit('view', data)"
            />

            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text p-button-info mr-2"
              @click="$emit('edit', data)"
            />

            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-text p-button-danger"
              @click="$emit('delete', data)"
            />

          </template>

        </Column>

      </DataTable>

    </template>

  </Card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue"

import Card from "primevue/card"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Button from "primevue/button"

import type { EquipementCompanyReadDto } from "@/types/equipementCompany"

export default defineComponent({

  name: "EquipementsTable",

  components: {
    Card,
    DataTable,
    Column,
    Button
  },

  props: {
    equipments: {
      type: Array as PropType<EquipementCompanyReadDto[]>,
      required: true
    }
  },

  emits: ["view", "edit", "delete"]

})
</script>