import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

interface State {
  alertOpen: boolean
  alertMessage: string
  timeoutId: number
}

export const useAlertStore = defineStore('alert', () => {
  const state = reactive<State>({
    alertOpen: false,
    alertMessage: '',
    timeoutId: 0
  })

  const alertOpen = computed(() => state.alertOpen)
  const alertMessage = computed(() => state.alertMessage)

  const closeAlert = () => {
    clearTimeout(state.timeoutId)
    state.alertOpen = false
    state.alertMessage = ''
    state.timeoutId = 0
  }

  const showAlert = (message: string, timeout = 5000) => {
    if (state.timeoutId) {
      return
    }

    state.alertOpen = true
    state.alertMessage = message
    state.timeoutId = setTimeout(closeAlert, timeout)
  }

  return {
    alertOpen,
    alertMessage,
    showAlert,
    closeAlert
  }
})