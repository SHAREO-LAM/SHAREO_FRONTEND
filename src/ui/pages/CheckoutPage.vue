<template>
  <div class="container mx-auto px-4 py-8 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Paiement</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- ================= COLONNE GAUCHE : FORMULAIRES ================= -->
      <div class="lg:col-span-2 space-y-6 order-2 lg:order-1">

        <!-- ================= FACTURATION ================= -->

        <!-- Résumé validé -->
        <div v-if="billingAccepted && billingValues && !editBilling" class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 mb-4">
              <i class="pi pi-info-circle text-blue-500" />
              <h2 class="text-lg font-semibold">Facturation</h2>
            </div>
            <div class="flex items-center gap-2">
              <Tag class="!text-black">
                <template #icon>
                  <i class="pi pi-check text-green-500" />
                </template>
                Validé
              </Tag>
              <Button
                text
                icon="pi pi-pencil"
                size="small"
                @click="editBilling = true"
                severity="warn"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-500 block mb-1">Nom complet</label>
              <p class="font-medium">{{ billingValues.firstName }} {{ billingValues.lastName }}</p>
            </div>

            <div>
              <label class="text-xs text-gray-500 block mb-1">Email</label>
              <p class="font-medium">{{ billingValues.email }}</p>
            </div>

            <div>
              <label class="text-xs text-gray-500 block mb-1">Téléphone</label>
              <p class="font-medium">{{ billingValues.phone }}</p>
            </div>

            <div>
              <label class="text-xs text-gray-500 block mb-1">Adresse complète</label>
              <p class="font-medium">
                {{ billingValues.address }}<br />
                {{ billingValues.postcode }} {{ billingValues.city }}
              </p>
            </div>
          </div>
        </div>

        <!-- Formulaire Facturation -->
        <div v-else class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-info-circle text-blue-500" />
            <h2 class="text-lg font-semibold">Facturation</h2>
          </div>

          <form @submit.prevent="handleBillingSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Prénom -->
              <div class="flex flex-col gap-2">
                <label for="firstName" :class="['font-medium', billingErrors.firstName ? 'text-red-500' : '']">
                  Prénom *
                </label>
                <InputText
                  id="firstName"
                  v-model="billingForm.firstName"
                  placeholder="Votre prénom"
                  :invalid="!!billingErrors.firstName"
                  @input="clearError('firstName')"
                />
              </div>

              <!-- Nom -->
              <div class="flex flex-col gap-2">
                <label for="lastName" :class="['font-medium', billingErrors.lastName ? 'text-red-500' : '']">
                  Nom *
                </label>
                <InputText
                  id="lastName"
                  v-model="billingForm.lastName"
                  placeholder="Votre nom"
                  :invalid="!!billingErrors.lastName"
                  @input="clearError('lastName')"
                />
              </div>

              <!-- Email -->
              <div class="flex flex-col gap-2">
                <label for="email" :class="['font-medium', billingErrors.email ? 'text-red-500' : '']">
                  Email *
                </label>
                <InputText
                  id="email"
                  v-model="billingForm.email"
                  type="email"
                  placeholder="votre@email.com"
                  :invalid="!!billingErrors.email"
                  @input="clearError('email')"
                />
              </div>

              <!-- Téléphone -->
              <div class="flex flex-col gap-2">
                <label for="phone" :class="['font-medium', billingErrors.phone ? 'text-red-500' : '']">
                  Téléphone *
                </label>
                <InputMask
                  id="phone"
                  v-model="billingForm.phone"
                  mask="99 99 99 99 99"
                  placeholder="06 12 34 56 78"
                  :invalid="!!billingErrors.phone"
                  @input="clearError('phone')"
                />
              </div>

              <!-- Adresse -->
              <div class="flex flex-col gap-2 md:col-span-2">
                <label for="address" :class="['font-medium', billingErrors.address ? 'text-red-500' : '']">
                  Adresse *
                </label>
                <InputText
                  id="address"
                  v-model="billingForm.address"
                  placeholder="Numéro et nom de rue"
                  :invalid="!!billingErrors.address"
                  @input="clearError('address')"
                />
              </div>

              <!-- Code postal -->
              <div class="flex flex-col gap-2">
                <label for="postcode" :class="['font-medium', billingErrors.postcode ? 'text-red-500' : '']">
                  Code postal *
                </label>
                <InputMask
                  id="postcode"
                  v-model="billingForm.postcode"
                  mask="99999"
                  placeholder="44000"
                  :invalid="!!billingErrors.postcode"
                  @input="clearError('postcode')"
                />
              </div>

              <!-- Ville -->
              <div class="flex flex-col gap-2">
                <label for="city" :class="['font-medium', billingErrors.city ? 'text-red-500' : '']">
                  Ville *
                </label>
                <InputText
                  id="city"
                  v-model="billingForm.city"
                  placeholder="Nantes"
                  :invalid="!!billingErrors.city"
                  @input="clearError('city')"
                />
              </div>

            </div>

            <Button
              type="submit"
              label="Valider la facturation"
              severity="success"
              class="w-full"
              icon="pi pi-check"
            />
          </form>
        </div>

        <!-- ================= PAIEMENT ================= -->

        <!-- Verrouillé -->
        <div v-if="!billingAccepted" class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-2 text-gray-500 mb-4">
            <h2 class="text-lg font-semibold">Paiement</h2>
            <i class="pi pi-lock text-sm" />
          </div>
          <p class="text-sm text-gray-500">
            Veuillez d'abord valider les informations de facturation
          </p>
        </div>

        <!-- Formulaire Paiement -->
        <div v-else class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-credit-card text-orange-500" />
            <h2 class="text-lg font-semibold">Paiement sécurisé</h2>
          </div>

          <form @submit.prevent="handlePaymentSubmit" class="space-y-4">

            <!-- Numéro de carte -->
            <div class="flex flex-col gap-2">
              <label for="cardNumber" :class="['font-medium', paymentErrors.cardNumber ? 'text-red-500' : '']">
                Numéro de carte *
              </label>
              <InputMask
                id="cardNumber"
                v-model="paymentForm.cardNumber"
                mask="9999 9999 9999 9999"
                placeholder="1234 5678 9012 3456"
                :invalid="!!paymentErrors.cardNumber"
                @input="clearPaymentError('cardNumber')"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">

              <!-- Date d'expiration -->
              <div class="flex flex-col gap-2">
                <label for="expiry" :class="['font-medium', paymentErrors.expiry ? 'text-red-500' : '']">
                  Expiration *
                </label>
                <InputMask
                  id="expiry"
                  v-model="paymentForm.expiry"
                  mask="99/99"
                  placeholder="MM/AA"
                  :invalid="!!paymentErrors.expiry"
                  @input="clearPaymentError('expiry')"
                />
              </div>

              <!-- CVC -->
              <div class="flex flex-col gap-2">
                <label for="cvc" :class="['font-medium', paymentErrors.cvc ? 'text-red-500' : '']">
                  CVC *
                </label>
                <InputMask
                  id="cvc"
                  v-model="paymentForm.cvc"
                  mask="999"
                  placeholder="123"
                  :invalid="!!paymentErrors.cvc"
                  @input="clearPaymentError('cvc')"
                />
              </div>
            </div>

            <Divider />

            <!-- Montant total -->
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span class="font-semibold text-lg">Total à payer</span>
              <span class="text-2xl font-bold text-green-600">
                {{ formatPrice(cart.totalWithCommission, 2) }} €
              </span>
            </div>

            <Button
              type="submit"
              label="Payer maintenant"
              severity="warn"
              size="large"
              class="w-full"
              icon="pi pi-lock"
              :loading="isProcessingPayment"
            />

            <p class="text-xs text-center text-gray-500">
              <i class="pi pi-shield mr-1" />
              Paiement sécurisé SSL · Vos données sont protégées
            </p>
          </form>
        </div>

      </div>

      <!-- ================= COLONNE DROITE : RÉCAPITULATIF ================= -->
      <div class="lg:col-span-1 order-1 lg:order-2">
        <div class="bg-white rounded-xl shadow-md p-6 sticky top-4">
          <h2 class="text-lg font-semibold mb-4">Récapitulatif</h2>
          <CartSummary :small="true"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCartStore } from '@/stores/cartStore'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import CartSummary from '@/ui/components/CartSummary.vue'
import { createCheckoutSession } from '@/services/checkout'

const cart = useCartStore()

/* ================= ÉTATS ================= */
const billingAccepted = ref(false)
const editBilling = ref(false)
const isProcessingPayment = ref(false)

/* ================= TYPES ================= */
type BillingForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postcode: string
  city: string
}

type PaymentForm = {
  cardNumber: string
  expiry: string
  cvc: string
}

/* ================= FACTURATION ================= */
const billingValues = ref<BillingForm | null>(null)

const billingForm = reactive<BillingForm>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
  city: ''
})

const billingErrors = reactive<Record<string, string>>({})

function clearError(field: string) {
  delete billingErrors[field]
}

function validateBillingForm(): boolean {
  // Réinitialiser les erreurs
  Object.keys(billingErrors).forEach(key => delete billingErrors[key])

  let isValid = true

  if (!billingForm.firstName || billingForm.firstName.trim().length < 2) {
    billingErrors.firstName = 'Le prénom doit contenir au moins 2 caractères'
    isValid = false
  }

  if (!billingForm.lastName || billingForm.lastName.trim().length < 2) {
    billingErrors.lastName = 'Le nom doit contenir au moins 2 caractères'
    isValid = false
  }

  if (!billingForm.email || billingForm.email.trim().length === 0) {
    billingErrors.email = 'Adresse email invalide'
    isValid = false
  }

  const phoneDigits = billingForm.phone.replace(/\s/g, '')
  if (!phoneDigits || phoneDigits.length !== 10) {
    billingErrors.phone = 'Le numéro doit contenir 10 chiffres'
    isValid = false
  }

  if (!billingForm.address || billingForm.address.trim().length < 5) {
    billingErrors.address = 'Adresse invalide'
    isValid = false
  }

  if (!billingForm.postcode || billingForm.postcode.length !== 5) {
    billingErrors.postcode = 'Code postal invalide (5 chiffres)'
    isValid = false
  }

  if (!billingForm.city || billingForm.city.trim().length < 2) {
    billingErrors.city = 'Ville invalide'
    isValid = false
  }

  return isValid
}

function handleBillingSubmit() {
  if (!validateBillingForm()) return

  // Sauvegarder les valeurs
  billingValues.value = { ...billingForm }
  billingAccepted.value = true
  editBilling.value = false
}

/* ================= PAIEMENT ================= */
const paymentForm = reactive<PaymentForm>({
  cardNumber: '',
  expiry: '',
  cvc: ''
})

const paymentErrors = reactive<Record<string, string>>({})

function clearPaymentError(field: string) {
  delete paymentErrors[field]
}

function validatePaymentForm(): boolean {
  // Réinitialiser les erreurs
  Object.keys(paymentErrors).forEach(key => delete paymentErrors[key])

  let isValid = true

  const cardDigits = paymentForm.cardNumber.replace(/\s/g, '')
  if (!cardDigits || cardDigits.length !== 16) {
    paymentErrors.cardNumber = 'Numéro de carte invalide (16 chiffres)'
    isValid = false
  }

  if (!paymentForm.expiry || paymentForm.expiry.length !== 5) {
    paymentErrors.expiry = 'Date d\'expiration invalide (MM/AA)'
    isValid = false
  } else {
    // Validation supplémentaire de la date
    const [month] = paymentForm.expiry.split('/')
    const monthNum = parseInt(month || '0')
    if (monthNum < 1 || monthNum > 12) {
      paymentErrors.expiry = 'Mois invalide (01-12)'
      isValid = false
    }
  }

  if (!paymentForm.cvc || paymentForm.cvc.length !== 3) {
    paymentErrors.cvc = 'CVC invalide (3 chiffres)'
    isValid = false
  }

  return isValid
}

async function handlePaymentSubmit() {
  if (!validatePaymentForm()) return
  if (!billingValues.value) return

  isProcessingPayment.value = true

  try {

    /*
    const orderData = {
      billing: billingValues.value,
      payment: {
        cardNumber: paymentForm.cardNumber,
        expiry: paymentForm.expiry,
        cvc: paymentForm.cvc
      },
      cartItems: cart.cartItems,
      total: cart.totalWithCommission
    }
    */
    const checkoutPayload = {
      items: cart.cartItems.map(item => ({
        type: item.type,
        productId: item.productId,
        startDate: item.startDate,
        endDate: item.endDate,
        quantity: item.quantity ?? '1',
        unitPrice: item.unitPrice
      })),
      cartTotal: cart.totalWithCommission
    }

    console.log('Payload de checkout:', checkoutPayload);

    const response = await createCheckoutSession(checkoutPayload)
    const paymentId = response.data.paymentId
    //await confirmPayment(paymentId)
    console.log('Session de paiement créée:', response.data)

  } catch (error) {
    console.error('Erreur de paiement:', error)
    alert('Erreur lors du paiement.')
  } finally {
    isProcessingPayment.value = false
  }
}

function formatPrice(value: number, digits = 2) {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}
</script>
