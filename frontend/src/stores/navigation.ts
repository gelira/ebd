import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { ROUTES } from '@/router'

export const useNavigationStore = defineStore('navigation', () => {
  const router = useRouter()
  const route = useRoute()

  function navigate(routeName: string) {
    route.name !== routeName && router.push({ name: routeName })
  }

  function goToHome() {
    navigate(ROUTES.HOME.name)
  }

  function goToLogin() {
    navigate(ROUTES.LOGIN.name)
  }

  function goToTickets() {
    navigate(ROUTES.TICKETS.name)
  }

  function goToNewOrder() {
    navigate(ROUTES.NEW_ORDER.name)
  }

  function goToConsume() {
    navigate(ROUTES.CONSUME.name)
  }

  return {
    goToHome,
    goToLogin,
    goToTickets,
    goToNewOrder,
    goToConsume,
  }
})