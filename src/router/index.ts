import HomePage from '@/ui/pages/HomePage.vue'
import DomainsCatalogPage from '@/ui/pages/DomainsCatalogPage.vue'
import EquipmentsCatalogPage from '@/ui/pages/EquipmentsCatalogPage.vue'
import ProductDetailsPage from '@/ui/pages/ProductDetailsPage.vue'
import LoginPage from '@/ui/pages/LoginPage.vue'
import SignupPage from '@/ui/pages/SignupPage.vue'
import AccountPage from '@/ui/pages/AccountPage.vue'
import BecomeSellerPage from '@/ui/pages/BecomeSellerPage.vue'
import AdminDashboards from '@/ui/pages/AdminDashboards.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import CartPageVue from '@/ui/pages/CartPage.vue'
import CheckoutPage from '@/ui/pages/CheckoutPage.vue'
import OrderConfirmed from '@/ui/pages/OrderConfirmed.vue'
import UserOrdersPage from '@/ui/pages/UserOrdersPage.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    requiresRole?: string[]
  }
}
import VendorDashBoardPage from '@/ui/pages/VendorDashBoardPage.vue'
import { ROUTES } from '@/constants/const'

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/domains', component: DomainsCatalogPage, name: 'domains' },
  { path: '/equipments', component: EquipmentsCatalogPage, name: 'equipments' },
  { path: '/productDetails/:id', component: ProductDetailsPage, name: 'productDetails' },
  { path: '/login', component: LoginPage, name: 'login', meta: { requiresGuest: true } },
  { path: '/signup', component: SignupPage, name: 'signup', meta: { requiresGuest: true } },
  { path: '/account', component: AccountPage, name: 'account', meta: { requiresAuth: true } },
  { path: '/become-seller', component: BecomeSellerPage, name: 'become-seller', meta: { requiresAuth: true } },
  { path: '/orders', component: UserOrdersPage, name: 'orders' },
  { path: '/admin', component: AdminDashboards, name: 'admin', meta: { requiresAuth: true, requiresRole: ['admin', 'superadmin'] } },
  {
    path: ROUTES.VENDOR.DASHBOARD.path,
    name: ROUTES.VENDOR.DASHBOARD.name,
    component: VendorDashBoardPage,
  },
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
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Ensure persisted auth state is hydrated before checking role-based routes.
  if (authStore.isLoggedIn && !authStore.user) {
    await authStore.initialize()
  }

  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return next('/')
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/login')
  }

  if (to.meta.requiresRole) {
    const requiredRoles = Array.isArray(to.meta.requiresRole) 
      ? to.meta.requiresRole 
      : [to.meta.requiresRole]
    
    if (!requiredRoles.includes(authStore.userRole)) {
      return next('/')
    }
  }

  next()
})

globalThis.addEventListener('auth:unauthorized', () => {
  const authStore = useAuthStore()
  authStore.logout()
  router.push('/login')
})

export default router
