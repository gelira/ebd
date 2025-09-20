import { apiGetUserInfo } from '@/api/usuario'
import { removeToken } from '@/utils/localStorage'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

interface State extends UserInfo {}

export const useUsuarioStore = defineStore('usuario', () => {
  const state = reactive<State>({
    nome: '',
    email: '',
    role: '',
    nome_igreja: ''
  })
  
  const nome = computed(() => state.nome)
  const email = computed(() => state.email)
  const role = computed(() => state.role)
  const nomeIgreja = computed(() => state.nome_igreja)

  async function fetchUserInfo() {
    try {
      const { data } = await apiGetUserInfo()
      state.nome = data.nome
      state.email = data.email
      state.role = data.role
      state.nome_igreja = data.nome_igreja
    } catch (e) {
      removeToken()

      state.nome = ''
      state.email = ''
      state.role = ''
      state.nome_igreja = ''

      throw e
    }
  }

  return { nome, email, role, nomeIgreja, fetchUserInfo }
})
