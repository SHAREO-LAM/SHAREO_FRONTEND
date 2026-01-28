<template>
  <div class="company-card">
    <!-- Avatar + infos -->
    <div class="company-content">
      <Avatar :label="vendor?.name?.charAt(0)" class="mr-2" size="xlarge" shape="circle" />

      <div class="info">
        <h3 class="company-name">{{ vendor.name }}</h3>
        <!-- <Button
            label="Contacter"
            severity="info"
            hidden
            @click="contactCompany"
          /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Company } from '@/types/company';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';

export default defineComponent({
  name: 'CompanyCard',
  components: {
    Avatar,
    Button,
  },
  props: {
    vendor: {
      type: Object as PropType<Company>,
      required: true,
    },
  },
  methods: {
    contactCompany() {
      console.log('Contact company', this.vendor.name);
    },
  },
});
</script>


<style scoped lang="scss">
@use '../../assets/scss/components/companyCard.scss';
</style>
