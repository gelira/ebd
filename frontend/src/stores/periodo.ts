import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { apiGetPeriodos } from '@/api/periodo'

interface State {
  congregacaoId: string
  periodos: Periodo[]
}

export const usePeriodoStore = defineStore('periodo', () => {
  const state = reactive<State>({
    congregacaoId: '',
    periodos: []
  })

  const periodos = computed(() => state.periodos)
  const congregacaoId = computed(() => state.congregacaoId)

  function fetchPeriodos(congregacaoId: string) {
    apiGetPeriodos(congregacaoId)
      .then((response) => {
        state.periodos = response.data.periodos
        state.congregacaoId = congregacaoId
      })
      .catch(() => {
        state.periodos = []
        state.congregacaoId = ''
      })
  }

  return { periodos, congregacaoId, fetchPeriodos }
})
