import { authApiClient } from './client'

export function apiGetCongregacoes() {
  return authApiClient().get<{ congregacoes: Congregacao[] }>('/api/congregacoes')
}