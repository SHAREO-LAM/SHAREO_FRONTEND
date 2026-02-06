import HomePage from '@/ui/pages/Homepage.vue'
import DomainsCatalogPage from '@/ui/pages/DomainsCatalogPage.vue'
import EquipmentsCatalogPage from '@/ui/pages/EquipmentsCatalogPage.vue'
import ProductDetailsPage from '@/ui/pages/ProductDetailsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import VendorDashBoardPage from '@/ui/pages/VendorDashBoardPage.vue'
import { ROUTES } from '@/constants/const'

const routes = [
  { path: '/', component: HomePage },
  { path: '/domains', component: DomainsCatalogPage },
  { path: '/equipments', component: EquipmentsCatalogPage },
  { path: '/productDetails/:id', component: ProductDetailsPage },
  {
    path: ROUTES.VENDOR.DASHBOARD.path,
    name: ROUTES.VENDOR.DASHBOARD.name,
    component: VendorDashBoardPage,
  },
  {
    path: ROUTES.COMMON.SEARCH.path,
    name: ROUTES.COMMON.SEARCH.name,
    component: DomainsCatalogPage
  },
  // { path: '/listing/:id', component: ListingDetail },
  // { path: '/cart', component: CartBooking },
  // { path: '/account', component: UserAccount, meta: { requiresAuth: true } },
  // { path: '/vendor', component: VendorDashboard, meta: { requiresRole: 'vendor' } },
  // { path: '/admin', component: AdminDashboard, meta: { requiresRole: 'admin' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach((to, from, next) => {
  //const auth = useAuthStore();

  // en attente de la gestion des accès
  // if (to.meta.requiresAuth && !auth.isLoggedIn) {
  //   return next('/'); // redirect to home if not logged in
  // }

  // if (to.meta.requiresRole && auth.userRole !== to.meta.requiresRole) {
  //   return next('/'); // redirect to home if role doesn't match
  // }

  next()
})

export default router
