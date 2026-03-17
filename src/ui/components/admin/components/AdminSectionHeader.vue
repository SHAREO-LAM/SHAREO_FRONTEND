<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <h2 class="text-2xl font-semibold text-slate-900">{{ title }}</h2>
    <Button
      v-if="actionLabel"
      :icon="actionIcon"
      :label="actionLabel"
      @click="$emit('action')"
      severity="warn"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

withDefaults(
  defineProps<{
    title: string
    actionLabel?: string
    actionIcon?: string
  }>(),
  {
    actionLabel: undefined,
    actionIcon: 'pi pi-plus',
  },
)

defineEmits<{
  action: []
}>()
</script>
