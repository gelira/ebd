import { authApiClient } from './client'

export function apiGetClasses(congregacaoId: string) {
  return authApiClient().get<{ classes: Classe[] }>(`/api/congregacoes/${congregacaoId}/classes`)
}

export function apiGetClasseMaticulas(classeId: string, periodoId: string) {
  return authApiClient().get<{ alunos: Aluno[] }>(`/api/classes/${classeId}/matriculas`, {
    params: {
      periodo_uid: periodoId
    }
  })
}
