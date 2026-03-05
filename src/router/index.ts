import HomePage from '@/ui/pages/HomePage.vue'
import DomainsCatalogPage from '@/ui/pages/DomainsCatalogPage.vue'
import EquipmentsCatalogPage from '@/ui/pages/EquipmentsCatalogPage.vue'
import ProductDetailsPage from '@/ui/pages/ProductDetailsPage.vue'
import LoginPage from '@/ui/pages/LoginPage.vue'
import SignupPage from '@/ui/pages/SignupPage.vue'
import AccountPage from '@/ui/pages/AccountPage.vue'
import BecomeSellerPage from '@/ui/pages/BecomeSellerPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import CartPageVue from '@/ui/pages/CartPage.vue'
import CheckoutPage from '@/ui/pages/CheckoutPage.vue'
import OrderConfirmed from '@/ui/pages/OrderConfirmed.vue'

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/domains', component: DomainsCatalogPage, name: 'domains' },
  { path: '/equipments', component: EquipmentsCatalogPage, name: 'equipments' },
  { path: '/productDetails/:id', component: ProductDetailsPage, name: 'productDetails' },
  { path: '/login', component: LoginPage, name: 'login', meta: { requiresGuest: true } },
  { path: '/signup', component: SignupPage, name: 'signup', meta: { requiresGuest: true } },
  { path: '/account', component: AccountPage, name: 'account', meta: { requiresAuth: true } },
  { path: '/become-seller', component: BecomeSellerPage, name: 'become-seller', meta: { requiresAuth: true } },
  // { path: '/search', component: SearchResults },
  // { path: '/listing/:id', component: ListingDetail },
  { path: '/cart', component: CartPageVue },
  { path: '/checkout', component: CheckoutPage },
  { path: '/orderConfirmed', component: OrderConfirmed, name: 'order-confirmed' },
  // { path: '/account', component: UserAccount, meta: { requiresAuth: true } },
  // { path: '/vendor', component: VendorDashboard, meta: { requiresRole: 'vendor' } },
  // { path: '/admin', component: AdminDashboard, meta: { requiresRole: 'admin' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return next('/')
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/login')
  }

  if (to.meta.requiresRole && authStore.userRole !== to.meta.requiresRole) {
    return next('/')
  }

  next()
})

globalThis.addEventListener('auth:unauthorized', () => {
  const authStore = useAuthStore()
  authStore.logout()
  router.push('/login')
})

export default router
