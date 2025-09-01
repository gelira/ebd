import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { apiGetCongregacoes } from '@/api/congregacao'

interface State {
  congregacoes: Congregacao[]
}

export const useCongregacaoStore = defineStore('congregacao', () => {
  const state = reactive<State>({
    congregacoes: []
  })

  const congregacoes = computed(() => state.congregacoes)

  function fetchCongregacoes() {
    apiGetCongregacoes()
      .then((response) => {
        state.congregacoes = response.data.congregacoes
      })
      .catch(() => {
        state.congregacoes = []
      })
  }

  return { congregacoes, fetchCongregacoes }
})
