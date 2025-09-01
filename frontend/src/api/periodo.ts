import { authApiClient } from './client'

export function apiGetPeriodos(congregacaoId: string) {
  return authApiClient().get<{ periodos: Periodo[] }>(`/api/congregacoes/${congregacaoId}/periodos`)
}