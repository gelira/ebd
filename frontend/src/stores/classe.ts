import { apiGetClasses } from '@/api/classe'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

interface State {
  classes: Classe[]
}

export const useClasseStore = defineStore('classe', () => {
  const state = reactive<State>({
    classes: []
  })

  const classes = computed(() => state.classes)

  function fetchClasses() {
    apiGetClasses()
      .then((response) => {
        state.classes = response.data.classes
      })
      .catch(() => {
        state.classes = []
      })
  }

  return { classes, fetchClasses }
})
