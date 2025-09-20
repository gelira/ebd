import { apiGetPeriodos } from '@/api/periodo'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

interface State {
  periodos: Periodo[]
}

export const usePeriodoStore = defineStore('periodo', () => {
  const state = reactive<State>({
    periodos: []
  })

  const periodos = computed(() => state.periodos)
  const periodoAtual = computed(() => state.periodos.find(p => !p.concluido))

  function fetchPeriodos() {
    const ano = new Date().getFullYear().toString()

    apiGetPeriodos(ano)
      .then((response) => {
        state.periodos = response.data.periodos
      })
      .catch(() => {
        state.periodos = []
      })
  }

  return { periodos, periodoAtual, fetchPeriodos }
})
