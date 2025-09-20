import { apiPostAuthCode, apiPostVerifyAuthCode } from '@/api/auth'
import { setToken } from '@/utils/localStorage'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

interface State {
  authCodeUid: string
}

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<State>({
    authCodeUid: ''
  })

  async function generateAuthCode(email: string) {
    const { data } = await apiPostAuthCode({ email })
    
    state.authCodeUid = data.auth_code_uid
  }

  async function verifyAuthCode(code: string) {
    if (!state.authCodeUid) {
      throw new Error('it needs generate a auth code first')
    }

    const { data } = await apiPostVerifyAuthCode({
      authCodeUid: state.authCodeUid,
      code
    })
    
    setToken(data.token)
  }

  return { generateAuthCode, verifyAuthCode }
})
