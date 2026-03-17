<template>
  <div class="rounded-xl border border-slate-200 bg-white/90 py-10 text-center shadow-sm" :class="containerClass">
    <i v-if="icon" :class="[icon, 'mb-4 text-4xl text-gray-300']"></i>
    <p class="text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string
    icon?: string
    containerClass?: string
  }>(),
  {
    icon: undefined,
    containerClass: '',
  },
)
</script>
