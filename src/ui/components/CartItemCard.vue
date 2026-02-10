<template>
  <div class="bg-white rounded-xl shadow-md p-4 flex gap-4">
    <!-- IMAGE À GAUCHE + QUANTITÉ / SUPPRIMER -->
    <div class="flex flex-col w-32 flex-shrink-0">
      <div class="w-full h-24 rounded-lg overflow-hidden">
        <img
          :src="image"
          alt="Produit"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Quantité + Supprimer sous l'image -->
      <div>
        <div v-if="item.type === 'equipment'" class="mt-2 flex justify-between items-center text-sm">
          <Button
            icon="pi pi-minus"
            severity="secondary"
            size="small"
            text
            @click="cart.decreaseQuantity(item.cartItemId!)"
          />
          <span>{{ item.quantity }}</span>
          <Button
            icon="pi pi-plus"
            severity="secondary"
            size="small"
            text
            @click="cart.increaseQuantity(item.cartItemId!)"
          />
        </div>
        <div v-if="item.type === 'domain'" class="mt-2 flex justify-center items-center text-sm">
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            size="small"
            @click="cart.removeItem(item.cartItemId!)"
          />
        </div>
      </div>
    </div>

    <!-- CONTENU TEXTE -->
    <div class="flex-1 flex flex-col justify-between">
      <!-- HEADER PRIX EN HAUT À DROITE -->
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold">
            <RouterLink
              :to="{
                path: `/productDetails/${item.productId}`,
                query: { type: item.type },
              }"
              class="cursor-pointer hover:underline"
            >
              {{ item.type === 'equipment'
                ? item.product.displayName
                : item.product.name }}
            </RouterLink>
          </h3>
          <!-- BADGES -->
          <div class="flex gap-2 mt-1">
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
            <i class="pi pi-calendar" />
            {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
          </div>

          <div class="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
            <i class="pi pi-building" />
            Proposé par <p class="font-bold">{{ item.company.name }}</p>
          </div>
        </div>

        <!-- PRIX EN HAUT À DROITE -->
        <div class="text-lg font-semibold">{{ totalPrice }} €</div>
      </div>

      <!-- FOOTER : EN SAVOIR PLUS À GAUCHE -->
      <div class="mt-2">
        <Button
          :label="expanded ? 'Réduire' : 'En savoir plus'"
          :icon="expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          severity="success"
          variant="text"
          size="small"
          class="px-0"
          @click="expanded = !expanded"
        />
      </div>

      <!-- DETAILS EXPAND -->
      <div v-if="expanded" class="mt-2 text-sm space-y-2 border-t pt-2">
        <div class="flex items-center gap-1.5" v-if="item.type === 'domain'">
          <i class="pi pi-map-marker" style="color: slateblue;"/><p class="font-bold"> Adresse : </p>
          {{ item.product.houseNumber }} {{ item.product.streetName }},
          {{ item.product.postcode }} {{ item.product.city }}
        </div>

        <div class="flex items-center gap-1.5" v-else-if="item.type === 'equipment'">
          <i class="pi pi-map-marker" style="color: slateblue;"/><p class="font-bold"> Adresse de retrait : </p>
          {{ item.company.houseNumber }} {{ item.company.streetName }},
          {{ item.company.postcode }} {{ item.company.city }}
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

import { getDomain } from '@/services/domain'
import { getEquipementCompany } from '@/services/equipementCompany'

import type { CartItem } from '@/types/cartItem'
import type { Domain } from '@/types/domain'
import type { EquipementCompanyRead } from '@/types/equipementCompany'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const props = defineProps<{ item: CartItem }>()
defineEmits(['remove'])

const domain = ref<Domain | null>(null)
const equipment = ref<EquipementCompanyRead | null>(null)
const expanded = ref(false)

onMounted(async () => {
  if (props.item.type === 'domain') {
    domain.value = await getDomain(props.item.productId)
  } else {
    equipment.value = await getEquipementCompany(props.item.productId)
  }
})

const totalPrice = computed(() => {
  if (props.item.type === 'equipment') {
    return props.item.unitPrice * Number(props.item.quantity || 1)
  }
  return props.item.unitPrice
})

const image = computed(() => {
  return 'https://placehold.co/400x300'
})

function formatDate(date?: string) {
  if (!date) return ''

  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
</script>
