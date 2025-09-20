import { authApiClient } from './client'

export function apiGetMatriculas(classeUid: string, periodoUid: string) {
  return authApiClient().get<{
    matriculas: AlunoMatricula[]
  }>('/api/matriculas', {
    params: {
      classe_uid: classeUid,
      periodo_uid: periodoUid
    }
  })
}

export function apiPostMatriculas({
  alunoUid,
  classeUid,
  periodoUid
}: CreateMatricula) {
  return authApiClient().post('/api/matriculas', {
    aluno_uid: alunoUid,
    classe_uid: classeUid,
    periodo_uid: periodoUid
  })
}