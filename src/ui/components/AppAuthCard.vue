<template>
  <section class="app-auth-page">
    <Card class="app-auth-card glass-panel">
      <template #title>
        <h1 class="section-title">{{ title }}</h1>
      </template>
      <template #subtitle>
        <p class="section-lead">{{ subtitle }}</p>
      </template>
      <template #content>
        <Message v-if="error" severity="error" :closable="false" class="mb-4">{{ error }}</Message>
        <Message v-if="success" severity="success" :closable="false" class="mb-4">{{ success }}</Message>
        <slot />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Message from 'primevue/message'

defineProps<{
  title: string
  subtitle: string
  error?: string | null
  success?: string | null
}>()
</script>
