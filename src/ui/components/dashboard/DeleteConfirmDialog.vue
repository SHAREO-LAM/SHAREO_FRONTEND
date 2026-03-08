<template>
  <Dialog v-model:visible="visible" modal header="Confirmer">
    <p>{{ message }}</p>
    <div class="flex gap-4 mt-4">
      <Button label="Oui" severity="danger" @click="onConfirm" />
      <Button label="Non" outlined @click="onCancel" />
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'DeleteConfirmDialog',
  props: {
    visible: { type: Boolean, required: true },
    message: { type: String, default: 'Êtes-vous sûr ?' },
    onCancel: { type: Function as PropType<() => void>, required: true },
    onConfirm: { type: Function as PropType<() => void>, required: true }
  }
})
</script>