<template>
  <div class="company-card">
    <!-- Avatar + infos -->
    <div class="company-content">
      <Avatar :label="vendor?.name?.charAt(0)" class="mr-2" size="xlarge" shape="circle" />

      <div class="info">
        <h3 class="company-name">{{ vendor.name }}</h3>
        <Button
            label="Contacter"
            severity="info"
            @click="contactCompany"
          />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Company } from '@/types/company';
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'


const props = defineProps<{ vendor: Company }>()

function contactCompany() {
  console.log('Contact company', props.vendor.name)
}
</script>


<style scoped lang="scss">
@use '../../assets/scss/components/companyCard.scss';
</style>
