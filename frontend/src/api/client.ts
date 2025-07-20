import axios from 'axios'

import { getToken } from '@/utils/localStorage'

function apiClient(includeToken: boolean) {
  const token = getToken()

  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    ...(includeToken && token && {
      headers: { Authorization: `JWT ${token}` }
    })
  })
}

export function noAuthApiClient() {
  return apiClient(false)
}

export function authApiClient() {
  return apiClient(true)
}
