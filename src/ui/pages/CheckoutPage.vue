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
              <!-- Adresse -->
              <div class="flex flex-col gap-2">
                <label for="houseNumber" :class="['font-medium', billingErrors.houseNumber ? 'text-red-500' : '']">
                  N° *
                </label>
                <InputText
                  id="houseNumber"
                  v-model="billingForm.houseNumber"
                  placeholder="12"
                  :invalid="!!billingErrors.houseNumber"
                  @input="clearError('houseNumber')"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="address" :class="['font-medium', billingErrors.address ? 'text-red-500' : '']">
                  Adresse *
                </label>
                <InputText
                  id="address"
                  v-model="billingForm.address"
                  placeholder="Nom de rue"
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

<script lang="ts">
import { defineComponent } from 'vue'
import { useCartStore } from '@/stores/cartStore'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import CartSummary from '@/ui/components/CartSummary.vue'

import { createCheckoutSession } from '@/services/checkout'
import { confirmPayment } from '@/services/payment'
import { checkDomainAvailability } from '@/services/domain'
import { checkEquipmentAvailability } from '@/services/equipementCompany'
import { useAuthStore } from '@/stores/authStore'

type BillingForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  houseNumber: string
  address: string
  postcode: string
  city: string
}

export default defineComponent({
  name: 'CheckoutPage',

  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Button,
    InputText,
    InputMask,
    Tag,
    Divider,
    CartSummary
  },

  data() {
    const auth = useAuthStore()
    return {
      cart: useCartStore(),
      auth: auth,

      /* ÉTATS */
      billingAccepted: false,
      editBilling: false,
      isProcessingPayment: false,

      /* FACTURATION */

      billingForm: {
        firstName: '',
        lastName: '',
        email: auth.user?.email || '',
        phone: '',
        houseNumber: '',
        address: '',
        postcode: '',
        city: ''
      } as BillingForm,

      billingValues: null as BillingForm | null,
      billingErrors: {} as Record<string, string>,

      /* PAIEMENT */
      paymentForm: {
        cardNumber: '',
        expiry: '',
        cvc: ''
      },

      paymentErrors: {} as Record<string, string>
    }
  },

  methods: {
    /* FACTURATION */

    clearError(field: string) {
      delete this.billingErrors[field]
    },

    validateBillingForm(): boolean {
      this.billingErrors = {}
      let isValid = true

      if (!this.billingForm.firstName || this.billingForm.firstName.trim().length < 2) {
        this.billingErrors.firstName = 'Le prénom doit contenir au moins 2 caractères'
        isValid = false
      }

      if (!this.billingForm.lastName || this.billingForm.lastName.trim().length < 2) {
        this.billingErrors.lastName = 'Le nom doit contenir au moins 2 caractères'
        isValid = false
      }

      if (!this.billingForm.email) {
        this.billingErrors.email = 'Adresse email invalide'
        isValid = false
      }

      const phoneDigits = this.billingForm.phone.replace(/\s/g, '')
      if (!phoneDigits || phoneDigits.length !== 10) {
        this.billingErrors.phone = 'Le numéro doit contenir 10 chiffres'
        isValid = false
      }

      if (!this.billingForm.address || this.billingForm.address.trim().length < 5) {
        this.billingErrors.address = 'Adresse invalide'
        isValid = false
      }

      if (!this.billingForm.houseNumber || this.billingForm.houseNumber.trim().length < 1) {
        this.billingErrors.houseNumber = 'Numéro invalide'
        isValid = false
      }

      if (!this.billingForm.postcode || this.billingForm.postcode.length !== 5) {
        this.billingErrors.postcode = 'Code postal invalide (5 chiffres)'
        isValid = false
      }

      if (!this.billingForm.city || this.billingForm.city.trim().length < 2) {
        this.billingErrors.city = 'Ville invalide'
        isValid = false
      }

      return isValid
    },

    handleBillingSubmit() {
      if (!this.validateBillingForm()) return

      this.billingValues = { ...this.billingForm }
      this.billingAccepted = true
      this.editBilling = false
    },

    /* PAIEMENT */

    clearPaymentError(field: string) {
      delete this.paymentErrors[field]
    },

    validatePaymentForm(): boolean {
      this.paymentErrors = {}
      let isValid = true

      const cardDigits = this.paymentForm.cardNumber.replace(/\s/g, '')
      if (!cardDigits || cardDigits.length !== 16) {
        this.paymentErrors.cardNumber = 'Numéro invalide (16 chiffres)'
        isValid = false
      }

      if (!this.paymentForm.expiry || this.paymentForm.expiry.length !== 5) {
        this.paymentErrors.expiry = 'Expiration invalide (MM/AA)'
        isValid = false
      } else {
        const [month] = this.paymentForm.expiry.split('/')
        const monthNum = parseInt(month || '0')
        if (monthNum < 1 || monthNum > 12) {
          this.paymentErrors.expiry = 'Mois invalide (01-12)'
          isValid = false
        }
      }

      if (!this.paymentForm.cvc || this.paymentForm.cvc.length !== 3) {
        this.paymentErrors.cvc = 'CVC invalide (3 chiffres)'
        isValid = false
      }

      return isValid
    },

    async handlePaymentSubmit() {
      if (!this.validatePaymentForm()) return
      if (!this.billingValues) return

      this.isProcessingPayment = true

      try {

        const isAvailable = await this.checkProductAvailability();
        if (!isAvailable) {
          this.isProcessingPayment = false;
          return;
        }

        const checkoutPayload = {
          items: this.cart.cartItems.map(item => ({
            type: item.type,
            productId: item.productId,
            startDate: item.startDate,
            endDate: item.endDate,
            quantity: item.quantity ?? '1',
            unitPrice: item.unitPrice
          })),
          cartTotal: this.cart.totalWithCommission,
          address: {
            name: this.billingValues?.firstName || undefined,
            lastName: this.billingValues?.lastName || undefined,
            streetName: this.billingValues?.address || undefined,
            houseNumber: this.billingValues?.houseNumber || undefined,
            postcode: this.billingValues?.postcode || undefined,
            city: this.billingValues?.city || undefined,
            country: "France",
            phone: this.billingValues?.phone || undefined
          }
        }

        const checkoutResponse = await createCheckoutSession(checkoutPayload)
        const paymentId = checkoutResponse.data.paymentId

        await confirmPayment(paymentId)

        this.cart.clear()

        this.$toast?.add({
          severity: 'success',
          summary: 'Paiement réussi',
          detail: 'Votre commande a été confirmée.',
          life: 5000
        })

        this.$router.push({
          name: 'order-confirmed',
          query: {
            totalAmount: parseFloat(checkoutResponse.data.total)
          }
        })

      } catch (error) {
        console.error(error)

        this.$toast?.add({
          severity: 'error',
          summary: 'Erreur de paiement',
          detail: 'Une erreur est survenue.',
          life: 5000
        })
      } finally {
        this.isProcessingPayment = false
      }
    },

    formatPrice(value: number, digits = 2) {
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      })
    },

    async checkProductAvailability() {
      let hasUnavailableItem = false;
      for (const item of this.cart.cartItems) {
        if (item.type === 'domain') {
          const isAvailable = await checkDomainAvailability(
            item.productId,
            item.startDate!,
            item.endDate!
          );
          if (!isAvailable) {
            this.$toast.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `Le domaine ${item.product.name} n'est plus disponible pour ces dates.`,
              life: 3000
            });
            hasUnavailableItem = true;
          }
        }else{
          const isAvailable = await checkEquipmentAvailability(
            item.productId,
            item.startDate!,
            item.endDate!,
            Number(item.quantity!)
          );
          if (!isAvailable) {
            this.$toast.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `L'équipement ${item.product.displayName} n'est plus disponible pour ces dates et cette quantité.`,
              life: 3000
            });
            hasUnavailableItem = true;
          }
        }
      }
      return !hasUnavailableItem;
    },
  }
})
</script>
