<template>
  <div class="product-details-page">
    <div class="container mx-auto px-4 py-8 product-details"
      v-if="(productType === 'domain' && domain) || (productType === 'equipment' && equipement)">
      <!-- IMAGE GALLERY -->
      <section class="gallery">
        <div class="gallery-grid">
          <!-- Image principale à gauche -->
          <div class="gallery-main" @click="openGallery(0)">
            <img :src="images[0]" alt="Image principale" />
          </div>

          <!-- 4 images à droite -->
          <div class="gallery-side">
            <div v-for="i in 4" :key="i" class="gallery-thumb" @click="openGallery(i)">
              <img :src="images[i]" alt="Image produit" />
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERIA LIGHTBOX -->
      <Galleria v-model:visible="displayGallery" v-model:activeIndex="activeIndex" :value="images" :numVisible="5"
        containerStyle="max-width: 90vw" :circular="true" :fullScreen="true" :showItemNavigators="true"
        :showThumbnails="false">
        <template #item="slotProps">
          <div style="display: flex; justify-content: center; align-items: center; height: 80vh; padding: 20px;">
            <img :src="slotProps.item" alt="Image" style="width: 50vw; height: auto;" />
          </div>
        </template>
      </Galleria>

      <div class="content-grid">
        <!-- LEFT CONTENT -->
        <div class="left-content">
          <!-- TITLE + BADGES -->
          <section class="title-section">
            <h1>{{ productTitle }}</h1>

            <div class="badges">
              <!-- Domain badges -->
              <template v-if="productType === 'domain' && domain">
                <Badge severity="info" class="mr-2">
                  <i class="pi pi-users" style="margin-right: 6px;"></i>
                  {{ domain.capacity }} personnes
                </Badge>

                <Badge severity="success">
                  <i class="pi pi-map-marker" style="margin-right: 6px;"></i>
                  {{ domain.city }}
                </Badge>
              </template>

              <!-- Equipment badges -->
              <template v-else-if="productType === 'equipment' && equipement">
                <Badge severity="info" class="mr-2">
                  <i class="pi pi-box" style="margin-right: 6px;"></i>
                  {{ equipement.equipementType?.name }}
                </Badge>

                <Badge severity="success">
                  <i class="pi pi-tags" style="margin-right: 6px;"></i>
                  {{ equipement.equipementType?.equipementCategory?.name }}
                </Badge>
              </template>
            </div>
          </section>

          <!-- DESCRIPTION -->
          <section class="description">
            <h2>Description</h2>
            <div class="text">
              {{ productDescription }}
            </div>
          </section>

          <!-- ADRESSE (Domain uniquement) -->
          <section class="address" v-if="type === 'domain' && domain">
            <h2>Adresse</h2>

            <p>
              {{ domain.houseNumber }} {{ domain.streetName }}
              <span v-if="domain.streetNameAdd">
                {{ domain.streetNameAdd }}
              </span>
            </p>

            <p>
              {{ domain.postcode }} {{ domain.city }}
            </p>

            <p v-if="domain.country">
              {{ domain.country }}
            </p>
          </section>

          <!-- VENDOR -->
          <section class="vendor">
            <h2>Entreprise</h2>
            <CompanyCard v-if="company" :vendor="company" />
          </section>
        </div>

        <!-- RIGHT CONTENT -->
        <aside class="booking-card">
          <div class="price">
            {{ productPrice }} € / jour
          </div>

          <!-- Quantity (only for equipment) -->
          <div class="quantity-field" v-if="type === 'equipment' && equipement">
            <label for="quantity">Quantité</label>
            <InputNumber v-model="quantity" :min="1" :max="equipement?.stock ? Number(equipement.stock) : 100"
              showButtons inputId="quantity" />
            <small v-if="equipement?.stock">
              Stock disponible : {{ equipement.stock }}
            </small>
          </div>

          <!-- Dates -->
          <div class="date-fields">
            <div class="date-field">
              <label>Début</label>
              <DatePicker v-model="startDate" showIcon fluid :min-date="minDate" date-format="dd/mm/yy"
                placeholder="Choisir une date" />
            </div>

            <div class="date-field">
              <label>Fin</label>
              <DatePicker v-model="endDate" showIcon fluid :min-date="startDate || minDate" date-format="dd/mm/yy"
                placeholder="Choisir une date" :disabled="!startDate" />
            </div>
          </div>

          <!-- Résumé -->
          <div class="summary">
            <div class="line">
              <span>{{ numberOfDays }} jour(s)</span>
              <span>{{ totalPrice }} €</span>
            </div>
            <div class="line" v-if="type === 'equipment'">
              <span>Quantité</span>
              <span>{{ quantity }}</span>
            </div>
            <div class="line total">
              <span>Total</span>
              <span>{{ totalPrice * (type === 'equipment' ? quantity : 1) }} €</span>
            </div>
          </div>

          <Button label="Réserver" severity="warn" :disabled="!startDate || !endDate" @click="handleBookNow" />
        </aside>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'primeicons/primeicons.css';

import { defineComponent } from 'vue';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Badge from 'primevue/badge';
import Galleria from 'primevue/galleria';
import InputNumber from 'primevue/inputnumber';

import { getDomain } from '@/services/domain';
import { getEquipementCompany } from '@/services/equipementCompany';
import type { Domain } from '@/types/domain';
import type { EquipementCompanyRead } from '@/types/equipementCompany';
import CompanyCard from '@/ui/components/CompanyCard.vue';
import type { Company } from '@/types/company';
import { getCompany } from '@/services/company';
import { useCartStore } from '@/stores/cartStore';

export default defineComponent({
  name: 'ProductDetailsPage',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Button,
    DatePicker,
    Badge,
    Galleria,
    InputNumber,
    CompanyCard,
  },
  props: {
    type: {
      type: String as () => 'domain' | 'equipment',
      default: 'domain',
    },
  },
  data() {
    return {
      domain: null as Domain | null,
      equipement: null as EquipementCompanyRead | null,
      company: undefined as Company | undefined,
      displayGallery: false,
      activeIndex: 0,
      images: [
        'https://placehold.co/1200x900',
        'https://placehold.co/800x800',
        'https://placehold.co/800x800',
        'https://placehold.co/800x800',
        'https://placehold.co/800x800',
      ],
      quantity: 1,
      startDate: null as Date | null,
      endDate: null as Date | null,
      minDate: new Date(),
    };
  },
  computed: {
    cart() {
      return useCartStore();
    },
    id(): string {
      return this.$route.params.id as string;
    },
    productType(): 'domain' | 'equipment' {
      return (this.$route.query.type as 'domain' | 'equipment') || this.$props.type || 'domain';
    },
    productTitle(): string {
      if (this.productType === 'domain') return this.domain?.name ?? '';
      if (this.productType === 'equipment') return this.equipement?.displayName ?? '';
      return '';
    },
    productDescription(): string {
      if (this.productType === 'domain') return this.domain?.description ?? '';
      if (this.productType === 'equipment') return this.equipement?.description ?? '';
      return '';
    },
    productPrice(): number {
      if (this.productType === 'domain') return this.domain?.pricePerDay ?? 0;
      if (this.productType === 'equipment') return this.equipement?.pricePerDay ?? 0;
      return 0;
    },
    numberOfDays(): number {
      if (!this.startDate || !this.endDate) return 0;
      const diff = this.endDate.getTime() - this.startDate.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
    totalPrice(): number {
      return this.numberOfDays * this.productPrice;
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    openGallery(index: number) {
      this.activeIndex = index;
      this.displayGallery = true;
    },
    async loadData() {
      if (this.productType === 'domain') {
        this.domain = await getDomain(this.id);
        this.company = await getCompany(this.domain.companyId!);
      } else if (this.productType === 'equipment') {
        this.equipement = await getEquipementCompany(this.id);
        this.company = await getCompany(this.equipement.companyId!);
      }
    },
    formatDateLocal(date?: Date | null): string | undefined {
      if (!date) return undefined;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    handleBookNow() {
      if (!this.company) return

      this.cart.addItem({
        type: this.productType,
        productId: this.id,
        companyId: this.company.companyId,
        company: this.company,
        product: this.productType === 'equipment'
          ? this.equipement!
          : this.domain!,
        startDate: this.formatDateLocal(this.startDate),
        endDate: this.formatDateLocal(this.endDate),
        quantity: this.productType === 'equipment'
          ? this.quantity.toString()
          : undefined,
        unitPrice: this.totalPrice
      })
      console.log(this.cart.cartItems);

      this.$toast.add({
        severity: 'success',
        summary: 'Ajouté au panier',
        detail: `${this.productTitle} a bien été ajouté au panier.`,
        life: 5000
      });
    }
  },
});
</script>

<style scoped lang="scss">
@use '../../assets/scss/views/productDetailsPage.scss';
</style>
