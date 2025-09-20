import { authApiClient } from './client'

interface VerifyAuthCode {
  authCodeUid: string
  code: string
}

export function apiPostAuthCode({ email }: { email: string }) {
  return authApiClient().post<{ auth_code_uid: string }>('/api/auth-code', { email })
}

export function apiPostVerifyAuthCode({ authCodeUid, code }: VerifyAuthCode) {
  return authApiClient().post<{ token: string }>('/api/auth-code/verify', {
    auth_code_uid: authCodeUid,
    code
  })
}
