import { authApiClient } from './client'

interface VerifyAuthCode {
  auth_code_uid: string
  code: string
}

export function apiPostAuthCode({ email }: { email: string }) {
  return authApiClient().post<{ auth_code_uid: string }>('/api/auth-code', { email })
}

export function apiPostVerifyAuthCode({ auth_code_uid, code }: VerifyAuthCode) {
  return authApiClient().post<{ token: string }>('/api/auth-code/verify', {
    auth_code_uid,
    code
  })
}
