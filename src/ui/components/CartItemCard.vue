<template>
  <div :class="['flex gap-4', { 'p-4 bg-white rounded-xl shadow-md': !small }]">
    <!-- IMAGE -->
    <div class="flex flex-col w-32 flex-shrink-0">
      <div class="w-full h-24 rounded-lg overflow-hidden">
        <img
          :src="image"
          alt="Produit"
          class="w-full h-full object-cover"
        />
      </div>

      <div>
        <div v-if="item.type === 'equipment' && !small" class="mt-2 flex justify-between items-center text-sm">
          <Button icon="pi pi-minus" severity="secondary" size="small" text
            @click="cart.decreaseQuantity(item.cartItemId!)" />
          <span>{{ item.quantity }}</span>
          <Button icon="pi pi-plus" severity="secondary" size="small" text
            @click="cart.increaseQuantity(item.cartItemId!)" />
        </div>

        <div v-if="item.type === 'domain' && !small" class="mt-2 flex justify-center items-center text-sm">
          <Button icon="pi pi-trash" severity="danger" text size="small"
            @click="cart.removeItem(item.cartItemId!)" />
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <div class="flex justify-between items-start">
        <div>
          <div :class="['block font-semibold mb-1', { 'sm:hidden text-lg': !small }]">
            {{ totalPrice }} €
          </div>

          <h3 :class="['text-md font-semibold', { 'sm:text-lg': !small }]">
            <RouterLink
              :to="{
                path: `/productDetails/${item.productId}`,
                query: { type: item.type },
              }"
              class="cursor-pointer hover:underline"
            >
              {{
                item.type === 'equipment'
                  ? `${item.product.displayName}${small ? ` (x${item.quantity})` : ''}`
                  : item.product.name
              }}
            </RouterLink>
          </h3>

          <!-- BADGES -->
          <div class="hidden sm:flex gap-2 mt-1" v-if="!small">
            <template v-if="item.type === 'domain'">
              <Badge severity="info">
                <i class="pi pi-users mr-1" />
                {{ item.product.capacity }} pers.
              </Badge>

              <Badge severity="success">
                <i class="pi pi-map-marker mr-1" />
                {{ item.product.city }}
              </Badge>
            </template>

            <template v-else-if="item.type === 'equipment'">
              <Badge severity="info">
                <i class="pi pi-box mr-1" />
                {{ item.product.equipementType?.name }}
              </Badge>

              <Badge severity="success">
                <i class="pi pi-tags mr-1" />
                {{ item.product.equipementType?.equipementCategory?.name }}
              </Badge>
            </template>
          </div>

          <!-- DATES -->
          <div class="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
            <i class="pi pi-calendar" v-if="!small" />
            {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
          </div>

          <div class="text-sm text-gray-600 mt-2 flex items-center gap-1.5" v-if="!small">
            <i class="pi pi-building" />
            <span class="hidden sm:block">Proposé par</span>
            <p class="font-bold">{{ item.company.name }}</p>
          </div>
        </div>

        <div class="hidden sm:block text-lg font-semibold" v-if="!small">
          {{ totalPrice }} €
        </div>
      </div>

      <!-- FOOTER -->
      <div class="mt-2" v-if="!small">
        <Button
          :label="expanded ? 'Réduire' : 'En savoir plus'"
          :icon="expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          severity="success"
          variant="text"
          size="small"
          class="px-0"
          @click="toggleExpanded"
        />
      </div>

      <!-- EXPAND -->
      <div v-if="expanded" class="mt-2 text-sm space-y-2 border-t pt-2">
        <div v-if="item.type === 'domain'" class="flex items-center gap-1.5">
          <i class="pi pi-map-marker mt-1" style="color: slateblue;" />

          <div class="min-w-0">
            <span class="font-semibold block">Adresse :</span>

            <p class="break-words">
              {{ item.product.houseNumber }} {{ item.product.streetName }},
              {{ item.product.postcode }} {{ item.product.city }}
            </p>
          </div>
        </div>

        <div v-else-if="item.type === 'equipment'" class="flex items-center gap-1.5">
          <i class="pi pi-map-marker" style="color: slateblue;" />
          <div class="min-w-0">
            <span class="font-semibold block">Retrait :</span>

            <p class="break-words">
              {{ item.company.houseNumber }} {{ item.company.streetName }},
              {{ item.company.postcode }} {{ item.company.city }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import { useCartStore } from '@/stores/cartStore'
import type { CartItem } from '@/types/cartItem'

export default defineComponent({
  name: 'CartItemCard',

  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Button,
    Badge
  },

  props: {
    item: {
      type: Object as () => CartItem,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },

  emits: ['remove'],

  data() {
    return {
      expanded: false,
      cart: useCartStore()
    }
  },

  computed: {
    totalPrice(): number {
      if (this.item.type === 'equipment') {
        return this.item.unitPrice * Number(this.item.quantity || 1)
      }
      return this.item.unitPrice
    },

    image(): string {
      return 'https://placehold.co/400x300'
    }
  },

  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded
    },

    formatDate(date?: string): string {
      if (!date) return ''
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }
  }
})
</script>
