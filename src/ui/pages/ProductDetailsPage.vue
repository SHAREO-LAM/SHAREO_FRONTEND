<template>
  <div class="product-details-page">
    <div class="container mx-auto px-4 py-8 product-details"
      v-if="(productType === 'domain' && domain) || (productType === 'equipment' && equipement)">
      <!-- IMAGE GALLERY -->
      <section class="gallery">
        <div class="gallery-grid">
          <!-- Image principale à gauche -->
          <div class="gallery-main" @click="openGallery(0)">
            <img :src="displayImages[0]" alt="Image principale" />
          </div>

          <!-- Images secondaires à droite -->
          <div class="gallery-side" v-if="displayImages.length > 1">
            <div
              v-for="(image, index) in displayImages.slice(1, 5)"
              :key="`${image}-${index}`"
              class="gallery-thumb"
              @click="openGallery(index + 1)"
            >
              <img :src="image" alt="Image produit" />
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERIA LIGHTBOX -->
      <Galleria v-model:visible="displayGallery" v-model:activeIndex="activeIndex" :value="displayImages" :numVisible="5"
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
                <DatePicker
                  v-model="startDate"
                  showIcon
                  fluid
                  :min-date="minDate"
                  :disabled-dates="disabledDatesObjects"
                  date-format="dd/mm/yy"
                  placeholder="Choisir une date"
                >
                  <template #date="slotProps">
                    <span v-if="isUnavailable(slotProps.date)" style="text-decoration: line-through;">
                      {{ slotProps.date.day }}
                    </span>
                    <template v-else>{{ slotProps.date.day }}</template>
                  </template>
                </DatePicker>
            </div>

            <div class="date-field">
              <label>Fin</label>
              <DatePicker
                v-model="endDate"
                showIcon
                fluid
                :min-date="startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : minDate"
                :disabled-dates="disabledDatesObjects"
                date-format="dd/mm/yy"
                placeholder="Choisir une date"
                :disabled="!startDate"
              >
                <template #date="slotProps">
                  <span v-if="isUnavailable(slotProps.date)" style="text-decoration: line-through;">
                    {{ slotProps.date.day }}
                  </span>
                  <template v-else>{{ slotProps.date.day }}</template>
                </template>
              </DatePicker>
            </div>
          </div>
          <div>
            <p class="text-center" v-if="hasUnavailableDateInRange" style="color: red;">
              Cette période contient des dates indisponibles.
            </p>
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

          <Button
            label="Réserver"
            severity="warn"
            :disabled="!startDate || !endDate || hasUnavailableDateInRange"
            @click="handleBookNow"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'primeicons/primeicons.css';

import { defineComponent } from 'vue';
import Button from 'primevue/button';
import DatePicker, { type DatePickerDateSlotOptions } from 'primevue/datepicker';
import Badge from 'primevue/badge';
import Galleria from 'primevue/galleria';
import InputNumber from 'primevue/inputnumber';

import { getDomain, getUnavailableDates } from '@/services/domain';
import { getEquipementCompany, getUnavailableDatesEquipement } from '@/services/equipementCompany';
import type { Domain, UpdateDomainDto } from '@/types/domain';
import type { EquipementCompanyReadDto } from '@/types/equipementCompany';
import CompanyCard from '@/ui/components/CompanyCard.vue';
import type { Company } from '@/types/company';
import { getCompany } from '@/services/company';
import { useCartStore } from '@/stores/cartStore';
import type { CartItem } from '@/types/cartItem';

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
      equipement: null as EquipementCompanyReadDto | null,
      company: undefined as Company | undefined,
      unavailableDates: [] as string[],
      hasUnavailableDateInRange: false,
      displayGallery: false,
      activeIndex: 0,
      fallbackImages: [
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
      //if (this.productType === 'domain') return this.domain?.description ?? '';
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
    disabledDatesObjects(): Date[] {
      return this.unavailableDates.map(d => new Date(d));
    },
    productImages(): string[] {
      if (this.productType === 'domain') {
        const fromArray = this.domain?.imageUrls?.filter(Boolean) ?? [];
        if (fromArray.length > 0) return fromArray;
        return this.domain?.imageUrl ? [this.domain.imageUrl] : [];
      }

      const fromArray = this.equipement?.imageUrls?.filter(Boolean) ?? [];
      if (fromArray.length > 0) return fromArray;
      return this.equipement?.imageUrl ? [this.equipement.imageUrl] : [];
    },
    displayImages(): string[] {
      if (this.productImages.length === 0) return this.fallbackImages;
      return this.productImages.slice(0, 5);
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
        const res = await getUnavailableDates(this.id);
        this.unavailableDates = res.disabledDates ?? [];
      } else if (this.productType === 'equipment') {
        this.equipement = await getEquipementCompany(this.id);
        this.company = await getCompany(this.equipement.companyId!);
        const res = await getUnavailableDatesEquipement(this.id);
        this.unavailableDates = res.disabledDates ?? [];
      }
    },
    isUnavailable(slotDate: DatePickerDateSlotOptions): boolean {
      const date = new Date(slotDate.year, slotDate.month, slotDate.day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return true;

      const dateStr = this.formatDateLocal(date);
      return this.unavailableDates.includes(dateStr!);
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

      const newCartItem = this.productType === 'equipment'
    ? {
        type: 'equipment',
        productId: this.id,
        companyId: this.company.companyId,
        company: this.company,
        product: this.equipement!,
        startDate: this.formatDateLocal(this.startDate),
        endDate: this.formatDateLocal(this.endDate),
        quantity: this.quantity.toString(),
        unitPrice: this.totalPrice
      } as CartItem
    : {
        type: 'domain',
        productId: this.id,
        companyId: this.company.companyId,
        company: this.company,
        product: this.domain!,
        startDate: this.formatDateLocal(this.startDate),
        endDate: this.formatDateLocal(this.endDate),
        unitPrice: this.totalPrice
      } as CartItem;

      if (this.checkItemAlreadyInCart(newCartItem)) {
        this.$toast.add({
          group: 'cart',
          severity: 'info',
          summary: 'Déjà dans le panier',
          detail: `${this.productTitle} est déjà dans le panier pour des dates similaires.`,
          life: 5000
        });
      } else{
        this.cart.addItem(newCartItem)
        this.$toast.add({
          group: 'cart',
          severity: 'success',
          summary: 'Ajouté au panier',
          detail: `${this.productTitle} a bien été ajouté au panier.`,
          life: 5000
        });
      }
    },
    checkRangeAvailability() {
      this.hasUnavailableDateInRange = false;
      if (!this.startDate || !this.endDate) return;

      const current = new Date(this.startDate);
      current.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(0, 0, 0, 0);

      while (current <= end) {
        const dateStr = this.formatDateLocal(current);
        if (this.unavailableDates.includes(dateStr!)) {
          this.hasUnavailableDateInRange = true;
          return;
        }
        current.setDate(current.getDate() + 1);
      }
    },
    checkItemAlreadyInCart(cartItem: CartItem) {
      const cartStore = useCartStore()

      const newStart = new Date(cartItem.startDate!)
      const newEnd = new Date(cartItem.endDate!)

      const itemAlreadyInCart = cartStore.cartItems.find((item) => {
        if (
          item.productId !== cartItem.productId ||
          item.companyId !== cartItem.companyId
        ) {
          return false
        }

        const existingStart = new Date(item.startDate!)
        const existingEnd = new Date(item.endDate!)

        // Vérifie si les périodes se chevauchent (inclusif)
        return newStart <= existingEnd && newEnd >= existingStart
      })

      return !!itemAlreadyInCart
    }
  },
  watch: {
    endDate() {
      this.checkRangeAvailability();
    },
    startDate() {
      this.endDate = null;
      this.hasUnavailableDateInRange = false;
    },
  },
});
</script>

<style scoped lang="scss">
@use '../../assets/scss/views/productDetailsPage.scss';
</style>
