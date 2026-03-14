<template>
  <Dialog
    header="Confirmation"
    :visible="visible"
    modal
    @update:visible="$emit('update:visible', $event)"
  >
    <p>{{ message }}</p>

    <div class="flex justify-end gap-2 mt-4">
      <Button
        label="Annuler"
        class="p-button-text"
        @click="$emit('update:visible', false)"
      />

      <Button
        label="Oui, supprimer"
        class="p-button-danger"
        @click="$emit('confirm')"
      />
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import Dialog from "primevue/dialog"
import Button from "primevue/button"

export default defineComponent({
  name: "DeleteConfirmDialog",

  components: {
    Dialog,
    Button
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: "Êtes-vous sûr ?"
    }
  },

  emits: ["update:visible", "confirm"]
})
</script>