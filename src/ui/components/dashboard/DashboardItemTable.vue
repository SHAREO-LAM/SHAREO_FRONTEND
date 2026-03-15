<template>
  <Card class="mt-8">
    <template #title>{{ title }}</template>
    <template #content>
      <DataTable :value="items" responsiveLayout="scroll" class="w-full">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
        <Column header="Actions">
          <template #body="{ data }">
            <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-secondary mr-2" @click="onView(data)" />
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info mr-2" @click="onEdit(data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="onDelete(data)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'ItemTable',
  props: {
    title: { type: String, default: 'Tableau' },
    items: { type: Array as PropType<any[]>, required: true },
    columns: { type: Array as PropType<{field: string, header: string}[]>, required: true },
    onView: { type: Function as PropType<(item: any) => void>, required: true },
    onEdit: { type: Function as PropType<(item: any) => void>, required: true },
    onDelete: { type: Function as PropType<(item: any) => void>, required: true }
  }
})
</script>