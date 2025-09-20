import { authApiClient } from './client'

export function apiGetClasses() {
  return authApiClient().get<{ classes: Classe[] }>('/api/classes')
}
