<template>

  <Card class="mt-8">

    <template #title>Mes domaines</template>

    <template #content>

      <DataTable :value="domains" responsiveLayout="scroll">

        <Column field="name" header="Nom" />
        <Column field="description" header="Description" />
        <Column field="pricePerDay" header="Prix / jour" />
        <Column field="capacity" header="Capacité" />
        <Column field="city" header="Ville" />
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

import type { Domain, UpdateDomainDto } from "@/types/domain"

export default defineComponent({

  name: "DomainsTable",

  components: {
    Card,
    DataTable,
    Column,
    Button
  },

  props: {

    domains: {
      type: Array as PropType<Domain[]>,
      required: true
    }

  },

  emits: ["view", "edit", "delete"]

})
</script>