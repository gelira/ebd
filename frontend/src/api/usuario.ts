import { authApiClient } from './client'

export function apiGetUserInfo() {
  return authApiClient().get<UserInfo>('/api/user')
}
