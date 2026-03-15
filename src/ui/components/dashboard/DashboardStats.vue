<template>
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
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Stat {
  label: string
  value: string | number
  change: string
  icon: string
}

export default defineComponent({
  name: 'DashboardStats',
  props: {
    stats: {
      type: Array as PropType<Stat[]>,
      required: true
    }
  }
})
</script>