import { getCongregation, getCongregationsByUserId } from '@/app/_lib/db/congregation'
import { cache } from 'react'
import { getCurrentUser } from './auth'

export const getCongregationsOfCurrentUser = cache(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return await getCongregationsByUserId(user.id)
})

export const getCurrentCongregation = cache(async (id: number) => {
  const user = await getCurrentUser()

  if (!user || isNaN(id)) {
    return null
  }

  return await getCongregation({ id, userId: user.id })
})
