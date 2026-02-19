<template>
  <div class="container mx-auto px-4 py-8 flex items-center justify-center">
    <div class="max-w-2xl w-full space-y-8">
      <!-- Carte principale -->
      <div class="bg-white rounded-2xl shadow-lg p-10 text-center space-y-6">

        <!-- Icône succès -->
        <div class="flex justify-center">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <i class="pi pi-check text-4xl text-green-600" />
          </div>
        </div>

        <!-- Titre -->
        <div>
          <h1 class="text-3xl font-bold text-gray-800">
            Paiement confirmé !
          </h1>
          <p class="text-gray-500 mt-2">
            Merci pour votre commande. Votre paiement a été validé avec succès.
          </p>
        </div>

        <!-- Montant -->
        <div class="bg-gray-50 rounded-xl p-6">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Montant payé</span>
            <span class="font-semibold text-green-600">
              {{ formatPrice(totalAmount) }} €
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            label="Retour à l'accueil"
            icon="pi pi-home"
            severity="secondary"
            @click="goHome"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Button from 'primevue/button'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'OrderConfirmed',

  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Button },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const totalAmount = computed(() =>
      Number(route.query.totalAmount ?? 0)
    )

    const goHome = () => {
      router.push('/')
    }

    const formatPrice = (value: number) => {
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    return {
      goHome,
      formatPrice,
      totalAmount
    }
  }
})
</script>
