import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LandingView from '@/views/LandingView.vue'
import { useAuthStore } from '@/stores/auth'
import LocationView from '../views/LocationView.vue'
import MapView from '@/views/MapView.vue'
import TripView from '@/views/TripView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/landing',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/location',
      name: 'location',
      component: LocationView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/trip',
      name: 'trip',
      component: TripView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  if (to.name === 'login') {
    next()
    return
  }

  if (!authStore.isLoggedIn) {
    next({ name: 'login' })
    return
  }

  const isAuthenticated = await authStore.checkAuth()
  if (!isAuthenticated) {
    next({ name: 'login' })
    return
  }

  next()
})

export default router
