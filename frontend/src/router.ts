import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'

type RouteKey = 'HOME' | 'LOGIN' | 'TICKETS' | 'NEW_ORDER' | 'CONSUME'

interface RouteValue {
  name: string
  label: string
}

export const ROUTES: Record<RouteKey, RouteValue> = {
  HOME: {
    name: 'home',
    label: '',
  },
  LOGIN: {
    name: 'login',
    label: '',
  },
  TICKETS: {
    name: 'tickets',
    label: 'Minhas fichinhas',
  },
  NEW_ORDER: {
    name: 'new-order',
    label: 'Nova compra',
  },
  CONSUME: {
    name: 'consume',
    label: 'Registrar consumo',
  },
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES.HOME.name,
      component: HomeView,
    },
    {
      path: '/login',
      name: ROUTES.LOGIN.name,
      component: LoginView,
    }
  ],
})

export default router
