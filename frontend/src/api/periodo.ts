import { authApiClient } from './client'

export function apiGetPeriodos(ano: string) {
  return authApiClient().get<{ periodos: Periodo[] }>('/api/periodos', {
    params: {
      ano
    }
  })
}