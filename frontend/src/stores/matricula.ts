import { apiGetMatriculas, apiPostMatriculas } from '@/api/matricula'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

interface State {
  matriculas: AlunoMatricula[]
}

export const useMatriculaStore = defineStore('matricula', () => {
  const state = reactive<State>({
    matriculas: []
  })

  const matriculas = computed(() => state.matriculas)

  function fetchMatriculas(classeUid: string, periodoUid: string) {
    state.matriculas = []

    apiGetMatriculas(classeUid, periodoUid)
      .then((response) => {
        state.matriculas = response.data.matriculas
      })
      .catch(() => {
        state.matriculas = []
      })
  }

  function createMatricula(matricula: CreateMatricula) {
    apiPostMatriculas(matricula)
      .then(() => {
        fetchMatriculas(matricula.classeUid, matricula.periodoUid)
      })
      .catch(() => {})
  }

  return { matriculas, fetchMatriculas, createMatricula }
})
