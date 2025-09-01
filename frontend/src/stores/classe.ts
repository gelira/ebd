import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { apiGetClasses, apiGetClasseMaticulas } from '@/api/classe'

interface State {
  congregacaoId: string
  classeId: string
  periodoId: string
  classes: Classe[]
  alunosClasse: Aluno[]
}

export const useClasseStore = defineStore('classe', () => {
  const state = reactive<State>({
    congregacaoId: '',
    classeId: '',
    periodoId: '',
    classes: [],
    alunosClasse: []
  })

  const classes = computed(() => state.classes)
  const alunosClasse = computed(() => state.alunosClasse)
  const congregacaoId = computed(() => state.congregacaoId)
  const classeId = computed(() => state.classeId)
  const periodoId = computed(() => state.periodoId)

  function fetchClasses(congregacaoId: string) {
    apiGetClasses(congregacaoId)
      .then((response) => {
        state.classes = response.data.classes
        state.congregacaoId = congregacaoId
      })
      .catch(() => {
        state.classes = []
        state.congregacaoId = ''
      })
  }

  function fetchClasseMaticulas(classeId: string, periodoId: string) {
    apiGetClasseMaticulas(classeId, periodoId)
      .then((response) => {
        state.alunosClasse = response.data.alunos
        state.classeId = classeId
        state.periodoId = periodoId
      })
      .catch(() => {
        state.alunosClasse = []
        state.classeId = ''
        state.periodoId = ''
      })
  }

  return { classes, congregacaoId, classeId, periodoId, alunosClasse, fetchClasseMaticulas, fetchClasses }
})
